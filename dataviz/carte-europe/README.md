# Carte de l'Europe : quelle IA est la plus utilisée dans chaque pays ?

Chaque pays prend la couleur de l'IA conversationnelle qui envoie le plus de visites vers des sites web (StatCounter Global Stats, octobre 2026). Au survol, au toucher ou au clavier, une info-bulle donne la répartition complète entre les cinq IA du fichier du groupe (ChatGPT, Claude, Copilot, Gemini, Perplexity) et « Autre IA ».

## Fichiers

| Fichier | Rôle |
|---|---|
| `carte-europe.js` | le composant (d3 seulement). Seule variable globale : `window.CarteEurope` |
| `carte-europe.css` | ses styles, tous préfixés par `.dv-carte` (couleurs de `css/tokens.css`) |
| `data-usage.js` | les données (`window.DATA_USAGE_IA`). **Fichier généré : ne pas le modifier à la main** |
| `usage-ia-pays-octobre-2026.csv` | les mêmes données en CSV (UTF-8, séparateur virgule, décimales avec un point) pour le groupe et data.gouv.fr |
| `build_data.py` | convertit l'Excel du groupe en `data-usage.js` et en CSV |
| `demo.html` | page de démonstration autonome (`?theme=dark` dans l'adresse pour le thème sombre) |

## Insérer la carte dans une page

Depuis une page du dossier `pages/` :

```html
<link rel="stylesheet" href="../css/tokens.css">
<link rel="stylesheet" href="../dataviz/carte-europe/carte-europe.css">
...
<div class="dv-carte" data-dataviz="carte-europe"></div>
...
<script src="../vendor/d3.min.js"></script>
<script src="../vendor/world-50m.js"></script>
<script src="../dataviz/carte-europe/data-usage.js"></script>
<script src="../dataviz/carte-europe/carte-europe.js"></script>
```

La carte se monte toute seule au chargement. Elle dessine la carte, la légende, l'info-bulle, le menu « Choisir un pays », la ligne de source et la vue tableau ; le titre et le texte d'analyse restent dans la page. Le bloc a un fond `var(--surface)` et une marge intérieure de 16 px (12 px sous 480 px de large) : la page peut les surcharger.

Pour un bloc ajouté après le chargement : `CarteEurope.mount(element)`. L'objet renvoyé propose `choisir('FRA')` (sélectionne un pays dans le menu) et `projeter([lon, lat])` (position en pixels sur la carte).

## Mettre à jour les données

1. Placer le fichier Excel du groupe dans `data/TREC_1_donnee_IA_pays.xlsx` **sur votre ordinateur seulement** : il n'est pas publié avec le site, ne l'envoyez pas sur GitHub (feuille `Feuil1`, noms de pays en colonne A, colonnes `ChatGPT, Claude, Copilot, Gemini, Perplexity` en %). Les cellules peuvent être du texte (`43.33`, `43,33`) ou des nombres.
2. Lancer, depuis la racine du site :
   ```
   python3 dataviz/carte-europe/build_data.py
   ```
   (il faut `openpyxl` : `python3 -m pip install openpyxl`). On peut aussi donner un autre fichier : `python3 dataviz/carte-europe/build_data.py autre.xlsx`.
3. Lire le compte rendu affiché : somme de chaque pays (5 IA + Autre IA = 100), nombre de pays par IA en tête, égalités, corrections appliquées.

Le script s'arrête avec un message clair si une cellule est vide ou illisible, si un pays est inconnu (l'ajouter au tableau `PAYS` du script avec son nom affiché et ses codes ISO) ou si un pays dépasse 100 %.

- **Nouveau mois** : changer `PERIODE`, `PERIODE_ISO` et `CSV_NOM` en haut du script.
- **Autre IA** = 100 − somme des cinq IA, arrondi à 0,01, jamais négatif. Liechtenstein, Monténégro et Serbie totalisent 100,01 % (arrondis de la source) : Autre IA = 0.
- **Correction Belgique** : l'Excel donne ChatGPT = 49,9 % (somme 102,99 %). Le relevé StatCounter d'octobre 2026 donne 46,9 % : la carte utilise 46,9 (voir `CORRECTIONS` dans le script). L'Excel n'est pas modifié. Si le groupe corrige l'Excel, le script le signale et n'applique plus rien.
- **Micro-États atypiques** (`ATYPIQUES`) : Monaco, Saint-Marin, Liechtenstein, Andorre ont très peu de visites mesurées ; l'info-bulle et le tableau le signalent.
- **Égalité en tête** : signalée par le script ; l'info-bulle écrit « à égalité » et la couleur suit la première IA dans l'ordre validé. Pas d'égalité en octobre 2026 (écarts les plus faibles : Slovaquie 0,41 point, Pologne 0,91 point).

## Fond de carte

