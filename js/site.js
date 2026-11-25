/* ==========================================================================
   site.js — navigation et thème du site « Impact de l'IA sur le climat »

   Chargé dans le <head> de chaque page, SANS defer : il applique le thème
   choisi avant l'affichage (pas de flash blanc en thème sombre), puis
   prépare la page quand elle est chargée :
     - menu repliable sur petit écran (bouton « Menu ») ;
     - lien du menu de la page en cours (aria-current="page") ;
     - bouton de thème clair / sombre, mémorisé dans le navigateur ;
     - message dans une planche si une dataviz ne se charge pas ;
     - nombre de blocs « À compléter » affiché dans la console.

   Vous n'avez pas besoin de modifier ce fichier pour ajouter une page.
   ========================================================================== */
(function () {
  'use strict';

  var racine = document.documentElement;
  var CLE_THEME = 'site-ia-climat:theme';

  // Indique au CSS que JavaScript fonctionne (sinon le menu reste déplié).
  racine.classList.add('js');

  /* -- Thème : lecture et écriture protégées (stockage parfois interdit) -- */

  function lireTheme() {
    try {
      return window.localStorage.getItem(CLE_THEME);
    } catch (erreur) {
      return null;
    }
  }

  function ecrireTheme(valeur) {
    try {
      window.localStorage.setItem(CLE_THEME, valeur);
    } catch (erreur) {
      /* stockage indisponible (navigation privée, fichier local) : tant pis */
    }
  }

  var themeEnregistre = lireTheme();
  if ((themeEnregistre === 'dark' || themeEnregistre === 'light') && !racine.hasAttribute('data-theme')) {
    racine.setAttribute('data-theme', themeEnregistre);
  }

  function systemeSombre() {
    return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }

  function themeEffectif() {
    var theme = racine.getAttribute('data-theme');
    if (theme === 'dark' || theme === 'light') {
      return theme;
    }
    return systemeSombre() ? 'dark' : 'light';
  }

  function surChangementMedia(requete, fonction) {
    if (!requete) {
      return;
    }
    if (requete.addEventListener) {
      requete.addEventListener('change', fonction);
    } else if (requete.addListener) {
      requete.addListener(fonction);
    }
  }

  function initialiserTheme() {
    var bouton = document.querySelector('.bouton-theme');
    if (!bouton) {
      return;
    }

    function mettreAJour() {
      bouton.setAttribute('aria-pressed', themeEffectif() === 'dark' ? 'true' : 'false');
    }

    mettreAJour();

    bouton.addEventListener('click', function () {
      var nouveau = themeEffectif() === 'dark' ? 'light' : 'dark';
      racine.setAttribute('data-theme', nouveau);
      ecrireTheme(nouveau);
      mettreAJour();
      // Prévient les dataviz qui voudraient se redessiner.
      try {
        document.dispatchEvent(new CustomEvent('site:theme', { detail: { theme: nouveau } }));
      } catch (erreur) {
        /* navigateur trop ancien : rien à faire */
      }
    });

    if (window.matchMedia) {
      surChangementMedia(window.matchMedia('(prefers-color-scheme: dark)'), mettreAJour);
    }
  }

  /* -- Menu repliable sur petit écran -- */

  function initialiserMenu() {
    var bouton = document.querySelector('.bouton-menu');
    if (!bouton) {
      return;
    }
    var menu = document.getElementById(bouton.getAttribute('aria-controls'));
    if (!menu) {
      return;
    }

    function ouvrir(etat) {
      bouton.setAttribute('aria-expanded', etat ? 'true' : 'false');
      if (etat) {
        menu.classList.add('est-ouvert');
      } else {
        menu.classList.remove('est-ouvert');
      }
    }

    ouvrir(false);

    bouton.addEventListener('click', function () {
      ouvrir(bouton.getAttribute('aria-expanded') !== 'true');
    });

    // Échap referme le menu et rend le focus au bouton.
    document.addEventListener('keydown', function (evenement) {
      var touche = evenement.key;
      if ((touche === 'Escape' || touche === 'Esc') && bouton.getAttribute('aria-expanded') === 'true') {
        ouvrir(false);
        bouton.focus();
      }
    });

    // En passant à un grand écran, le menu redevient normal.
    if (window.matchMedia) {
      var grandEcran = window.matchMedia('(min-width: 64em)');
      surChangementMedia(grandEcran, function () {
        if (grandEcran.matches) {
          ouvrir(false);
        }
      });
    }
  }

  /* -- Lien actif : compare l'adresse de chaque lien du menu à la page -- */

  function normaliserChemin(chemin) {
    var resultat = chemin || '';
    try {
      resultat = decodeURIComponent(resultat);
    } catch (erreur) {
      /* adresse mal encodée : on la garde telle quelle */
    }
    return resultat.replace(/\/index\.html?$/i, '/');
  }

  function marquerLienActif() {
    var ici = normaliserChemin(window.location.pathname);
    var liens = document.querySelectorAll('.menu a[href]');
    for (var i = 0; i < liens.length; i += 1) {
      if (normaliserChemin(liens[i].pathname) === ici) {
        liens[i].setAttribute('aria-current', 'page');
      } else if (liens[i].getAttribute('aria-current') === 'page') {
        liens[i].removeAttribute('aria-current');
      }
    }
  }

  /* -- Dataviz absente : message clair au lieu d'un cadre vide -- */

  // Nom de la dataviz (data-dataviz) → objet global créé par son script.
  var COMPOSANTS = {
    'carte-europe': 'CarteEurope',
    'energie-ia': 'EnergieIA'
  };

  function verifierDataviz() {
    var blocs = document.querySelectorAll('[data-dataviz]');
    for (var i = 0; i < blocs.length; i += 1) {
      var bloc = blocs[i];
      var nom = bloc.getAttribute('data-dataviz');
      var objet = COMPOSANTS[nom];
      var scriptAbsent = objet ? !window[objet] : true;
      if (bloc.children.length === 0 && scriptAbsent) {
        var message = document.createElement('p');
        message.className = 'planche__message';
        message.textContent = 'Cette figure n’a pas pu s’afficher : le script de la dataviz « ' +
          nom + ' » est introuvable ou contient une erreur (dossier dataviz/' + nom + '/).';
        bloc.appendChild(message);
      }
    }
  }

  /* -- Blocs « À compléter » restants (aide avant le rendu) -- */

  function compterACompleter() {
    var nombre = document.querySelectorAll('.a-completer').length;
    if (nombre > 0 && window.console && window.console.info) {
      window.console.info('[site] ' + nombre + ' bloc(s) « À compléter » sur cette page.');
    }
  }

  /* -- Lancement -- */

  function demarrer() {
    initialiserMenu();
    marquerLienActif();
    initialiserTheme();
    compterACompleter();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', demarrer);
  } else {
    demarrer();
  }

  window.addEventListener('load', function () {
    window.setTimeout(verifierDataviz, 1500);
  });
})();
