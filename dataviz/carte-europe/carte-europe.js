/* ==========================================================================
   carte-europe.js — Carte de l'Europe : quelle IA est la plus utilisée dans
   chaque pays (part des visites envoyées vers des sites web, StatCounter).

   Dépendances (à charger AVANT ce fichier) :
     - vendor/d3.min.js          d3 v7 (seule bibliothèque utilisée)
     - data-usage.js             window.DATA_USAGE_IA (généré par build_data.py)
     - vendor/world-50m.js       window.WORLD_TOPO, fond de carte (facultatif :
                                 sinon téléchargé depuis jsDelivr, voir README)

   Utilisation : <div class="dv-carte" data-dataviz="carte-europe"></div>
   Le composant se monte tout seul au chargement de la page.
   Seule variable globale : window.CarteEurope = { mount(el), topojsonFeatures() }
   ========================================================================== */
(function () {
  'use strict';

  var VERSION = '1.0.0';

  /* --- Réglages -------------------------------------------------------- */

  // Fond de carte de secours (world-atlas, données Natural Earth, domaine public)
  var URL_FOND_CDN = 'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json';

  // Largeur du bloc (px) à partir de laquelle la légende passe à droite de la carte
  var LARGEUR_LEGENDE_A_DROITE = 860;

  // Projection azimutale équivalente de Lambert centrée sur 10° E, 52° N
  // (celle des cartes européennes officielles, ETRS89-LAEA) : les surfaces
  // sont respectées, la Russie n'est pas grossie comme avec Mercator.
  var CENTRE_PROJECTION = [10, 52];

  // Cadre FIXE, en longitude / latitude : de l'Islande au Caucase et à la
  // Turquie. La carte est ajustée à ces points, jamais aux pays eux-mêmes
  // (France, Pays-Bas, Norvège ont des territoires très loin de l'Europe).
  // Ce qui dépasse du rectangle de la carte est découpé (Russie, Kazakhstan…).
  var CADRE = {
    type: 'MultiPoint',
    coordinates: [
      [-24.6, 65.5], // Islande, pointe ouest
      [-15.8, 66.6], // Islande, côte nord
      [-10.6, 51.8], // Irlande, pointe sud-ouest
      [-9.6, 36.9],  // Portugal, cap Saint-Vincent
      [-5.6, 35.9],  // détroit de Gibraltar
      [14.4, 35.7],  // Malte
      [24.0, 34.7],  // Crète, côte sud
      [33.0, 34.5],  // Chypre, côte sud
      [44.8, 36.9],  // Turquie, angle sud-est
      [51.2, 40.0],  // mer Caspienne, à l'est de l'Azerbaïdjan
      [48.0, 45.0],  // Caucase, côté nord
      [27.0, 71.2]   // cap Nord (Norvège)
    ]
  };

  // Petits pays : un cercle à leur centre permet de les survoler et de les
  // toucher. Coordonnées approximatives (lon, lat), utilisées seulement si le
  // fond de carte ne contient pas le contour du pays.
  var MICRO_ETATS = {
    AND: [1.57, 42.54],
    LIE: [9.55, 47.16],
    MCO: [7.42, 43.74],
    SMR: [12.46, 43.94],
    MLT: [14.43, 35.9],
    LUX: [6.13, 49.78]
  };

  // Territoires séparés dans Natural Earth mais rattachés à un pays des
  // données (code ISO numérique du territoire -> pays et nom affiché).
  var RATTACHEMENTS = {
    248: { iso3: 'FIN', nom: 'Åland' }
  };

  // Crimée : Natural Earth (donc world-atlas) la dessine avec la Russie
  // (frontières « de fait »). La France, l'Union européenne et l'ONU
  // (résolution 68/262 de l'Assemblée générale, 27 mars 2014) la reconnaissent
  // comme partie de l'Ukraine : on rattache ce polygone à l'Ukraine (fusion
  // propre, sans frontière intérieure). Mettre false pour le dessin d'origine.
  var CRIMEE_AVEC_UKRAINE = true;
  var BOITE_CRIMEE = [32.3, 44.2, 36.8, 46.4]; // lon min, lat min, lon max, lat max
  var NUM_RUSSIE = 643;
  var NUM_UKRAINE = 804;

  /* --- Petits outils ----------------------------------------------------- */

  var NNBSP = '\u202F'; // espace fine insécable (avant %)
  var NBSP = '\u00A0';
  var fmt1 = new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  var fmt2 = new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  var collator = new Intl.Collator('fr', { sensitivity: 'base' });
  var compteur = 0;

  function arrondi(v, n) {
    var m = Math.pow(10, n);
    return Math.round(v * m + 1e-7) / m;
  }

  // Part pour l'info-bulle : une décimale (« 43,3 % »)
  function pct(v) {
    if (v === 0) return '0' + NNBSP + '%';
    if (v > 0 && v < 0.05) return '<' + NBSP + '0,1' + NNBSP + '%';
    return fmt1.format(arrondi(v, 1)) + NNBSP + '%';
  }

  // Nombre pour le tableau : deux décimales comme la source (« 43,33 »)
  function nombre2(v) {
    return fmt2.format(arrondi(v, 2));
  }

  function varCss(nom) {
    // les noms de variables viennent du fichier de données : on les filtre
    return /^--[a-z0-9-]+$/i.test(nom || '') ? 'var(' + nom + ')' : 'var(--autre)';
  }

  // Crée un élément HTML ; les textes sont toujours insérés en textContent.
  function h(tag, attrs) {
    var el = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v === null || v === undefined || v === false) return;
        if (k === 'class') el.className = v;
        else if (k === 'text') el.textContent = v;
        else el.setAttribute(k, v === true ? '' : String(v));
      });
    }
    for (var i = 2; i < arguments.length; i++) {
      var c = arguments[i];
      if (c === null || c === undefined || c === false) continue;
      el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    }
    return el;
  }

  function svgEl(tag, attrs) {
    var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    Object.keys(attrs || {}).forEach(function (k) { el.setAttribute(k, attrs[k]); });
    return el;
  }

  function listeFr(noms) {
    if (noms.length <= 1) return noms.join('');
    return noms.slice(0, -1).join(', ') + ' et ' + noms[noms.length - 1];
  }

  /* --- Décodeur TopoJSON -> GeoJSON ---------------------------------------
     Format TopoJSON (https://github.com/topojson/topojson-specification) :
     - les lignes sont stockées une seule fois dans « arcs » ; deux pays
       voisins partagent l'arc de leur frontière ;
     - si « transform » existe, les positions sont quantifiées (entiers) et
       delta-encodées : chaque point d'un arc est un écart au point précédent,
       le premier est absolu ; lon = x * scale[0] + translate[0] ;
     - un polygone donne, pour chaque anneau, la liste de ses arcs ; un indice
       négatif i désigne l'arc ~i (= -i - 1) parcouru à l'envers ;
     - deux arcs consécutifs partagent un point (fin de l'un = début de l'autre).
     ---------------------------------------------------------------------- */
  function lireTopologie(topo) {
    var tf = topo.transform;
    var sx = tf ? tf.scale[0] : 1;
    var sy = tf ? tf.scale[1] : 1;
    var tx = tf ? tf.translate[0] : 0;
    var ty = tf ? tf.translate[1] : 0;

    var arcs = (topo.arcs || []).map(function (arc) {
      var x = 0;
      var y = 0;
      return arc.map(function (p) {
        if (!tf) return [p[0], p[1]];
        x += p[0];
        y += p[1];
        return [x * sx + tx, y * sy + ty];
      });
    });

    function point(p) { // Point et MultiPoint : quantifiés mais pas delta-encodés
      return tf ? [p[0] * sx + tx, p[1] * sy + ty] : [p[0], p[1]];
    }

    function ligne(indices) {
      var pts = [];
      indices.forEach(function (i, k) {
        var a = i < 0 ? arcs[~i].slice().reverse() : arcs[i];
        if (!a) throw new Error('fond de carte : arc ' + i + ' introuvable');
        for (var j = k > 0 ? 1 : 0; j < a.length; j++) pts.push(a[j]);
      });
      return pts;
    }

    function anneau(indices) {
      var pts = ligne(indices);
      while (pts.length && pts.length < 4) pts.push(pts[0]); // anneau dégénéré
      return pts;
    }

    function geometrie(o) {
      if (!o) return null;
      switch (o.type) {
        case 'GeometryCollection':
          return { type: 'GeometryCollection', geometries: o.geometries.map(geometrie) };
        case 'Point': return { type: 'Point', coordinates: point(o.coordinates) };
        case 'MultiPoint': return { type: 'MultiPoint', coordinates: o.coordinates.map(point) };
        case 'LineString': return { type: 'LineString', coordinates: ligne(o.arcs) };
        case 'MultiLineString': return { type: 'MultiLineString', coordinates: o.arcs.map(ligne) };
        case 'Polygon': return { type: 'Polygon', coordinates: o.arcs.map(anneau) };
        case 'MultiPolygon':
          return { type: 'MultiPolygon', coordinates: o.arcs.map(function (p) { return p.map(anneau); }) };
        default: return null;
      }
    }

    function feature(o) {
      var f = { type: 'Feature', properties: o.properties || {}, geometry: geometrie(o) };
      if (o.id !== undefined) f.id = o.id;
      return f;
    }

    return { arcs: arcs, anneau: anneau, feature: feature };
  }

  function geometriesTopo(topo, nomObjet) {
    var objets = topo.objects || {};
    var objet = objets[nomObjet || 'countries'] || objets[Object.keys(objets)[0]];
    if (!objet) throw new Error('fond de carte : objet « countries » introuvable');
    return objet.type === 'GeometryCollection' ? objet.geometries : [objet];
  }

  // TopoJSON (ou GeoJSON) -> liste de « Feature » GeoJSON en lon/lat
  function topojsonFeatures(topo, nomObjet) {
    if (!topo || typeof topo !== 'object') throw new Error('fond de carte vide');
    if (topo.type === 'FeatureCollection') return JSON.parse(JSON.stringify(topo.features)); // GeoJSON accepté aussi
    if (topo.type !== 'Topology') throw new Error('fond de carte : TopoJSON attendu');
    var T = lireTopologie(topo);
    return geometriesTopo(topo, nomObjet).map(T.feature);
  }

  /* --- Crimée : déplacement du polygone de la Russie vers l'Ukraine ------- */
  function codeGeometrie(o) {
    var p = o.properties || {};
    var brut = o.id !== undefined ? o.id : (p.iso_n3 !== undefined ? p.iso_n3 : p.ISO_N3);
    var n = parseInt(brut, 10); // '008' -> 8 ; undefined ou '-99' -> pas de code
    return isNaN(n) || n < 0 ? null : n;
  }

  function dansBoite(c, b) {
    return c[0] >= b[0] && c[0] <= b[2] && c[1] >= b[1] && c[1] <= b[3];
  }

  // Fait tourner un anneau (liste d'arcs) pour que la suite continue d'arcs
  // aux positions « positions » se retrouve à la fin ; null si pas continue.
  function suiteEnFin(anneau, positions) {
    var n = anneau.length;
    var k = positions.length;
    var dedans = {};
    positions.forEach(function (p) { dedans[p] = true; });
    var debut = -1;
    for (var i = 0; i < n; i++) {
      if (dedans[i] && !dedans[(i - 1 + n) % n]) {
        if (debut >= 0) return null; // plusieurs morceaux de frontière
        debut = i;
      }
    }
    if (debut < 0) return null;
    var out = [];
    for (var j = 0; j < n; j++) out.push(anneau[(debut + k + j) % n]);
    return out;
  }

  // Fusionne deux anneaux extérieurs qui partagent une frontière continue :
  // on retire les arcs communs et on recolle le reste (comme topojson.merge).
  function fusionnerAnneaux(a, b) {
    var inverseB = {};
    var inverseA = {};
    b.forEach(function (i) { inverseB[~i] = true; });
    a.forEach(function (i) { inverseA[~i] = true; });
    var posA = [];
    var posB = [];
    a.forEach(function (i, k) { if (inverseB[i]) posA.push(k); });
    b.forEach(function (i, k) { if (inverseA[i]) posB.push(k); });
    if (!posA.length || posA.length !== posB.length) return null;
    var ra = suiteEnFin(a, posA);
    var rb = suiteEnFin(b, posB);
    if (!ra || !rb) return null;
    var pa = ra.slice(0, a.length - posA.length);
    var pb = rb.slice(0, b.length - posB.length);
    return pa.length && pb.length ? pa.concat(pb) : null;
  }

  // Version TopoJSON (fusion propre). Renvoie une nouvelle liste de géométries :
  // le fond de carte chargé par la page n'est jamais modifié.
  function rattacherCrimeeTopo(T, geometries) {
    var iR = -1;
    var iU = -1;
    geometries.forEach(function (g, i) {
      var n = codeGeometrie(g);
      if (n === NUM_RUSSIE) iR = i;
      if (n === NUM_UKRAINE) iU = i;
    });
    if (iR < 0 || iU < 0) return { geometries: geometries, fait: false };
    var rus = geometries[iR];
    var ukr = geometries[iU];
    var polysR = rus.type === 'MultiPolygon' ? rus.arcs : rus.type === 'Polygon' ? [rus.arcs] : [];
    var k = -1;
    polysR.forEach(function (poly, i) {
      if (k >= 0 || !poly.length) return;
      var c = d3.geoCentroid({ type: 'Polygon', coordinates: [T.anneau(poly[0])] });
      if (dansBoite(c, BOITE_CRIMEE)) k = i;
    });
    if (k < 0 || polysR.length < 2) return { geometries: geometries, fait: false };
    var crimee = polysR[k];
    var resteR = polysR.filter(function (_, i) { return i !== k; });
    var polysU = ukr.type === 'MultiPolygon' ? ukr.arcs.slice() : ukr.type === 'Polygon' ? [ukr.arcs] : [];
    var fusion = false;
    for (var i = 0; i < polysU.length && !fusion; i++) {
      var m = fusionnerAnneaux(polysU[i][0], crimee[0]);
      if (m) {
        polysU[i] = [m].concat(polysU[i].slice(1), crimee.slice(1));
        fusion = true;
      }
    }
    if (!fusion) polysU.push(crimee); // repli : simple ajout du polygone
    var copie = geometries.slice();
    copie[iR] = copieGeometrie(rus, resteR);
    copie[iU] = copieGeometrie(ukr, polysU);
    return { geometries: copie, fait: true };
  }

  function copieGeometrie(g, polys) {
    var c = {};
    Object.keys(g).forEach(function (cle) { c[cle] = g[cle]; });
    c.type = polys.length > 1 ? 'MultiPolygon' : 'Polygon';
    c.arcs = polys.length > 1 ? polys : polys[0];
    return c;
  }

  // Version GeoJSON (si la page fournit un GeoJSON au lieu d'un TopoJSON)
  function rattacherCrimeeGeojson(features) {
    var rus = null;
    var ukr = null;
    features.forEach(function (f) {
      var n = codeGeometrie(f);
      if (n === NUM_RUSSIE) rus = f;
      if (n === NUM_UKRAINE) ukr = f;
    });
    if (!rus || !ukr || !rus.geometry || rus.geometry.type !== 'MultiPolygon' || !ukr.geometry) return false;
    var polys = rus.geometry.coordinates;
    for (var i = 0; i < polys.length; i++) {
      if (dansBoite(d3.geoCentroid({ type: 'Polygon', coordinates: polys[i] }), BOITE_CRIMEE)) {
        var crimee = polys.splice(i, 1)[0];
        var gU = ukr.geometry;
        if (gU.type === 'Polygon') ukr.geometry = { type: 'MultiPolygon', coordinates: [gU.coordinates, crimee] };
        else gU.coordinates.push(crimee);
        return true;
      }
    }
    return false;
  }

  // Sécurité : d3 attend des anneaux extérieurs « dans le sens des aiguilles
  // d'une montre ». Un polygone mal orienté couvrirait toute la Terre : on
  // l'inverse (sans effet sur les fichiers world-atlas, déjà bien orientés).
  function corrigerOrientation(f) {
    var g = f.geometry;
    if (!g) return f;
    var polys = g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : [];
    polys.forEach(function (anneaux) {
      if (anneaux.length && d3.geoArea({ type: 'Polygon', coordinates: anneaux }) > 2 * Math.PI) {
        anneaux.forEach(function (a) { a.reverse(); });
      }
    });
    return f;
  }

  /* --- Chargement du fond de carte (une seule fois pour toute la page) ---- */
  var promesseFond = null;

  function chargerFond() {
    if (promesseFond) return promesseFond;
    promesseFond = new Promise(function (resolve, reject) {
      function depuisReseau() {
        if (!window.fetch) {
          reject(new Error('téléchargement impossible dans ce navigateur'));
          return;
        }
        var ctrl = window.AbortController ? new AbortController() : null;
        var minuteur = setTimeout(function () { if (ctrl) ctrl.abort(); }, 15000);
        fetch(URL_FOND_CDN, ctrl ? { signal: ctrl.signal } : undefined)
          .then(function (r) {
            if (!r.ok) throw new Error('HTTP ' + r.status);
            return r.json();
          })
          .then(function (json) { clearTimeout(minuteur); resolve(json); })
          .catch(function (e) { clearTimeout(minuteur); reject(e); });
      }
      if (window.WORLD_TOPO) { resolve(window.WORLD_TOPO); return; }
      if (document.readyState === 'complete') { depuisReseau(); return; }
      // vendor/world-50m.js peut être chargé après ce script : on attend la page
      window.addEventListener('load', function () {
        if (window.WORLD_TOPO) resolve(window.WORLD_TOPO);
        else depuisReseau();
      }, { once: true });
    });
    return promesseFond;
  }

  /* --- Préparation des données ------------------------------------------- */
  function preparerDonnees(D) {
    if (!D || !Array.isArray(D.pays) || !Array.isArray(D.ias)) {
      throw new Error('données absentes : chargez data-usage.js avant carte-europe.js');
    }
    var ias = D.ias.slice(); // ordre validé des couleurs
    var autre = D.autre || { id: 'autre', label: 'Autre IA', cssVar: '--autre' };
    var parId = {};
    ias.forEach(function (ia, i) { parId[ia.id] = ia; ia.rang = i; });
    autre.rang = ias.length;
    parId[autre.id] = autre;
    var series = ias.concat([autre]);

    var pays = D.pays.map(function (p) {
      var q = {};
      Object.keys(p).forEach(function (k) { q[k] = p[k]; });
      q.num = +p.num;
      return q;
    }).sort(function (a, b) { return collator.compare(a.nom, b.nom); });

    var parIso3 = {};
    var parNum = {};
    pays.forEach(function (p) { parIso3[p.iso3] = p; parNum[p.num] = p; });

    var corrections = {};
    (D.corrections || []).forEach(function (c) {
      corrections[c.iso3 + ':' + c.ia] = c;
    });

    // IA en tête dans au moins un pays, de la plus fréquente à la plus rare
    var comptes = ias.map(function (ia) {
      var liste = pays.filter(function (p) { return p.enTete === ia.id; });
      return { ia: ia, n: liste.length, noms: liste.map(function (p) { return p.nom; }) };
    }).filter(function (c) { return c.n > 0; })
      .sort(function (a, b) { return b.n - a.n || a.ia.rang - b.ia.rang; });

    return {
      brut: D, ias: ias, autre: autre, series: series, parId: parId, pays: pays,
      parIso3: parIso3, parNum: parNum, comptes: comptes, corrections: corrections
    };
  }

  function lignesTriees(M, p) {
    return M.series.map(function (s) {
      var v = p.parts ? p.parts[s.id] : null;
      return { serie: s, v: typeof v === 'number' ? v : null };
    }).filter(function (l) { return l.v !== null; })
      .sort(function (a, b) { return b.v - a.v || a.serie.rang - b.serie.rang; });
  }

  // Contenu commun à l'info-bulle et à la fiche du menu « Choisir un pays »
  function detailPays(M, p, titre) {
    var frag = document.createDocumentFragment();
    frag.appendChild(h('p', { class: 'dv-carte__d-titre', text: titre || p.nom }));

    var tete = M.parId[p.enTete];
    var ligneTete = h('p', { class: 'dv-carte__d-tete' });
    if (p.exAequo && p.exAequo.length > 1) {
      ligneTete.appendChild(document.createTextNode('IA les plus utilisées, à égalité\u00A0: '));
      ligneTete.appendChild(h('strong', { text: listeFr(p.exAequo.map(function (id) { return M.parId[id].label; })) }));
    } else if (tete) {
      ligneTete.appendChild(document.createTextNode('IA la plus utilisée\u00A0: '));
      ligneTete.appendChild(h('strong', { text: tete.label }));
      if (tete.entreprise) ligneTete.appendChild(document.createTextNode(' (' + tete.entreprise + ')'));
    }
    frag.appendChild(ligneTete);

    // Barre segmentée 100 % (ordre validé des couleurs), sans texte
    var barre = h('div', { class: 'dv-carte__barre', 'aria-hidden': 'true' });
    M.series.forEach(function (s) {
      var v = p.parts ? p.parts[s.id] : 0;
      if (!(v >= 0.5)) return; // moins de 0,5 % : invisible, reste dans la liste
      var seg = h('span', { class: 'dv-carte__seg' });
      seg.style.flexGrow = String(v);
      seg.style.background = varCss(s.cssVar);
      barre.appendChild(seg);
    });
    frag.appendChild(barre);

    var liste = h('ul', { class: 'dv-carte__lignes' });
    lignesTriees(M, p).forEach(function (l) {
      var trait = h('span', { class: 'dv-carte__trait', 'aria-hidden': 'true' });
      trait.style.background = varCss(l.serie.cssVar);
      liste.appendChild(h('li', { class: 'dv-carte__ligne' },
        trait,
        h('span', { class: 'dv-carte__l-nom', text: l.serie.label }),
        h('span', { class: 'dv-carte__l-val', text: pct(l.v) })
      ));
    });
    frag.appendChild(liste);

    return frag;
  }

  function texteAnnonce(M, p, titre) {
    var t = (titre || p.nom) + '. ';
    var tete = M.parId[p.enTete];
    if (tete) t += 'IA la plus utilisée\u00A0: ' + tete.label + '. ';
    t += lignesTriees(M, p).map(function (l) { return l.serie.label + ' ' + pct(l.v); }).join(', ') + '.';
    return t;
  }

  function resumeCarte(M) {
    var morceaux = M.comptes.map(function (c, i) {
      var t = (i === 0 ? c.ia.label + ' est en tête dans ' : c.ia.label + ' dans ') + c.n + ' pays';
      if (c.n <= 3) t += ' (' + listeFr(c.noms) + ')';
      return t;
    });
    return 'Carte de l’Europe\u00A0: IA la plus utilisée dans chaque pays, ' + (M.brut.periode || '') +
      '. ' + morceaux.join(', ') + '. Détail par pays dans le menu «\u00A0Choisir un pays\u00A0» et dans le tableau.';
  }

  /* --- Composant ----------------------------------------------------------- */
  function creer(racine) {
    if (typeof d3 === 'undefined' || !d3.geoPath) {
      throw new Error('d3 n’est pas chargé : ajoutez vendor/d3.min.js avant carte-europe.js');
    }
    var M = preparerDonnees(window.DATA_USAGE_IA);
    var uid = 'dv-carte-' + (++compteur);

    racine.classList.add('dv-carte');
    racine.textContent = '';

    /* Squelette */
    var corps = h('div', { class: 'dv-carte__corps' });
    var zone = h('div', { class: 'dv-carte__zone' });
    var etat = h('p', { class: 'dv-carte__etat', text: 'Chargement du fond de carte…' });
    zone.appendChild(etat);
    var cote = h('div', { class: 'dv-carte__cote' });
    corps.appendChild(zone);
    corps.appendChild(cote);
    racine.appendChild(corps);

    /* Légende */
    var legende = h('div', { class: 'dv-carte__legende', role: 'group', 'aria-labelledby': uid + '-leg' });
    legende.appendChild(h('p', { class: 'dv-carte__legende-titre', id: uid + '-leg', text: 'IA la plus utilisée' }));
    var listeLegende = h('ul', { class: 'dv-carte__legende-liste' });
    var boutonsLegende = [];
    M.comptes.forEach(function (c) {
      var pastille = h('span', { class: 'dv-carte__pastille', 'aria-hidden': 'true' });
      pastille.style.background = varCss(c.ia.cssVar);
      var texte = c.ia.label + ' — ' + c.n + ' pays';
      var bouton = h('button', {
        type: 'button', class: 'dv-carte__legende-item', 'aria-pressed': 'false', 'data-ia': c.ia.id,
        title: 'Montrer seulement les pays où ' + c.ia.label + ' est en tête'
      }, pastille, h('span', { class: 'dv-carte__legende-texte', text: texte }));
      if (c.n <= 3) {
        bouton.querySelector('.dv-carte__legende-texte')
          .appendChild(h('span', { class: 'dv-carte__legende-pays', text: ' (' + listeFr(c.noms) + ')' }));
      }
      boutonsLegende.push(bouton);
      listeLegende.appendChild(h('li', null, bouton));
    });
    listeLegende.appendChild(h('li', { class: 'dv-carte__legende-nd' },
      h('span', { class: 'dv-carte__pastille dv-carte__pastille--nd', 'aria-hidden': 'true' }),
      h('span', { class: 'dv-carte__legende-texte', text: 'Pas de données' })
    ));
    legende.appendChild(listeLegende);

    var iconeMicro = svgEl('svg', { width: '14', height: '14', viewBox: '0 0 14 14', 'aria-hidden': 'true', class: 'dv-carte__icone-micro' });
    iconeMicro.appendChild(svgEl('circle', { cx: '7', cy: '7', r: '4.5' }));
    legende.appendChild(h('p', { class: 'dv-carte__legende-note' }, iconeMicro,
      'Un cercle signale les petits pays (Andorre, Liechtenstein, Luxembourg, Malte, Monaco, Saint-Marin).'));
    cote.appendChild(legende);

    /* Menu « Choisir un pays » + fiche */
    var choix = h('div', { class: 'dv-carte__choix' });
    choix.appendChild(h('label', { for: uid + '-select', class: 'dv-carte__label', text: 'Choisir un pays' }));
    var select = h('select', { id: uid + '-select', class: 'dv-carte__select' });
    select.appendChild(h('option', { value: '', text: '— Aucun —' }));
    M.pays.forEach(function (p) { select.appendChild(h('option', { value: p.iso3, text: p.nom })); });
    choix.appendChild(select);
    var fiche = h('div', { class: 'dv-carte__fiche', 'aria-live': 'polite' });
    choix.appendChild(fiche);
    cote.appendChild(choix);
    cote.appendChild(h('p', {
      class: 'dv-carte__aide',
      text: 'Survolez ou touchez un pays pour voir la répartition complète. Au clavier\u00A0: touche Tab jusqu’à la carte, puis flèches\u00A0; Échap ferme le détail.'
    }));

    /* Source et notes */
    var notes = h('div', { class: 'dv-carte__notes' });
    var D = M.brut;
    var source = h('p', { class: 'dv-carte__source' }, 'Source\u00A0: ');
    if (D.sourceUrl && /^https:\/\//.test(D.sourceUrl)) {
      source.appendChild(h('a', { href: D.sourceUrl, text: D.source || 'StatCounter Global Stats' }));
    } else {
      source.appendChild(document.createTextNode(D.source || 'StatCounter Global Stats'));
    }
    source.appendChild(document.createTextNode(
      ' — part des visites envoyées vers des sites web par chaque IA conversationnelle.'));
    notes.appendChild(source);
    racine.appendChild(notes);

    /* Vue tableau */
    var details = h('details', { class: 'dv-carte__tableau' });
    details.appendChild(h('summary', { text: 'Voir les données en tableau' }));
    details.appendChild(construireTableau(M, uid));
    racine.appendChild(details);

    /* Info-bulle et annonces pour lecteurs d'écran */
    var bulle = h('div', { class: 'dv-carte__bulle', 'aria-hidden': 'true' });
    racine.appendChild(bulle);
    var annonce = h('p', { class: 'dv-carte__vh', 'aria-live': 'polite' });
    racine.appendChild(annonce);

    /* État */
    var S = {
      items: [],         // un élément par contour de pays dessiné
      parIso3: {},       // iso3 -> éléments de carte (pays + territoires rattachés)
      micro: [],         // cercles des petits pays
      svg: null, gPays: null, gMicro: null, contourSurvol: null, contourChoix: null,
      projection: null, chemin: null, ratio: 0.8, largeur: 0, hauteur: 0,
      actif: null,       // élément survolé / touché / parcouru au clavier
      epingle: false,    // info-bulle ouverte par un toucher
      fermeParEchap: false,
      dernierFerme: null,
      indexClavier: -1,
      dernierPointeur: 'mouse',
      isolePresse: null, isoleSurvol: null,
      choix: null,
      pret: false,
      raf: 0
    };

    function sur(fn) { // tout gestionnaire d'événement passe par un try/catch
      return function (e) {
        try { return fn.call(this, e); } catch (err) {
          if (window.console) console.error('[carte-europe]', err);
          cacherBulle();
        }
      };
    }

    /* Légende : survol à la souris = aperçu ; clic, Entrée ou Espace = isoler
       les pays où cette IA est en tête (un second clic rétablit la carte). */
    boutonsLegende.forEach(function (b) {
      var id = b.getAttribute('data-ia');
      b.addEventListener('pointerenter', sur(function (e) {
        if (e.pointerType && e.pointerType !== 'mouse') return;
        S.isoleSurvol = id;
        appliquerIsolement();
      }));
      b.addEventListener('pointerleave', sur(function () { S.isoleSurvol = null; appliquerIsolement(); }));
      b.addEventListener('click', sur(function () {
        S.isoleSurvol = null;
        S.isolePresse = S.isolePresse === id ? null : id;
        boutonsLegende.forEach(function (x) {
          x.setAttribute('aria-pressed', String(x.getAttribute('data-ia') === S.isolePresse));
        });
        appliquerIsolement();
      }));
    });

    function appliquerIsolement() {
      var id = S.isoleSurvol || S.isolePresse;
      racine.classList.toggle('dv-carte--isole', !!id);
      S.items.forEach(function (it) {
        if (it.el) it.el.classList.toggle('is-isole', !!(id && it.pays && it.pays.enTete === id));
      });
      S.micro.forEach(function (m) {
        m.el.classList.toggle('is-isole', !!(id && m.pays.enTete === id));
      });
    }

    /* Menu « Choisir un pays » */
    select.addEventListener('change', sur(function () {
      var p = M.parIso3[select.value] || null;
      S.choix = p;
      fiche.textContent = '';
      if (p) fiche.appendChild(detailPays(M, p));
      dessinerContours();
    }));

    /* Chargement du fond puis dessin */
    chargerFond().then(sur(function (topo) {
      initialiserCarte(topo);
    }), sur(function (err) {
      echecFond(err);
    }));

    function echecFond(err) {
      zone.classList.add('dv-carte__zone--vide');
      etat.textContent = 'Le fond de carte n’a pas pu être chargé (fichier vendor/world-50m.js absent et pas de connexion internet). ' +
        'Les données restent consultables avec le menu «\u00A0Choisir un pays\u00A0» et dans le tableau ci-dessous.';
      etat.hidden = false;
      details.open = true;
      if (window.console && err) console.warn('[carte-europe] fond de carte indisponible :', err.message || err);
    }

    function initialiserCarte(topo) {
      if (!topo || typeof topo !== 'object') throw new Error('fond de carte vide');
      var features;
      var crimee = false;
      if (topo.type === 'Topology') {
        var T = lireTopologie(topo);
        var geoms = geometriesTopo(topo, 'countries');
        if (CRIMEE_AVEC_UKRAINE) {
          var r = rattacherCrimeeTopo(T, geoms);
          geoms = r.geometries;
          crimee = r.fait;
        }
        features = geoms.map(T.feature);
      } else {
        features = topojsonFeatures(topo, 'countries');
        if (CRIMEE_AVEC_UKRAINE) crimee = rattacherCrimeeGeojson(features);
      }
      features = features.map(corrigerOrientation);

      // Projection de référence : proportions du cadre et zone visible
      var ref = d3.geoAzimuthalEqualArea()
        .rotate([-CENTRE_PROJECTION[0], -CENTRE_PROJECTION[1]])
        .fitSize([1000, 1000], CADRE);
      var b = d3.geoPath(ref).bounds(CADRE);
      S.ratio = (b[1][1] - b[0][1]) / (b[1][0] - b[0][0]);
      var fenetre = fenetreVisible(ref, b);

      features.forEach(function (f) {
        if (!f.geometry || !intersecte(d3.geoBounds(f), fenetre)) return;
        var n = codeGeometrie(f);
        var p = n !== null ? M.parNum[n] : null;
        var titre = null;
        if (!p && n !== null && RATTACHEMENTS[n]) {
          p = M.parIso3[RATTACHEMENTS[n].iso3] || null;
          if (p) titre = RATTACHEMENTS[n].nom + ' (' + p.nom + ')';
        }
        if (!p) {
          var iso3 = f.properties && (f.properties.ISO_A3 || f.properties.iso_a3);
          if (iso3 && M.parIso3[iso3]) p = M.parIso3[iso3];
        }
        var principal = !!(p && !titre);
        var it = { f: f, pays: p, titre: titre, principal: principal, el: null, centre: null };
        S.items.push(it);
        if (p) (S.parIso3[p.iso3] = S.parIso3[p.iso3] || []).push(it);
      });
      // pays sans donnée dessous, pays des données au-dessus
      S.items.sort(function (a, b2) { return (a.pays ? 1 : 0) - (b2.pays ? 1 : 0); });

      var absents = M.pays.filter(function (p) {
        return !(S.parIso3[p.iso3] || []).some(function (it) { return it.principal; }) && !MICRO_ETATS[p.iso3];
      });
      if (absents.length && window.console) {
        console.warn('[carte-europe] pays sans contour dans le fond de carte (visibles dans le menu et le tableau) : ' +
          absents.map(function (p) { return p.nom; }).join(', '));
      }

      S.projection = d3.geoAzimuthalEqualArea().rotate([-CENTRE_PROJECTION[0], -CENTRE_PROJECTION[1]]);
      S.chemin = d3.geoPath(S.projection);

      var svg = svgEl('svg', {
        class: 'dv-carte__svg', role: 'img', tabindex: '0', focusable: 'true',
        'aria-label': resumeCarte(M)
      });
      var gPays = svgEl('g', { class: 'dv-carte__groupe-pays' });
      var gContours = svgEl('g', { class: 'dv-carte__groupe-contours' });
      var gMicro = svgEl('g', { class: 'dv-carte__groupe-micro' });
      svg.appendChild(gPays);
      svg.appendChild(gContours);
      svg.appendChild(gMicro);

      S.items.forEach(function (it) {
        var path = svgEl('path', { class: 'dv-carte__pays' + (it.pays ? ' dv-carte__pays--donnees' : '') });
        if (it.pays) {
          path.style.fill = varCss((M.parId[it.pays.enTete] || M.autre).cssVar);
          path.setAttribute('data-iso3', it.pays.iso3);
        } else {
          path.style.fill = 'var(--nodata)';
        }
        it.el = path;
        path.__item = it;
        gPays.appendChild(path);
      });

      S.contourChoix = svgEl('path', { class: 'dv-carte__contour dv-carte__contour--choix' });
      S.contourSurvol = svgEl('path', { class: 'dv-carte__contour dv-carte__contour--survol' });
      gContours.appendChild(S.contourChoix);
      gContours.appendChild(S.contourSurvol);

      M.pays.forEach(function (p) {
        if (!MICRO_ETATS[p.iso3]) return;
        var g = svgEl('g', { class: 'dv-carte__micro', 'data-iso3': p.iso3 });
        g.appendChild(svgEl('circle', { class: 'dv-carte__micro-cible', r: '12' }));
        var point = svgEl('circle', { class: 'dv-carte__micro-point', r: '4.5' });
        point.style.fill = varCss((M.parId[p.enTete] || M.autre).cssVar);
        g.appendChild(point);
        var m = { pays: p, titre: null, el: g, centre: null, micro: true };
        g.__item = m;
        S.micro.push(m);
        gMicro.appendChild(g);
      });

      S.svg = svg;
      zone.insertBefore(svg, etat);
      etat.hidden = true;
      brancherEvenements(svg);
      S.pret = true;
      mettreEnPage(true);
      appliquerIsolement();
    }

    function fenetreVisible(proj, b) {
      // longitudes / latitudes visibles : on inverse des points du bord du cadre
      var lon0 = 180, lon1 = -180, lat0 = 90, lat1 = -90;
      var x0 = b[0][0], y0 = b[0][1], x1 = b[1][0], y1 = b[1][1];
      var mx = (x1 - x0) * 0.08, my = (y1 - y0) * 0.08;
      x0 -= mx; x1 += mx; y0 -= my; y1 += my;
      for (var i = 0; i <= 32; i++) {
        var t = i / 32;
        [[x0 + t * (x1 - x0), y0], [x0 + t * (x1 - x0), y1], [x0, y0 + t * (y1 - y0)], [x1, y0 + t * (y1 - y0)]]
          .forEach(function (pt) {
            var ll = proj.invert(pt);
            if (!ll || !isFinite(ll[0]) || !isFinite(ll[1])) return;
            lon0 = Math.min(lon0, ll[0]); lon1 = Math.max(lon1, ll[0]);
            lat0 = Math.min(lat0, ll[1]); lat1 = Math.max(lat1, ll[1]);
          });
      }
      var pole = proj([0, 90]);
      if (pole && pole[0] >= x0 && pole[0] <= x1 && pole[1] >= y0 && pole[1] <= y1) {
        lon0 = -180; lon1 = 180; lat1 = 90;
      }
      return [lon0 - 5, Math.max(-90, lat0 - 5), lon1 + 5, Math.min(90, lat1 + 5)];
    }

    function intersecte(bornes, fen) {
      var bx0 = bornes[0][0], by0 = bornes[0][1], bx1 = bornes[1][0], by1 = bornes[1][1];
      if (!isFinite(bx0) || by1 < fen[1] || by0 > fen[3]) return false;
      if (bx0 <= bx1) return bx1 >= fen[0] && bx0 <= fen[2];
      return bx0 <= fen[2] || bx1 >= fen[0]; // à cheval sur l'antiméridien (Russie)
    }

    /* Mise en page : la carte suit la largeur du bloc */
    function mettreEnPage(force) {
      var largeurBloc = racine.clientWidth;
      if (!largeurBloc) return;
      racine.classList.toggle('dv-carte--large', largeurBloc >= LARGEUR_LEGENDE_A_DROITE);
      if (!S.pret) return;
      var w = Math.floor(zone.clientWidth);
      if (!w || (!force && w === S.largeur)) return;
      var marge = Math.round(Math.max(4, Math.min(14, w * 0.015)));
      var hgt = Math.round((w - 2 * marge) * S.ratio + 2 * marge);
      S.largeur = w;
      S.hauteur = hgt;
      S.projection
        .clipExtent(null)
        .fitExtent([[marge, marge], [w - marge, hgt - marge]], CADRE)
        .clipExtent([[0, 0], [w, hgt]]);
      S.svg.setAttribute('width', w);
      S.svg.setAttribute('height', hgt);
      S.svg.setAttribute('viewBox', '0 0 ' + w + ' ' + hgt);
      racine.style.setProperty('--dv-carte-trait', w < 520 ? '0.5px' : '0.75px');

      S.items.forEach(function (it) {
        var d = S.chemin(it.f);
        if (d) it.el.setAttribute('d', d); else it.el.removeAttribute('d');
        it.centre = it.pays ? centreVisible(it.f) : null;
      });
      S.micro.forEach(function (m) {
        var c = null;
        var elts = (S.parIso3[m.pays.iso3] || []).filter(function (it) { return it.principal; });
        if (elts.length && elts[0].centre) c = elts[0].centre;
        if (!c) c = S.projection(MICRO_ETATS[m.pays.iso3]);
        m.centre = c;
        m.el.setAttribute('transform', 'translate(' + c[0].toFixed(1) + ',' + c[1].toFixed(1) + ')');
      });
      cacherBulle();
      dessinerContours();
    }

    function centreVisible(f) {
      var g = f.geometry;
      var cible = f;
      if (g && g.type === 'MultiPolygon') {
        var max = -1;
        g.coordinates.forEach(function (c) {
          var poly = { type: 'Polygon', coordinates: c };
          var a = S.chemin.area(poly);
          if (a > max) { max = a; cible = poly; }
        });
      }
      var c = S.chemin.centroid(cible);
      return isFinite(c[0]) && isFinite(c[1]) ? c : null;
    }

    function cheminsDe(liste) {
      return liste.map(function (it) { return it.el && it.el.getAttribute('d'); }).filter(Boolean).join('');
    }

    function dessinerContours() {
      if (!S.pret) return;
      // contour du pays choisi dans le menu
      var dChoix = '';
      if (S.choix) dChoix = cheminsDe((S.parIso3[S.choix.iso3] || []));
      if (dChoix) S.contourChoix.setAttribute('d', dChoix); else S.contourChoix.removeAttribute('d');
      // contour du pays survolé
      var dSurvol = '';
      if (S.actif && !S.actif.micro) dSurvol = cheminsDe([S.actif]);
      if (dSurvol) S.contourSurvol.setAttribute('d', dSurvol); else S.contourSurvol.removeAttribute('d');
      S.micro.forEach(function (m) {
        m.el.classList.toggle('is-actif', S.actif === m || (S.choix === m.pays));
      });
    }

    /* Info-bulle */
    function montrerBulle(item, x, y, mode) {
      if (!item || !item.pays) return;
      var change = S.actif !== item;
      S.actif = item;
      if (change || !bulle.classList.contains('is-visible')) {
        bulle.textContent = '';
        bulle.appendChild(detailPays(M, item.pays, item.titre));
      }
      bulle.classList.add('is-visible');
      placerBulle(x, y, mode);
      dessinerContours();
    }

    function placerBulle(x, y, mode) {
      var W = racine.clientWidth;
      var H = racine.clientHeight;
      var bw = bulle.offsetWidth;
      var bh = bulle.offsetHeight;
      var ecart = mode === 'toucher' ? 20 : 14;
      var bord = 4;
      var gauche = x + ecart;
      if (gauche + bw > W - bord) gauche = x - ecart - bw;
      if (gauche < bord) gauche = Math.max(bord, Math.min(W - bw - bord, x - bw / 2));
      var haut = mode === 'toucher' ? y - ecart - bh : y + ecart;
      if (haut < bord) haut = y + ecart;
      if (haut + bh > H - bord) haut = y - ecart - bh;
      haut = Math.max(bord, Math.min(H - bh - bord, haut));
      bulle.style.transform = 'translate(' + Math.round(gauche) + 'px,' + Math.round(haut) + 'px)';
    }

    function cacherBulle() {
      bulle.classList.remove('is-visible');
      S.actif = null;
      S.epingle = false;
      dessinerContours();
    }

    function positionDansBloc(clientX, clientY) {
      var r = racine.getBoundingClientRect();
      return [clientX - r.left, clientY - r.top];
    }

    function centreDansBloc(item) {
      var r = racine.getBoundingClientRect();
      var s = S.svg.getBoundingClientRect();
      var c = item.centre;
      if (!c) {
        var liste = S.parIso3[item.pays.iso3] || [];
        for (var i = 0; i < liste.length && !c; i++) c = liste[i].centre;
      }
      if (!c) c = [S.largeur / 2, S.hauteur / 2];
      return [s.left - r.left + c[0], s.top - r.top + c[1]];
    }

    function itemDepuis(cible) {
      while (cible && cible !== S.svg) {
        if (cible.__item && cible.__item.pays) return cible.__item;
        cible = cible.parentNode;
      }
      return null;
    }

    // élément de carte principal d'un pays (pour le clavier)
    function itemPrincipal(p) {
      for (var i = 0; i < S.micro.length; i++) if (S.micro[i].pays === p) return S.micro[i];
      var liste = S.parIso3[p.iso3] || [];
      for (var j = 0; j < liste.length; j++) if (liste[j].principal) return liste[j];
      return liste[0] || { pays: p, titre: null, centre: null, el: null };
    }

    function brancherEvenements(svg) {
      svg.addEventListener('pointerdown', sur(function (e) {
        S.dernierPointeur = e.pointerType || 'mouse';
      }));
      svg.addEventListener('pointermove', sur(function (e) {
        if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
        if (S.epingle) return;
        var it = itemDepuis(e.target);
        if (!it) {
          if (S.actif) cacherBulle();
          S.fermeParEchap = false;
          return;
        }
        if (S.fermeParEchap && it === S.dernierFerme) return;
        S.fermeParEchap = false;
        var pos = positionDansBloc(e.clientX, e.clientY);
        montrerBulle(it, pos[0], pos[1], 'souris');
      }));
      svg.addEventListener('pointerleave', sur(function (e) {
        if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
        if (!S.epingle) cacherBulle();
        S.fermeParEchap = false;
      }));
      svg.addEventListener('click', sur(function (e) {
        if (S.dernierPointeur === 'mouse') return;
        var it = itemDepuis(e.target);
        if (!it || (S.epingle && S.actif === it)) { cacherBulle(); return; }
        var pos = positionDansBloc(e.clientX, e.clientY);
        montrerBulle(it, pos[0], pos[1], 'toucher');
        S.epingle = true;
      }));

      // Clavier : la carte est un seul arrêt de tabulation, les flèches
      // parcourent les pays dans l'ordre alphabétique.
      svg.addEventListener('focus', sur(function () {
        var visible = true;
        try { visible = svg.matches(':focus-visible'); } catch (err) { visible = true; }
        if (!visible) return;
        if (S.indexClavier < 0) S.indexClavier = 0;
        montrerClavier();
      }));
      svg.addEventListener('blur', sur(function () {
        if (!S.epingle) cacherBulle();
      }));
      svg.addEventListener('keydown', sur(function (e) {
        var n = M.pays.length;
        var k = e.key;
        if (k === 'ArrowRight' || k === 'ArrowDown') S.indexClavier = (S.indexClavier + 1 + n) % n;
        else if (k === 'ArrowLeft' || k === 'ArrowUp') S.indexClavier = (S.indexClavier - 1 + n) % n;
        else if (k === 'Home') S.indexClavier = 0;
        else if (k === 'End') S.indexClavier = n - 1;
        else return;
        e.preventDefault();
        montrerClavier();
      }));

      function montrerClavier() {
        var p = M.pays[Math.max(0, S.indexClavier)];
        if (!p) return;
        var it = itemPrincipal(p);
        var pos = centreDansBloc(it);
        S.epingle = false;
        montrerBulle(it, pos[0], pos[1], 'clavier');
        annonce.textContent = texteAnnonce(M, p, it.titre);
      }

      // Échap ferme l'info-bulle ; toucher ailleurs ferme une info-bulle épinglée
      document.addEventListener('keydown', sur(function (e) {
        if ((e.key === 'Escape' || e.key === 'Esc') && bulle.classList.contains('is-visible')) {
          S.dernierFerme = S.actif;
          S.fermeParEchap = true;
          cacherBulle();
        }
      }));
      document.addEventListener('pointerdown', sur(function (e) {
        if (S.epingle && !itemDepuis(e.target)) cacherBulle();
      }));
    }

    /* Redimensionnement fluide */
    function planifier() {
      if (S.raf) return;
      S.raf = requestAnimationFrame(function () {
        S.raf = 0;
        try { mettreEnPage(false); } catch (err) { afficherErreur(racine, err); }
      });
    }
    if (window.ResizeObserver) {
      new ResizeObserver(planifier).observe(racine);
    } else {
      window.addEventListener('resize', planifier);
    }
    mettreEnPage(false);

    return {
      racine: racine,
      version: VERSION,
      // choisit un pays dans le menu (code ISO alpha-3, ex. 'FRA')
      choisir: function (iso3) {
        select.value = M.parIso3[iso3] ? iso3 : '';
        select.dispatchEvent(new Event('change'));
      },
      // [lon, lat] -> [x, y] en pixels dans la carte (null avant le dessin)
      projeter: function (lonlat) {
        return S.pret && S.projection ? S.projection(lonlat) : null;
      }
    };
  }

  function construireTableau(M, uid) {
    var colonnes = M.ias.slice().sort(function (a, b) { return collator.compare(a.label, b.label); });
    // Titre du tableau hors de la zone qui défile (sinon coupé sur mobile)
    var titreTableau = h('p', {
      id: uid + '-cap',
      class: 'dv-carte__tableau-titre',
      text: 'Part des visites envoyées vers des sites web par chaque IA conversationnelle, en %, ' +
        (M.brut.periode || '') + ' (' + (M.brut.source || 'StatCounter') + ')'
    });
    var defil = h('div', { class: 'dv-carte__defil', role: 'region', tabindex: '0', 'aria-labelledby': uid + '-cap' });
    var table = h('table', { class: 'dv-carte__table', 'aria-labelledby': uid + '-cap' });
    var tr = h('tr', null, h('th', { scope: 'col', text: 'Pays' }), h('th', { scope: 'col', text: 'IA en tête' }));
    colonnes.forEach(function (ia) { tr.appendChild(h('th', { scope: 'col', class: 'dv-carte__num', text: ia.label })); });
    tr.appendChild(h('th', { scope: 'col', class: 'dv-carte__num', text: M.autre.label }));
    table.appendChild(h('thead', null, tr));

    var corps = h('tbody');
    M.pays.forEach(function (p) {
      var ligne = h('tr');
      var nom = p.nom;
      ligne.appendChild(h('th', { scope: 'row', text: nom }));
      var tete = M.parId[p.enTete];
      var pastille = h('span', { class: 'dv-carte__pastille', 'aria-hidden': 'true' });
      pastille.style.background = varCss(tete ? tete.cssVar : M.autre.cssVar);
      var texteTete = p.exAequo && p.exAequo.length > 1
        ? listeFr(p.exAequo.map(function (id) { return M.parId[id].label; })) + ' (égalité)'
        : (tete ? tete.label : '');
      ligne.appendChild(h('td', { class: 'dv-carte__td-tete' }, pastille, h('span', { text: texteTete })));
      colonnes.concat([M.autre]).forEach(function (s) {
        var v = p.parts ? p.parts[s.id] : null;
        ligne.appendChild(h('td', { class: 'dv-carte__num' },
          typeof v === 'number' ? nombre2(v) : '—'));
      });
      corps.appendChild(ligne);
    });
    table.appendChild(corps);
    defil.appendChild(table);

    var conteneur = h('div', { class: 'dv-carte__tableau-corps' }, titreTableau, defil);
    return conteneur;
  }

  function afficherErreur(el, err) {
    try {
      if (window.console) console.error('[carte-europe]', err);
      el.classList.add('dv-carte', 'dv-carte--erreur');
      el.textContent = '';
      el.appendChild(h('p', {
        class: 'dv-carte__erreur',
        text: 'La carte n’a pas pu s’afficher (' + (err && err.message ? err.message : 'erreur inconnue') + ').'
      }));
    } catch (e) { /* rien de plus à faire */ }
  }

  function mount(el) {
    if (!el) return null;
    if (el.__carteEurope) return el.__carteEurope;
    try {
      el.__carteEurope = creer(el);
      return el.__carteEurope;
    } catch (err) {
      afficherErreur(el, err);
      return null;
    }
  }

  function monterTout() {
    try {
      var blocs = document.querySelectorAll('[data-dataviz="carte-europe"]');
      for (var i = 0; i < blocs.length; i++) mount(blocs[i]);
    } catch (err) {
      if (window.console) console.error('[carte-europe]', err);
    }
  }

  window.CarteEurope = { mount: mount, topojsonFeatures: topojsonFeatures, version: VERSION };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', monterTout);
  else monterTout();
})();