Contours : world-atlas `countries-50m` (données Natural Earth, domaine public ; world-atlas sous licence ISC). Ordre de chargement :

1. `window.WORLD_TOPO`, défini par `vendor/world-50m.js` (sous-ensemble Europe et voisins, produit par `tools/build_world.py`) ; c'est ce qui permet d'ouvrir le site en local, sans internet ;
2. sinon, téléchargement de `countries-50m.json` sur jsDelivr (marche en ligne) ;
3. sinon, un message dans la zone de la carte ; le tableau s'ouvre, la légende et le menu restent utilisables.

Le composant contient son propre décodeur TopoJSON (arcs quantifiés et delta-encodés, Polygon et MultiPolygon, arcs inversés) : pas besoin de topojson-client.

Choix de dessin :

- **Projection** azimutale équivalente de Lambert centrée sur 10° E, 52° N (celle des cartes européennes officielles) : les surfaces sont respectées.
- **Cadre fixe**, défini par des points en longitude/latitude (Islande, Irlande, cap Saint-Vincent, Malte, Crète, Chypre, sud-est de la Turquie, Caspienne, Caucase, cap Nord ; voir `CADRE`). La carte n'est jamais ajustée aux pays eux-mêmes (Guyane, Svalbard… restent hors cadre). Russie et Kazakhstan sont coupés par le bord.
- **Petits pays** (Andorre, Liechtenstein, Luxembourg, Malte, Monaco, Saint-Marin) : un cercle à leur centre, avec une zone de survol et de toucher de 24 px.
- **Åland** (séparé dans Natural Earth) prend les données et la couleur de la Finlande ; l'info-bulle indique « Åland (Finlande) ».
- **Crimée** : Natural Earth la dessine avec la Russie (frontières « de fait »). Elle est rattachée à l'Ukraine, conformément à la position de la France et de l'ONU (résolution 68/262 de l'Assemblée générale, 2014) ; une note sous la carte le dit. Pour revenir au dessin d'origine : `CRIMEE_AVEC_UKRAINE = false` en haut de `carte-europe.js`.
- **Kosovo** et **nord de Chypre** (sans code dans Natural Earth), îles Féroé, Groenland, Jersey, Guernesey, île de Man et pays hors fichier : « Pas de données » (gris).

## Couleurs et accessibilité

- Couleurs des IA : variables `--ia-*` de `css/tokens.css`, appliquées en style (le thème sombre suit tout seul). Pays sans données : `--nodata` ; frontières : `--surface`.
- Barre de répartition de l'info-bulle dans l'ordre validé (Gemini, Claude, ChatGPT, Perplexity, Copilot, Autre IA), lignes triées de la plus grande part à la plus petite, valeur en gras.
- Quatre IA sont en tête quelque part : ChatGPT (35 pays), Gemini (12), Claude (Monaco) et Perplexity (Russie). L'orange de Claude et le jaune de Perplexity sont proches pour certaines formes de daltonisme ; ils ne se touchent jamais sur la carte et la légende nomme le pays (« Claude — 1 pays (Monaco) »).
- Cliquer une IA dans la légende ne garde en couleur que les pays où elle est en tête (second clic : retour).
- Le SVG a `role="img"` et un résumé (`aria-label`). Au clavier : Tab jusqu'à la carte, puis flèches pour parcourir les pays (ordre alphabétique), Échap pour fermer ; le détail est aussi annoncé aux lecteurs d'écran. Le menu « Choisir un pays » et le tableau donnent les mêmes informations sans la carte.
- Textes de 13 px au minimum ; lisible de 360 à 1440 px (la légende passe à droite au-delà de 860 px de large).

## Ce que mesurent les données (à rappeler dans le texte de la page)

- StatCounter mesure la part des **visites envoyées vers des sites web** par chaque IA (clics de référence), pas un nombre d'utilisateurs. Formulations correctes : « part de l'usage », « part des visites issues de chaque IA ».
- Les IA non suivies par StatCounter n'apparaissent pas ; « Autre IA » ne couvre que le petit reste jusqu'à 100 %.
- Forte rupture entre septembre et octobre 2026 dans les données StatCounter (Europe : ChatGPT 79 % → 43 %, Gemini 13 % → 39 %), non expliquée par StatCounter.

## Vérifications

`_checks/n2/verif.js` (Chromium headless, Playwright) ouvre la démo à 1280, 375 et 360 px, en clair et en sombre, et contrôle légende, couleurs, info-bulle (souris, clavier, toucher), cadrage, Crimée, Åland, micro-États, menu, tableau, redimensionnement, console. `_checks/n2/test-decodeur.html` teste le décodeur sur un faux fond de carte (`fabriquer_faux_topo.py`).

```
NODE_PATH=/opt/npm-tools/node_modules node _checks/n2/verif.js
```
