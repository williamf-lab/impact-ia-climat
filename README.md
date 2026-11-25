# Impact de l'IA sur le climat : le site du groupe

Site web du groupe pour le défi **« L'impact environnemental de l'IA générative »**, proposé par l'ADEME sur [defis.data.gouv.fr](https://defis.data.gouv.fr/defis/limpact-environnemental-de-lia-generative) dans le cadre de l'Open Data University. Le résumé du défi (questions, jeux de données, forme de rendu) est dans [`docs/defi.md`](docs/defi.md).

Le site est **statique** : des fichiers HTML, CSS et JavaScript, sans installation ni étape de construction. Il fonctionne en ouvrant `index.html` d'un double-clic, et en ligne sur GitHub Pages.

## Sommaire

1. [Arborescence](#arborescence)
2. [Ouvrir le site en local](#ouvrir-le-site-en-local)
3. [Remplacer un bloc « À compléter »](#remplacer-un-bloc--à-compléter-)
4. [Ajouter sa page](#ajouter-sa-page)
5. [Insérer une figure (image ou dataviz)](#insérer-une-figure)
6. [Règles communes pour éviter les conflits](#règles-communes-pour-éviter-les-conflits)
7. [Identité visuelle](#identité-visuelle)
8. [Mettre le site en ligne sur GitHub Pages](#mettre-le-site-en-ligne-sur-github-pages)
9. [Publier la réutilisation sur data.gouv.fr](#publier-la-réutilisation-sur-datagouvfr)
10. [Vérifications avant le rendu](#vérifications-avant-le-rendu)
11. [Crédits et licences](#crédits-et-licences)

## Arborescence

```
index.html                  Accueil du groupe
pages/
  data-centers.html         Partie 1 (sous-groupe 1) : les data centers
  conversation.html         Partie 2 (sous-groupe 2) : le coût d'une conversation avec l'IA
  transparence.html         Partie 3 (sous-groupe 3) : transparence des IA (carte + graphique énergie)
  conclusion.html           Conclusion du groupe
  methodologie.html         Données, licence du site, façon de travailler
  _modele.html              Page modèle à copier (hors menu)
css/
  tokens.css                Couleurs, police, espacements partagés (NE PAS MODIFIER)
  style.css                 Mise en page du site
js/
  site.js                   Menu mobile, lien actif, thème clair / sombre
assets/
  favicon.svg               Icône du site
  <sous-groupe>/            Vos images (un dossier par sous-groupe, à créer)
dataviz/
  carte-europe/             Carte de l'Europe (composant, données, démo, README)
  energie-ia/               Graphique énergie par entreprise (idem)
vendor/                     Bibliothèques tierces : D3, fond de carte (NE PAS MODIFIER)
docs/
  defi.md                   Le défi en détail
.nojekyll                   Fichier vide nécessaire à GitHub Pages (voir plus bas)
```

## Ouvrir le site en local

1. Téléchargez ou clonez le dossier.
2. Double-cliquez sur `index.html` : le site s'ouvre dans votre navigateur.

Sans connexion internet, la police Hanken Grotesk ne se charge pas et une police du système la remplace : c'est normal.

Pourquoi les données sont dans des fichiers `.js` et pas `.csv` ou `.json` : en ouvrant une page par double-clic (adresse `file://`), le navigateur interdit de lire un autre fichier avec `fetch()`. Un fichier `.js` qui définit une variable (`window.NOM_DES_DONNEES = {...}`) se charge, lui, avec une simple balise `<script>`.

## Remplacer un bloc « À compléter »

Les textes à écrire par le groupe sont des blocs hachurés, bien visibles :

```html
<div class="a-completer">
  <p><strong>À compléter par le sous-groupe Transparence :</strong> ce que montre la carte…</p>
</div>
```

Remplacez **tout le bloc** (de `<div class="a-completer">` à `</div>`) par vos paragraphes :

```html
<p>Votre texte, avec ses chiffres et leurs sources.</p>
<p>Un deuxième paragraphe si besoin.</p>
```

Les petites mentions dans une phrase ou un tableau sont des `<span class="a-completer a-completer--en-ligne">…</span>` : remplacez le `<span>` entier par votre texte.

Pour retrouver ceux qui restent : cherchez `a-completer` dans tous les fichiers (dans VS Code : Ctrl+Maj+F ou Cmd+Maj+F). La console du navigateur (touche F12, onglet Console) affiche aussi le nombre de blocs restants sur la page ouverte.

**Ne rien inventer** : chaque chiffre a une source citée (lien) et une date.

## Ajouter sa page

Chaque partie a déjà sa page dans le menu : `pages/data-centers.html` (partie 1), `pages/conversation.html` (partie 2) et `pages/transparence.html` (partie 3). Les textes viennent du document de rédaction du groupe.

Pour créer une page en plus :

1. Copiez `pages/_modele.html` dans `pages/` et renommez la copie : minuscules, sans accents ni espaces, mots séparés par des tirets (par exemple `pages/data-centers.html`).
2. Dans la copie, changez le `<title>`, la `<meta name="description">`, le `<h1>` et le fil d'Ariane. Supprimez la ligne `<meta name="robots" content="noindex">` et les commentaires d'aide.
3. Ajoutez la page au menu. Le menu est écrit **dans chaque page** (7 fichiers : `index.html` et les 6 pages de `pages/`). Ajoutez la même ligne au même endroit dans tous :
   - dans `index.html` : `<li><a href="pages/data-centers.html">Data centers</a></li>`
   - dans les pages de `pages/` : `<li><a href="data-centers.html">Data centers</a></li>`
4. Ajoutez la page au sommaire de l'accueil (`index.html`, liste `class="sommaire"`).

Le lien de la page ouverte est mis en évidence automatiquement par `js/site.js` : rien à faire.

Pour **renommer** une page : renommez le fichier, puis cherchez son ancien nom dans tous les fichiers et remplacez chaque lien.

Le menu et l'accueil sont partagés : **une seule personne** les modifie, en une fois, après accord du groupe (voir les règles communes).

## Insérer une figure

Chaque figure est posée dans une **planche** : un bloc blanc avec un trait gradué en haut, un titre numéroté, un sous-titre (ce qui est mesuré et l'unité) et une source.

### Une image

1. Enregistrez l'image dans `assets/<votre-sous-groupe>/` (par exemple `assets/data-centers/carte-france.png`). PNG ou SVG pour un graphique, JPG pour une photo, moins de 2 000 px de large et moins de 500 Ko si possible.
2. Dans votre page :

```html
<figure class="planche">
  <figcaption class="planche__legende">
    <span class="planche__titre"><span class="planche__numero">Figure 1.</span> Titre : ce que montre la figure, où, quand</span>
    <span class="planche__sous-titre">Ce qui est mesuré et l'unité.</span>
  </figcaption>
  <img src="../assets/data-centers/carte-france.png" alt="Phrase qui dit ce que montre la figure et son message principal">
  <p class="planche__source">Source : producteur, <a href="https://…">titre du jeu de données</a>, date.</p>
</figure>
```

Le texte `alt` décrit ce que la figure montre (pour les personnes qui ne la voient pas). Si l'image contient des chiffres importants, reprenez-les dans le texte de la page.

### Une dataviz

Une dataviz est un dossier autonome `dataviz/<nom>/` qui contient son composant (`<nom>.js`), ses styles (`<nom>.css`), ses données (`data-<x>.js`), une page de démonstration (`demo.html`) et son `README.md`. Pour l'insérer dans une page de `pages/` (exemple de la carte, déjà fait dans `pages/transparence.html`) :

**1. Dans le `<head>`**, après `tokens.css` et `style.css` :

```html
<link rel="stylesheet" href="../css/tokens.css">
<link rel="stylesheet" href="../css/style.css">
<link rel="stylesheet" href="../dataviz/carte-europe/carte-europe.css">
```

**2. À l'endroit de la figure**, une planche qui contient le bloc vide de la dataviz :

```html
<figure class="planche">
  <figcaption class="planche__legende">
    <span class="planche__titre"><span class="planche__numero">Figure 1.</span> Titre de la figure</span>
    <span class="planche__sous-titre">Ce qui est mesuré.</span>
  </figcaption>
  <div class="dv-carte" data-dataviz="carte-europe"></div>
</figure>
```

**3. Tout en bas, juste avant `</body>`**, les scripts dans cet ordre : D3, puis le fond de carte (pour la carte seulement), puis les données, puis le composant :

```html
<script src="../vendor/d3.min.js"></script>
<script src="../vendor/world-50m.js"></script>
<script src="../dataviz/carte-europe/data-usage.js"></script>
<script src="../dataviz/carte-europe/carte-europe.js"></script>
```

Pour le graphique énergie : `class="dv-energie" data-dataviz="energie-ia"`, `energie-ia.css`, `data-energie.js`, `energie-ia.js` (sans `world-50m.js`). D3 ne se charge qu'une fois par page.

À savoir :

- Le composant se dessine tout seul dans le bloc `data-dataviz`. N'écrivez rien dans ce bloc.
- Le titre, le sous-titre et le texte d'analyse sont dans la page, pas dans le composant. Le composant affiche lui-même la légende, l'info-bulle, la vue tableau et la ligne de source.
- Depuis `index.html` (à la racine), les chemins ne commencent pas par `../` : `dataviz/carte-europe/carte-europe.js`.
- Si un script manque ou contient une erreur, la planche affiche un message au lieu d'un cadre vide.
- Pour modifier une dataviz ou mettre à jour ses données, lisez le `README.md` de son dossier.
- Quand on change de thème, `js/site.js` envoie l'évènement `site:theme` sur `document` (les dataviz peuvent l'écouter pour se redessiner).

## Règles communes pour éviter les conflits

- **Un fichier par sous-groupe.** Chacun modifie sa page dans `pages/` et ses images dans `assets/<sous-groupe>/`, pas les fichiers des autres.
- **Fichiers partagés** (`index.html`, le menu de toutes les pages, `css/style.css`, `js/site.js`, ce README) : une seule personne les modifie, après accord du groupe, et prévient les autres.
- **Ne pas modifier** `css/tokens.css`, `vendor/` ni le dossier `dataviz/` d'une autre personne.
- **Fichier Excel du groupe** : il n'est pas publié. Gardez-le sur votre ordinateur et ne l'envoyez pas sur GitHub ; il sert seulement à recalculer les données de la carte (voir `dataviz/carte-europe/README.md`).
- **Noms de fichiers** : minuscules, sans accents ni espaces (`carte-france.png`, pas `Carte France.PNG`). En ligne, GitHub Pages distingue les majuscules : un lien vers `Carte.png` ne trouve pas `carte.png`, alors que ça marche sur votre ordinateur.
- **Couleurs** : chaque IA a sa couleur dans `css/tokens.css` (`--ia-chatgpt`, `--ia-gemini`…), la même dans tout le site. Ces couleurs sont réservées aux données : pas de titre ou de fond décoré avec. Pour associer un nom à sa couleur dans un texte : `<span class="pastille pastille--openai" aria-hidden="true"></span>OpenAI`.
- **Nombres au format français** : virgule décimale et espace fine insécable avant `%`, écrite `&#8239;` dans le HTML : `43,3&#8239;%`. Espace insécable avant les unités : `415&nbsp;TWh`.
- **Avec Git** : récupérez les changements des autres avant de travailler (« Pull » ou « Fetch origin » dans GitHub Desktop), faites des petits commits avec un message clair, et envoyez-les souvent.

Rappels d'accessibilité : un seul `<h1>` par page, puis des `<h2>` et `<h3>` dans l'ordre ; des liens qui disent où ils mènent (pas « cliquez ici ») ; un texte `alt` pour chaque image ; jamais une information donnée par la couleur seule ; une page doit pouvoir se parcourir au clavier (touche Tab).

## Identité visuelle

- Un style sobre d'« atlas de données », pensé pour mettre en valeur les cartes et les graphiques : l'interface reste en noir, gris et bleu nuit, et **la couleur est réservée aux données**.
- Deux signes empruntés à la cartographie : le **trait gradué** en haut des planches (comme le bord d'une carte) marque une figure ; les **hachures** (comme un territoire pas encore relevé) marquent un texte à écrire.
- Police : **Hanken Grotesk**, chargée depuis Google Fonts (licence SIL Open Font). Google reçoit alors l'adresse IP des visiteurs. Pour l'éviter, on peut télécharger la police, la placer dans `assets/` et la déclarer avec `@font-face` dans `css/style.css`.
- **Pas de DSFR (système de design de l'État), pas de police Marianne, pas de logo de la République française** : ils sont réservés aux sites de l'État ([systeme-de-design.gouv.fr](https://www.systeme-de-design.gouv.fr/)). Ce site est un projet étudiant indépendant : il ne doit pas ressembler à un site officiel, même s'il répond à un défi de l'ADEME et utilise data.gouv.fr. Le pied de page le dit.

## Mettre le site en ligne sur GitHub Pages

1. Créez un compte sur [github.com](https://github.com) (une seule personne suffit, les autres seront invitées).
2. Créez un dépôt : bouton **New** (ou « + » puis **New repository**), un nom court sans espaces (par exemple `ia-climat`), visibilité **Public**, puis **Create repository**. GitHub Pages est gratuit pour les dépôts publics ; pour un dépôt privé, il faut un compte payant (offert aux étudiants avec GitHub Education).
3. Envoyez les fichiers :
   - **Sur le site de GitHub** : **Add file** puis **Upload files**, glissez le *contenu* du dossier (pas le dossier lui-même, pour que `index.html` soit à la racine du dépôt), puis **Commit changes**. Le site limite l'envoi à 100 fichiers à la fois : laissez de côté `_checks/` si besoin.
   - **Ou avec [GitHub Desktop](https://desktop.github.com/)**, plus pratique pour travailler à plusieurs : clonez le dépôt, copiez-y les fichiers, puis **Commit** et **Push origin**.
4. Vérifiez que le fichier `.nojekyll` (vide) est bien dans le dépôt. Il dit à GitHub de publier les fichiers tels quels, y compris ceux qui commencent par `_`. C'est un fichier caché sur Mac et Windows : s'il manque, créez-le sur GitHub avec **Add file**, **Create new file**, nom `.nojekyll`, contenu vide, **Commit changes**.
5. Activez la publication : onglet **Settings** du dépôt, menu **Pages** à gauche, partie **Build and deployment** : **Source** = **Deploy from a branch**, **Branch** = `main` et dossier `/ (root)`, puis **Save**.
6. Attendez une ou deux minutes, puis rechargez la page **Pages** : l'adresse du site s'affiche, de la forme `https://<compte>.github.io/<dépôt>/`.
7. Invitez les membres du groupe : **Settings**, **Collaborators**, **Add people**.
8. Chaque nouveau commit sur `main` met le site à jour automatiquement (suivi dans l'onglet **Actions**). Après une mise à jour, rechargez la page sans cache (Ctrl+Maj+R ou Cmd+Maj+R).

En ligne, testez tous les liens : une erreur de majuscule ou d'accent dans un nom de fichier donne une page 404 alors que tout marchait en local.

## Publier la réutilisation sur data.gouv.fr

Le défi demande de publier le travail comme **réutilisation** sur data.gouv.fr. Guide officiel : [Publier une réutilisation](https://guides.data.gouv.fr/reutilisations/publier-une-reutilisation) (avec une [vidéo](https://youtu.be/I1NbAwGZVBM)).

1. **Préparez** :
   - l'adresse du site en ligne (GitHub Pages), stable dans le temps ;
   - une capture d'écran du site, de préférence la carte ou un graphique (data.gouv.fr préfère une capture à un logo) ;
   - une description neutre : comment le site a été fait, ce qu'il permet de voir, le contexte. Par exemple : « Réalisé dans le cadre du défi « L'impact environnemental de l'IA générative » proposé par l'ADEME (Open Data University) » ;
   - la liste des jeux de données **de data.gouv.fr** réellement utilisés.
2. **Créez un compte** sur [data.gouv.fr](https://www.data.gouv.fr/pages/onboarding/reutilisateurs/) (**S'enregistrer**), ou connectez-vous.
3. **Ouvrez le formulaire** : bouton **Publier votre réutilisation** sur la page d'accueil de data.gouv.fr, ou directement [data.gouv.fr/admin/reuses/new](https://www.data.gouv.fr/admin/reuses/new).
4. **Choisissez l'éditeur** : votre compte personnel, ou l'organisation de votre établissement si elle existe sur data.gouv.fr et que le travail a été fait dans ce cadre.
5. **Remplissez** :
   - **Titre** : l'usage des données, pas seulement le nom du site (par exemple « Carte de l'usage des IA conversationnelles en Europe et transparence de leurs entreprises ») ;
   - **URL** : l'adresse du site ;
   - **Type** : Visualisation ;
   - **Description** : le texte préparé (un ton promotionnel peut entraîner un retrait) ;
   - **Mots-clés** : par exemple `ia`, `environnement`, `opendatauniversity` (mot-clé utilisé par d'autres réutilisations de ce défi) ;
   - **Thématique**, si le formulaire la demande : Environnement et énergie.
   Le **mode brouillon** permet de relire avant de publier.
6. **Associez les jeux de données** utilisés : tous ceux de data.gouv.fr (par exemple [Compar:IA](https://www.data.gouv.fr/datasets/compar-ia) s'il est utilisé). StatCounter, le Foundation Model Transparency Index et l'AI Energy Score ne sont pas sur data.gouv.fr : citez-les dans la description.
7. **Ajoutez l'image** (la capture d'écran), puis **publiez**.
8. Envoyez le lien de la réutilisation à l'enseignant. La référente du défi à l'ADEME est indiquée sur la page du défi.

## Vérifications avant le rendu

- [ ] Plus aucun bloc « À compléter » : la recherche de `a-completer` dans les fichiers ne donne plus rien (à part `css/style.css` et `_modele.html`).
- [ ] Chaque figure a un titre, un sous-titre (ce qui est mesuré, l'unité), une source avec lien et date, et un texte d'analyse.
- [ ] Chaque chiffre du site a une source ; nombres au format français (`43,3 %`).
- [x] Pied de page rempli ; licence des contenus (CC BY-SA 4.0) indiquée dans le pied de page de toutes les pages et dans la méthodologie.
- [ ] StatCounter crédité avec un lien (licence CC BY-SA 3.0) ; licences des autres sources vérifiées dans la méthodologie.
- [ ] Méthodologie complète : données, traitements, limites, usage éventuel d'outils d'IA.
- [ ] Tous les liens fonctionnent, en local et en ligne (attention aux majuscules et aux accents).
- [ ] Testé sur téléphone (ou à 375 px de large avec l'outil « Appareil » du navigateur, F12) et sur ordinateur, en thème clair et sombre ; le bouton Menu ouvre bien le menu.
- [ ] Parcours au clavier possible (Tab, Entrée, Échap), focus visible ; chaque image a un texte `alt`.
- [ ] Console du navigateur (F12) sans erreur rouge, sauf la police si vous êtes hors ligne.
- [ ] HTML validé sur [validator.w3.org/nu](https://validator.w3.org/nu/) (au moins pas d'erreur de structure).
- [ ] Copies du modèle : ligne `noindex` supprimée ; `_modele.html` reste hors du menu.
- [ ] Site en ligne sur GitHub Pages ; réutilisation publiée sur data.gouv.fr avec ses jeux de données associés ; dates de rendu vérifiées sur la page du défi et auprès de l'enseignant.

## Crédits et licences

- [D3](https://d3js.org/) 7.9.0 : licence ISC (`vendor/LICENSE-d3.txt`).
- Fond de carte : [world-atlas](https://github.com/topojson/world-atlas) (licence ISC), données [Natural Earth](https://www.naturalearthdata.com/) (domaine public) (`vendor/LICENSE-world-atlas.txt`).
- Police [Hanken Grotesk](https://fonts.google.com/specimen/Hanken+Grotesk) : SIL Open Font License 1.1.
- Données : voir la page [Méthodologie](pages/methodologie.html) (StatCounter CC BY-SA 3.0, Compar:IA et ODRE Licence Ouverte 2.0, OpenStreetMap ODbL…).
- Textes et figures du site : licence CC BY-SA 4.0.

Pour relancer les vérifications automatiques (facultatif, avec Node.js et Playwright) : `node _checks/n4/verif.js` depuis la racine du projet. Le script ouvre chaque page à 1280 et 375 px, en clair et en sombre, enregistre des captures dans `_checks/n4/` et signale les erreurs, débordements et contrastes insuffisants.
