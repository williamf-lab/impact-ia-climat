/* ==========================================================================
   energie-ia.js — composant « Électricité, eau, carbone et métaux par entreprise d'IA »

   Contrat (BRIEF.md §3) :
   - se monte tout seul sur chaque élément [data-dataviz="energie-ia"] ;
   - expose window.EnergieIA.mount(element) ;
   - lit les données dans window.DATA_ENERGIE_IA (fichier data-energie.js) ;
   - n'utilise aucune bibliothèque (d3 n'est pas nécessaire ici).

   Attribut facultatif data-vue sur l'élément :
     "tout" (par défaut) = graphique + « Ce que publient les entreprises » + « Qui publie quoi ? »
     "graphique", "publications" ou "matrice" = un seul bloc (titres dans la page hôte).

   Les textes venant des données sont toujours insérés avec textContent.
   ========================================================================== */
(function () {
  'use strict';

  var NBSP = ' ';
  var SVGNS = 'http://www.w3.org/2000/svg';
  var compteur = 0;

  // ---------- Outils ----------
  function el(tag, cls, texte) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (texte !== undefined && texte !== null) n.textContent = String(texte);
    return n;
  }

  var fmtEntier = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 });
  var fmt3 = new Intl.NumberFormat('fr-FR', { maximumSignificantDigits: 3 });

  // Nombre au format français : entier au-delà de 100, sinon 3 chiffres significatifs
  function nombre(v) {
    if (typeof v !== 'number' || !isFinite(v)) return '–';
    return Math.abs(v) >= 100 ? fmtEntier.format(v) : fmt3.format(v);
  }
  function avecUnite(v, unite) { return nombre(v) + NBSP + unite; }

  // Échelle lisible : un pas « rond » (1, 2, 2,5 ou 5 × 10^n) et un maximum qui tombe sur une graduation
  function echelle(max) {
    if (!(max > 0)) return { max: 1, graduations: [0, 1] };
    var brut = max / 4;
    var p = Math.pow(10, Math.floor(Math.log(brut) / Math.LN10));
    var r = brut / p;
    var pas = (r <= 1 ? 1 : r <= 2 ? 2 : r <= 2.5 ? 2.5 : r <= 5 ? 5 : 10) * p;
    var n = Math.ceil(max / pas - 1e-9);
    var grad = [];
    for (var i = 0; i <= n; i++) grad.push(parseFloat((i * pas).toPrecision(12)));
    return { max: grad[grad.length - 1], graduations: grad };
  }

  function couleurSure(c) {
    return /^--ia-[a-z]+$/.test(c || '') ? 'var(' + c + ')' : 'var(--autre)';
  }
  function urlSure(u) {
    return /^https:\/\/[^\s"'<>]+$/.test(u || '') ? u : null;
  }
  function dateFr(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
    return m ? m[3] + '/' + m[2] + '/' + m[1] : '';
  }
  function libelleType(type) {
    if (type === 'mesuré') return 'Mesuré par un tiers';
    if (type === 'estimé') return 'Estimé';
    if (type === 'déclaré') return 'Déclaré par l’entreprise';
    return type || '';
  }
  // « Wh pour 1 000 requêtes » -> « pour 1 000 requêtes »
  function complementUnite(vue) {
    var u = vue.uniteLongue || '';
    return u.indexOf(vue.unite) === 0 ? u.slice(vue.unite.length).trim() : u;
  }
  function pastille(entreprise) {
    var p = el('span', 'dv-energie__pastille');
    p.style.background = couleurSure(entreprise && entreprise.couleur);
    p.setAttribute('aria-hidden', 'true');
    return p;
  }
  function lien(texte, url) {
    var u = urlSure(url);
    if (!u) return document.createTextNode(texte);
    var a = el('a', null, texte);
    a.href = u;
    a.rel = 'noopener';
    a.target = '_blank';
    return a;
  }

  // ---------- Info-bulle partagée par un composant ----------
  function creerInfobulle(root) {
    var noeud = el('div', 'dv-energie__infobulle');
    noeud.hidden = true;
    noeud.setAttribute('aria-hidden', 'true'); // le même texte est donné par aria-label et la vue tableau
    var ib = { noeud: noeud, cible: null, depuis: 0 };

    ib.placer = function (cible, x, y) {
      var r = root.getBoundingClientRect();
      var w = noeud.offsetWidth;
      var h = noeud.offsetHeight;
      var c = cible.getBoundingClientRect();
      var gauche, haut;
      if (x === null || x === undefined) {          // focus clavier : sous l'élément
        gauche = c.left - r.left + Math.min(c.width * 0.3, 200);
        haut = c.bottom - r.top + 6;
      } else {                                      // souris ou doigt : près du pointeur
        gauche = x - r.left + 14;
        haut = y - r.top + 16;
      }
      var maxGauche = root.clientWidth - w - 8;
      if (gauche > maxGauche) {
        gauche = (x === null || x === undefined) ? maxGauche : Math.min(maxGauche, x - r.left - w - 14);
      }
      if (gauche < 8) gauche = 8;
      if (r.top + haut + h > window.innerHeight - 8) {  // pas de place en dessous : au-dessus
        haut = ((x === null || x === undefined) ? c.top : y) - r.top - h - 10;
      }
      if (haut < 0 && r.top + haut < 0) haut = Math.max(haut, -r.top + 8);
      noeud.style.left = Math.round(gauche) + 'px';
      noeud.style.top = Math.round(haut) + 'px';
    };
    ib.montrer = function (contenu, cible, x, y) {
      if (ib.cible && ib.cible !== cible) ib.cible.classList.remove('is-actif');
      noeud.textContent = '';
      noeud.appendChild(contenu);
      noeud.hidden = false;
      ib.cible = cible;
      ib.depuis = Date.now();
      cible.classList.add('is-actif');
      ib.placer(cible, x, y);
    };
    ib.cacher = function () {
      noeud.hidden = true;
      if (ib.cible) ib.cible.classList.remove('is-actif');
      ib.cible = null;
    };
    return ib;
  }

  // Survol (souris), focus (clavier) et toucher sur un élément
  function brancherInfobulle(ctx, cible, fabrique) {
    var ib = ctx.ib;
    var dernierType = 'mouse';
    function montrer(x, y) {
      try { ib.montrer(fabrique(), cible, x, y); } catch (e) { signaler(e); }
    }
    cible.addEventListener('pointerdown', function (ev) { dernierType = ev.pointerType || 'mouse'; });
    cible.addEventListener('pointerenter', function (ev) {
      if (ev.pointerType === 'mouse') montrer(ev.clientX, ev.clientY);
    });
    cible.addEventListener('pointermove', function (ev) {
      if (ev.pointerType === 'mouse' && ib.cible === cible) {
        try { ib.placer(cible, ev.clientX, ev.clientY); } catch (e) { signaler(e); }
      }
    });
    cible.addEventListener('pointerleave', function (ev) {
      if (ev.pointerType === 'mouse' && ib.cible === cible) ib.cacher();
    });
    cible.addEventListener('focus', function () { if (ib.cible !== cible) montrer(null, null); });
    cible.addEventListener('blur', function () { if (ib.cible === cible) ib.cacher(); });
    cible.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' || ev.key === 'Esc') ib.cacher();
    });
    cible.addEventListener('click', function (ev) {
      ev.stopPropagation();
      if (dernierType === 'mouse') return;               // la souris est gérée par le survol
      if (ib.cible === cible && !ib.noeud.hidden && Date.now() - ib.depuis > 500) {
        ib.cacher();                                     // second toucher : on referme
      } else {
        montrer(ev.clientX, ev.clientY);
      }
    });
  }

  function signaler(e) {
    if (window.console && console.error) console.error('[energie-ia]', e);
  }

  // ---------- Montage ----------
  function mount(root) {
    if (!root || root.__dvEnergie) return;
    root.__dvEnergie = true;
    try {
      var data = window.DATA_ENERGIE_IA;
      if (!data || !data.vues || !data.entreprises) {
        throw new Error('les données ne sont pas chargées (fichier data-energie.js)');
      }
      construire(root, data);
    } catch (e) {
      erreur(root, e);
    }
  }

  function erreur(root, e) {
    try {
      signaler(e);
      root.textContent = '';
      root.classList.add('dv-energie');
      var p = el('p', 'dv-energie__erreur',
        'Le graphique n’a pas pu s’afficher : ' + (e && e.message ? e.message : String(e)) + '.');
      p.setAttribute('role', 'alert');
      root.appendChild(p);
    } catch (e2) { /* rien de plus à faire */ }
  }

  function construire(root, data) {
    root.classList.add('dv-energie');
    root.textContent = '';
    var mode = String(root.getAttribute('data-vue') || 'tout').toLowerCase();
    var ctx = {
      root: root, data: data, id: 'dv-energie-' + (++compteur),
      ents: {}, vues: {}, ib: creerInfobulle(root)
    };
    data.entreprises.forEach(function (e) { ctx.ents[e.id] = e; });
    data.vues.forEach(function (v) { ctx.vues[v.id] = v; });

    var tout = (mode !== 'graphique' && mode !== 'publications' && mode !== 'matrice');
    if (tout || mode === 'graphique') root.appendChild(blocGraphique(ctx));
    if ((tout || mode === 'publications') && data.publications) root.appendChild(blocPublications(ctx, tout));
    if ((tout || mode === 'matrice') && data.matrice) root.appendChild(blocMatrice(ctx, tout));
    root.appendChild(ctx.ib.noeud);

    // Toucher ailleurs : l'info-bulle se ferme
    document.addEventListener('click', function () { ctx.ib.cacher(); });
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' || ev.key === 'Esc') ctx.ib.cacher();
    });

    // Mise en page selon la largeur du conteneur (et non de la fenêtre)
    function taille() {
      var w = root.clientWidth;
      root.classList.toggle('is-etroit', w < 560);
      root.classList.toggle('is-tres-etroit', w < 400);
      root.classList.toggle('is-compact', w < 820);
    }
    taille();
    if (window.ResizeObserver) {
      new ResizeObserver(function () { try { taille(); } catch (e) { signaler(e); } }).observe(root);
    } else {
      window.addEventListener('resize', taille);
    }
  }

  // ---------- Bloc 1 : graphique à barres avec sélecteurs ----------
  function blocGraphique(ctx) {
    var data = ctx.data;
    var bloc = el('div', 'dv-energie__bloc dv-energie__bloc--graphique');
    var etat = { indicateur: data.indicateurs[0].id, vue: data.indicateurs[0].vues[0] };
    function indicateur(id) {
      for (var i = 0; i < data.indicateurs.length; i++) if (data.indicateurs[i].id === id) return data.indicateurs[i];
      return data.indicateurs[0];
    }

    var controles = el('div', 'dv-energie__controles');
    controles.appendChild(groupeRadio(ctx.id + '-indicateur', 'Indicateur',
      data.indicateurs.map(function (i) { return { valeur: i.id, libelle: i.libelle }; }),
      etat.indicateur,
      function (v) {
        etat.indicateur = v;
        etat.vue = indicateur(v).vues[0];
        majSousChoix();
        rendre();
      }));
    var sousChoix = el('div', 'dv-energie__sous-choix');
    controles.appendChild(sousChoix);
    var corps = el('div', 'dv-energie__corps');
    bloc.appendChild(controles);
    bloc.appendChild(corps);

    function majSousChoix() {
      sousChoix.textContent = '';
      var ind = indicateur(etat.indicateur);
      if (ind.vues.length > 1) {
        sousChoix.appendChild(groupeRadio(ctx.id + '-vue-' + ind.id, 'Mesure',
          ind.vues.map(function (id) { return { valeur: id, libelle: ctx.vues[id].libelle }; }),
          etat.vue,
          function (v) { etat.vue = v; rendre(); }));
      }
    }
    function rendre() {
      try {
        ctx.ib.cacher();
        corps.textContent = '';
        var vue = ctx.vues[etat.vue];
        if (!vue) throw new Error('vue inconnue : ' + etat.vue);
        rendreVue(ctx, corps, vue);
      } catch (e) {
        signaler(e);
        corps.textContent = '';
        corps.appendChild(el('p', 'dv-energie__erreur', 'Cette vue n’a pas pu s’afficher.'));
      }
    }
    majSousChoix();
    rendre();
    return bloc;
  }

  function groupeRadio(nom, legende, options, valeur, surChangement) {
    var fs = el('fieldset', 'dv-energie__groupe');
    fs.appendChild(el('legend', null, legende));
    var liste = el('div', 'dv-energie__options');
    options.forEach(function (o) {
      var lab = el('label', 'dv-energie__option');
      var inp = document.createElement('input');
      inp.type = 'radio';
      inp.name = nom;
      inp.value = o.valeur;
      inp.checked = (o.valeur === valeur);
      inp.addEventListener('change', function () {
        if (inp.checked) {
          try { surChangement(o.valeur); } catch (e) { signaler(e); }
        }
      });
      lab.appendChild(inp);
      lab.appendChild(el('span', null, o.libelle));
      liste.appendChild(lab);
    });
    fs.appendChild(liste);
    return fs;
  }

  function rendreVue(ctx, corps, vue) {
    // En-tête : ce qui est mesuré, unité, type de valeur
    var entete = el('div', 'dv-energie__entete');
    entete.appendChild(el('p', 'dv-energie__grandeur', vue.grandeur));
    var unite = el('p', 'dv-energie__unite', 'En ' + vue.uniteLongue + ', moyenne des modèles retenus · ');
    unite.appendChild(el('span', 'dv-energie__type', libelleType(vue.type)));
    entete.appendChild(unite);
    corps.appendChild(entete);

    var avec = vue.lignes.filter(function (l) { return l.statut === 'valeur'; })
      .sort(function (a, b) { return b.valeur - a.valeur; });
    var sans = vue.lignes.filter(function (l) { return l.statut !== 'valeur'; });
    var max = 0;
    avec.forEach(function (l) {
      max = Math.max(max, l.valeur, (typeof l.max === 'number') ? l.max : 0);
    });

    var ech = echelle(max);
    max = ech.max;

    var ol = el('ol', 'dv-energie__barres');
    ol.setAttribute('aria-label', vue.grandeur + ', en ' + vue.uniteLongue + ', par ordre décroissant');
    var fourchettes = false;
    avec.forEach(function (l) {
      var r = ligneValeur(ctx, vue, l, max, ech.graduations);
      fourchettes = fourchettes || r.fourchette;
      ol.appendChild(r.li);
    });
    if (avec.length) ol.appendChild(ligneAxe(vue, ech));
    sans.forEach(function (l) { ol.appendChild(ligneVide(ctx, vue, l)); });
    corps.appendChild(ol);

    if (fourchettes) {
      var leg = el('p', 'dv-energie__legende');
      var trait = el('span', 'dv-energie__legende-trait');
      trait.setAttribute('aria-hidden', 'true');
      leg.appendChild(trait);
      leg.appendChild(el('span', null, 'Fourchette d’estimation (hypothèses basse et haute)'));
      corps.appendChild(leg);
    }
    if (vue.note) corps.appendChild(el('p', 'dv-energie__note', vue.note));

    var src = el('p', 'dv-energie__source');
    src.appendChild(document.createTextNode('Source : '));
    src.appendChild(lien(vue.source, vue.sourceUrl));
    src.appendChild(document.createTextNode('. Méthode : ' + vue.methode +
      (ctx.data.version ? ' Données consultées le ' + dateFr(ctx.data.version) + '.' : '')));
    corps.appendChild(src);

    corps.appendChild(tableauVue(ctx, vue, avec, sans));
  }

  function blocNom(entreprise, resume) {
    var d = el('div', 'dv-energie__nom');
    d.appendChild(pastille(entreprise));
    d.appendChild(el('span', 'dv-energie__entreprise', entreprise.nom));
    if (resume) d.appendChild(el('span', 'dv-energie__resume', resume));
    return d;
  }

  // Ligne de l'échelle, sous la dernière barre (décorative : les valeurs exactes sont lues ailleurs)
  function ligneAxe(vue, ech) {
    var li = el('li', 'dv-energie__ligne dv-energie__ligne--axe');
    li.setAttribute('aria-hidden', 'true');
    li.appendChild(el('div', 'dv-energie__axe-vide'));
    var piste = el('div', 'dv-energie__piste dv-energie__piste--axe');
    var zone = el('div', 'dv-energie__zone');
    ech.graduations.forEach(function (g, i) {
      var dernier = (i === ech.graduations.length - 1);
      var t = el('span', 'dv-energie__graduation' + (i === 0 ? ' is-zero' : ''),
        dernier ? avecUnite(g, vue.uniteCourte || vue.unite) : nombre(g));
      t.style.left = (g / ech.max * 100) + '%';
      zone.appendChild(t);
    });
    piste.appendChild(zone);
    li.appendChild(piste);
    return li;
  }

  function ligneValeur(ctx, vue, l, max, graduations) {
    var e = ctx.ents[l.entreprise] || { nom: l.entreprise };
    var li = el('li', 'dv-energie__ligne');
    li.tabIndex = 0;
    li.appendChild(blocNom(e, l.resume));

    var piste = el('div', 'dv-energie__piste');
    var zone = el('div', 'dv-energie__zone');
    var p = max > 0 ? l.valeur / max * 100 : 0;
    (graduations || []).forEach(function (g) {
      if (g <= 0) return;
      var trait = el('span', 'dv-energie__grille');
      trait.style.left = (g / max * 100) + '%';
      zone.appendChild(trait);
    });
    var barre = el('span', 'dv-energie__barre');
    barre.style.width = p + '%';
    barre.style.background = couleurSure(e.couleur);
    zone.appendChild(barre);
    var bout = p;
    var aFourchette = (typeof l.min === 'number' && typeof l.max === 'number' && l.max > l.min * 1.001);
    if (aFourchette) {
      var f = el('span', 'dv-energie__fourchette');
      f.style.left = (l.min / max * 100) + '%';
      f.style.width = ((l.max - l.min) / max * 100) + '%';
      zone.appendChild(f);
      bout = Math.max(bout, l.max / max * 100);
    }
    var val = el('span', 'dv-energie__valeur', avecUnite(l.valeur, vue.uniteCourte || vue.unite));
    val.style.left = bout + '%';
    zone.appendChild(val);
    piste.appendChild(zone);
    li.appendChild(piste);

    var phrase = e.nom + ' : ' + avecUnite(l.valeur, vue.unite) + ' ' + complementUnite(vue) +
      ', moyenne de ' + l.n + ' modèle' + (l.n > 1 ? 's' : '') + (l.resume ? ' (' + l.resume + ')' : '') +
      (aFourchette ? ', fourchette de ' + nombre(l.min) + ' à ' + avecUnite(l.max, vue.unite) : '') +
      '. ' + libelleType(vue.type) + '.';
    li.setAttribute('aria-label', phrase);
    brancherInfobulle(ctx, li, function () { return contenuLigne(ctx, vue, l); });
    return { li: li, fourchette: aFourchette };
  }

  function ligneVide(ctx, vue, l) {
    var e = ctx.ents[l.entreprise] || { nom: l.entreprise };
    var li = el('li', 'dv-energie__ligne dv-energie__ligne--vide');
    li.tabIndex = 0;
    li.appendChild(blocNom(e, null));
    var piste = el('div', 'dv-energie__piste');
    piste.appendChild(el('span', 'dv-energie__vide', l.texte));
    li.appendChild(piste);
    li.setAttribute('aria-label', e.nom + ' : ' + l.texte + '. ' + (l.raison || ''));
    brancherInfobulle(ctx, li, function () { return contenuLigne(ctx, vue, l); });
    return li;
  }

  // Contenu de l'info-bulle d'une ligne du graphique
  function contenuLigne(ctx, vue, l) {
    var e = ctx.ents[l.entreprise] || { nom: l.entreprise };
    var f = document.createDocumentFragment();
    var tete = el('p', 'dv-energie__ib-tete');
    tete.appendChild(pastille(e));
    tete.appendChild(el('strong', null, e.nom));
    if (e.assistant) tete.appendChild(el('span', 'dv-energie__ib-discret', '(assistant : ' + e.assistant + ')'));
    f.appendChild(tete);

    if (l.statut !== 'valeur') {
      f.appendChild(el('p', 'dv-energie__ib-valeur dv-energie__ib-valeur--vide', l.texte));
      if (l.raison) f.appendChild(el('p', null, l.raison));
      f.appendChild(el('p', 'dv-energie__ib-discret', 'Source : ' + vue.source));
      return f;
    }
    f.appendChild(el('p', 'dv-energie__ib-valeur', avecUnite(l.valeur, vue.unite)));
    var sous = complementUnite(vue) + ' · moyenne de ' + l.n + ' modèle' + (l.n > 1 ? 's' : '');
    if (l.n > 1) sous += ' · médiane ' + avecUnite(l.mediane, vue.uniteCourte || vue.unite);
    f.appendChild(el('p', 'dv-energie__ib-discret', sous));
    if (typeof l.min === 'number' && typeof l.max === 'number' && l.max > l.min * 1.001) {
      f.appendChild(el('p', null, 'Fourchette : ' + nombre(l.min) + ' à ' + avecUnite(l.max, vue.unite)));
    }
    var ul = el('ul');
    (l.modeles || []).forEach(function (m) {
      var li = el('li');
      li.appendChild(el('span', null, m.nom));
      li.appendChild(el('span', null, avecUnite(m.valeur, vue.uniteCourte || vue.unite)));
      ul.appendChild(li);
    });
    f.appendChild(ul);
    f.appendChild(el('p', 'dv-energie__ib-discret', libelleType(vue.type) + ' · ' + vue.source));
    if (l.note) f.appendChild(el('p', null, l.note));
    return f;
  }

  // Vue tableau du graphique (équivalent accessible)
  function tableauVue(ctx, vue, avec, sans) {
    var det = el('details', 'dv-energie__tableau-vue');
    det.appendChild(el('summary', null, 'Voir les données en tableau'));
    var defil = el('div', 'dv-energie__defil');
    var t = el('table');
    t.appendChild(el('caption', null, vue.grandeur + ' (' + vue.uniteLongue + ', ' + libelleType(vue.type).toLowerCase() + ')'));
    var aFourchette = avec.some(function (l) { return typeof l.min === 'number' && l.max > l.min * 1.001; });
    var entetes = ['Entreprise', 'Moyenne', 'Médiane', 'Nombre de modèles'];
    if (aFourchette) entetes.push('Fourchette');
    entetes.push('Modèles retenus');
    var thead = el('thead');
    var tr = el('tr');
    entetes.forEach(function (h, i) {
      var th = el('th', (i >= 1 && i <= 3) ? 'dv-energie__num' : null, h);
      th.scope = 'col';
      tr.appendChild(th);
    });
    thead.appendChild(tr);
    t.appendChild(thead);
    var tbody = el('tbody');
    var u = vue.uniteCourte || vue.unite;
    avec.concat(sans).forEach(function (l) {
      var e = ctx.ents[l.entreprise] || { nom: l.entreprise };
      var r = el('tr');
      var th = el('th', 'dv-energie__cellule-nom');
      th.scope = 'row';
      th.appendChild(pastille(e));
      th.appendChild(document.createTextNode(e.nom));
      r.appendChild(th);
      if (l.statut === 'valeur') {
        r.appendChild(el('td', 'dv-energie__num', avecUnite(l.valeur, u)));
        r.appendChild(el('td', 'dv-energie__num', avecUnite(l.mediane, u)));
        r.appendChild(el('td', 'dv-energie__num', String(l.n)));
        if (aFourchette) {
          r.appendChild(el('td', 'dv-energie__num',
            (typeof l.min === 'number' && l.max > l.min * 1.001) ? nombre(l.min) + ' à ' + nombre(l.max) : '–'));
        }
        r.appendChild(el('td', null, (l.modeles || []).map(function (m) {
          return m.nom + ' : ' + avecUnite(m.valeur, u);
        }).join(' ; ')));
      } else {
        var td = el('td', null, l.texte);
        td.colSpan = 3;
        r.appendChild(td);
        if (aFourchette) r.appendChild(el('td', 'dv-energie__num', '–'));
        r.appendChild(el('td', null, l.raison || ''));
      }
      tbody.appendChild(r);
    });
    t.appendChild(tbody);
    defil.appendChild(t);
    det.appendChild(defil);
    return det;
  }

  // ---------- Bloc 2 : « Ce que publient les entreprises » ----------
  function blocPublications(ctx, avecTitre) {
    var bloc = el('div', 'dv-energie__bloc dv-energie__bloc--publications');
    if (avecTitre) bloc.appendChild(el('h3', 'dv-energie__titre', 'Ce que publient les entreprises'));
    bloc.appendChild(el('p', 'dv-energie__intro',
      'Chiffres déclarés par les entreprises elles-mêmes. Chacun a son propre périmètre et sa propre unité : ' +
      'ils ne se comparent ni entre eux ni aux estimations du graphique.'));
    var defil = el('div', 'dv-energie__defil');
    var t = el('table', 'dv-energie__pub');
    t.appendChild(el('caption', null, 'Chiffres environnementaux publiés par les entreprises d’IA (recherche arrêtée au ' +
      dateFr(ctx.data.version) + ')'));
    var cols = [
      ['entreprise', 'Entreprise'], ['objet', 'Ce qui est mesuré'], ['electricite', 'Électricité'],
      ['carbone', 'Empreinte carbone'], ['eau', 'Eau'], ['metaux', 'Métaux et minéraux'],
      ['source', 'Source']
    ];
    var thead = el('thead');
    var tr = el('tr');
    cols.forEach(function (c) { var th = el('th', null, c[1]); th.scope = 'col'; tr.appendChild(th); });
    thead.appendChild(tr);
    t.appendChild(thead);
    var tbody = el('tbody');
    ctx.data.publications.forEach(function (p) {
      var e = ctx.ents[p.entreprise] || { nom: p.entreprise };
      var r = el('tr');
      var th = el('th', 'dv-energie__cellule-nom');
      th.scope = 'row';
      th.appendChild(pastille(e));
      th.appendChild(document.createTextNode(e.nom));
      r.appendChild(th);
      cols.slice(1).forEach(function (c) {
        var td;
        if (c[0] === 'source') {
          td = el('td');
          if (p.source) td.appendChild(lien(p.source, p.url));
          else td.textContent = '–';
        } else {
          var v = p[c[0]] || '';
          td = el('td', (v === 'Non publié') ? 'dv-energie__non-publie' : null, v);
        }
        td.setAttribute('data-label', c[1]);
        r.appendChild(td);
      });
      tbody.appendChild(r);
    });
    t.appendChild(tbody);
    defil.appendChild(t);
    bloc.appendChild(defil);
    return bloc;
  }

  // ---------- Bloc 3 : matrice « Qui publie quoi ? » ----------
  var LIBELLES_COURTS = { publie: 'Publié', tiers: 'Tiers', rien: 'Rien' };

  function icone(etat) {
    var s = document.createElementNS(SVGNS, 'svg');
    s.setAttribute('viewBox', '0 0 16 16');
    s.setAttribute('class', 'dv-energie__icone dv-energie__icone--' + etat);
    s.setAttribute('aria-hidden', 'true');
    s.setAttribute('focusable', 'false');
    var c = document.createElementNS(SVGNS, 'circle');
    c.setAttribute('cx', '8');
    c.setAttribute('cy', '8');
    c.setAttribute('r', '6.25');
    s.appendChild(c);
    if (etat === 'tiers') {                       // demi-disque : estimé ou mesuré par un tiers
      var p = document.createElementNS(SVGNS, 'path');
      p.setAttribute('d', 'M8 1.75 A6.25 6.25 0 0 0 8 14.25 Z');
      s.appendChild(p);
    }
    return s;
  }

  function blocMatrice(ctx, avecTitre) {
    var m = ctx.data.matrice;
    var bloc = el('div', 'dv-energie__bloc dv-energie__bloc--matrice');
    if (avecTitre) bloc.appendChild(el('h3', 'dv-energie__titre', 'Qui publie quoi ?'));

    var cles = el('ul', 'dv-energie__cles');
    ['publie', 'tiers', 'rien'].forEach(function (k) {
      var li = el('li');
      li.appendChild(icone(k));
      var lib = m.etats[k] || k;
      if (k === 'tiers') lib = 'Tiers\u00A0: ' + lib.charAt(0).toLowerCase() + lib.slice(1);
      li.appendChild(el('span', null, lib));
      cles.appendChild(li);
    });
    bloc.appendChild(cles);

    var defil = el('div', 'dv-energie__defil');
    var t = el('table', 'dv-energie__matrice');
    t.appendChild(el('caption', null, 'Pour chaque indicateur : chiffre publié par l’entreprise, seulement mesuré ou estimé par un tiers, ou rien'));
    var thead = el('thead');
    var tr = el('tr');
    var th0 = el('th', null, 'Entreprise');
    th0.scope = 'col';
    tr.appendChild(th0);
    m.colonnes.forEach(function (c) { var th = el('th', null, c.libelle); th.scope = 'col'; tr.appendChild(th); });
    thead.appendChild(tr);
    t.appendChild(thead);
    var tbody = el('tbody');
    m.lignes.forEach(function (ligne) {
      var e = ctx.ents[ligne.entreprise] || { nom: ligne.entreprise };
      var r = el('tr');
      var th = el('th', 'dv-energie__cellule-nom');
      th.scope = 'row';
      th.appendChild(pastille(e));
      th.appendChild(document.createTextNode(e.nom));
      r.appendChild(th);
      m.colonnes.forEach(function (c) {
        var cell = ligne.cellules[c.id] || { etat: 'rien', detail: '' };
        var td = el('td');
        var s = el('span', 'dv-energie__etat');
        s.tabIndex = 0;
        s.appendChild(icone(cell.etat));
        s.appendChild(el('span', 'dv-energie__etat-texte', (LIBELLES_COURTS[cell.etat] || cell.etat) + (cell.partiel ? '*' : '')));
        s.setAttribute('aria-label', e.nom + ', ' + c.libelle.toLowerCase() + ' : ' + (m.etats[cell.etat] || cell.etat) +
          (cell.partiel ? ' (partiel)' : '') + '. ' + (cell.detail || ''));
        brancherInfobulle(ctx, s, function () {
          var f = document.createDocumentFragment();
          var tete = el('p', 'dv-energie__ib-tete');
          tete.appendChild(pastille(e));
          tete.appendChild(el('strong', null, e.nom));
          tete.appendChild(el('span', 'dv-energie__ib-discret', '· ' + c.libelle));
          f.appendChild(tete);
          f.appendChild(el('p', 'dv-energie__ib-valeur dv-energie__ib-valeur--vide',
            (m.etats[cell.etat] || cell.etat) + (cell.partiel ? ' (partiel)' : '')));
          if (cell.detail) f.appendChild(el('p', null, cell.detail));
          return f;
        });
        td.appendChild(s);
        r.appendChild(td);
      });
      tbody.appendChild(r);
    });
    t.appendChild(tbody);
    defil.appendChild(t);
    bloc.appendChild(defil);
    if (m.notePartiel) bloc.appendChild(el('p', 'dv-energie__note', m.notePartiel));
    if (m.source) bloc.appendChild(el('p', 'dv-energie__source', 'Sources : ' + m.source));
    return bloc;
  }

  // ---------- Montage automatique ----------
  function toutMonter() {
    try {
      var noeuds = document.querySelectorAll('[data-dataviz="energie-ia"]');
      for (var i = 0; i < noeuds.length; i++) mount(noeuds[i]);
    } catch (e) { signaler(e); }
  }

  try {
    window.EnergieIA = { mount: mount };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', toutMonter);
    else toutMonter();
  } catch (e) { signaler(e); }
})();
