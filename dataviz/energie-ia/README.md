# Dataviz « Électricité, eau, carbone et métaux par entreprise d'IA »

Un histogramme à barres horizontales, une barre par entreprise (Google, Anthropic, OpenAI, Perplexity, Microsoft,
Mistral AI, Meta, DeepSeek), un indicateur à la fois : **Électricité**, **Eau**, **Empreinte carbone**,
**Métaux et minéraux**. Sous le graphique, deux tableaux pour le sous-groupe Transparence :
**« Ce que publient les entreprises »** (chiffres déclarés, avec leur périmètre) et **« Qui publie quoi ? »**
(publié par l'entreprise / mesuré ou estimé par un tiers / rien).

Ouvrir `demo.html` (double-clic, aucun serveur nécessaire ; `?theme=dark` pour le thème sombre).

## Insertion dans une page du site (chemins depuis `pages/`)

```html
<link rel="stylesheet" href="../css/tokens.css">
<link rel="stylesheet" href="../dataviz/energie-ia/energie-ia.css">
...
<div class="dv-energie" data-dataviz="energie-ia"></div>
...
<script src="../dataviz/energie-ia/data-energie.js"></script>
<script src="../dataviz/energie-ia/energie-ia.js"></script>
```

- Le composant se monte tout seul et expose `window.EnergieIA.mount(element)`. Il n'utilise pas d3.
- `data-vue="graphique"`, `"publications"` ou `"matrice"` n'affiche qu'un bloc (le titre est alors à mettre dans
  la page). Sans cet attribut, les trois blocs s'affichent, avec un sous-titre `<h3>` pour les deux tableaux.
- Le titre et le texte d'analyse du graphique sont à écrire dans la page hôte.

## Ce que montre chaque indicateur

| Indicateur | Source | Type | Unité |
|---|---|---|---|
| Électricité — Génération de texte (vue par défaut) | AI Energy Score, décembre 2025 | mesuré | Wh pour 1 000 requêtes (GPU) |
| Électricité — Raisonnement | AI Energy Score, décembre 2025 | mesuré | Wh pour 1 000 requêtes (GPU) |
| Électricité — Estimation EcoLogits | méthode EcoLogits 0.11.3, calcul du groupe | estimé | Wh pour 1 000 tokens générés |
| Eau | idem | estimé | mL pour 1 000 tokens générés |
| Empreinte carbone | idem | estimé | g CO₂e pour 1 000 tokens générés |
| Métaux et minéraux | idem | estimé | µg Sb éq. pour 1 000 tokens générés |

- **Une barre = la moyenne des modèles retenus de l'entreprise** (jamais une somme) ; l'info-bulle et la vue
  tableau donnent la médiane, le nombre de modèles et la valeur de chaque modèle. La liste des modèles retenus et
  écartés, avec une ligne de justification chacun, est dans `sources.md` (partie 5).
- Génération de texte et raisonnement ne sont jamais mélangés (le raisonnement consomme en moyenne 30 fois plus).
- « Aucune donnée publique » ou « Aucun modèle actuel mesuré » : la ligne reste visible, sans barre (jamais un zéro).
- Le trait fin sur les barres EcoLogits est la fourchette d'estimation (taille inconnue des modèles fermés).
- « Métaux et minéraux » = épuisement des ressources abiotiques (ADPe, kg d'antimoine équivalent) : ce n'est pas
  la toxicité des « métaux lourds » (voir `sources.md`, partie 6).

## Fichiers

| Fichier | Rôle |
|---|---|
| `energie-ia.js`, `energie-ia.css` | composant (tous les styles sont préfixés par `.dv-energie`) |
| `data-energie.js` | données (`window.DATA_ENERGIE_IA`), **générées** par le script : ne pas modifier à la main |
| `energie-par-entreprise.csv` | une ligne par entreprise et par vue : moyenne, médiane, nombre de modèles, fourchette, statut |
| `energie-par-modele.csv` | une ligne par modèle et par vue, retenu ou écarté, avec la justification |
| `calcul_agregats.py` | lit les données brutes, refait le calcul EcoLogits, le vérifie contre compar:IA, écrit les 3 fichiers ci-dessus |
| `donnees-brutes/` | copie des deux CSV AI Energy Score de décembre 2025 |
| `sources.md` | toutes les sources (titre, éditeur, lien, date, périmètre, unité) et la sélection des modèles |
| `demo.html` | page de démonstration autonome |

## Mettre à jour les données

1. Nouveau classement AI Energy Score : remplacer les CSV de `donnees-brutes/` (pages fichiers du Space
   `AIEnergyScore/Leaderboard`, dossier `data/energy/`) et ajouter une décision (retenu ou écarté + justification)
   pour chaque nouveau modèle dans `SELECTION_AIES` du script (le script s'arrête sinon).
2. Nouvelle version d'EcoLogits ou nouveau modèle : modifier les constantes, `FOURNISSEURS`, `MIX` ou
   `MODELES_ECOLOGITS` dans le script, en citant la source dans `sources.md`.
3. Lancer `python3 -I calcul_agregats.py` (Python 3, bibliothèque standard). Le script s'arrête si le calcul ne
   reproduit plus les valeurs de compar:IA à 1 % près.

## Limites à dire sur le site

- AI Energy Score ne mesure que des **modèles ouverts** : les modèles fermés de ChatGPT, Gemini et Copilot ne sont pas
  mesurés ; Anthropic et Perplexity n'ont aucun modèle dans le classement. La barre « Google » porte sur Gemma 3, la
  barre « Microsoft » sur Phi-4, pas sur Gemini ou Copilot.
- Les valeurs EcoLogits sont des **estimations** fondées sur des hypothèses (GPU H100, lots de 64 requêtes, tailles
  estimées des modèles fermés). Elles sont bien plus élevées que les chiffres publiés par Google (0,24 Wh par requête
  médiane) ou OpenAI (0,34 Wh), dont les périmètres et longueurs de réponse diffèrent : elles servent à comparer les
  entreprises entre elles avec une même méthode, pas à donner une valeur exacte.
- La latence est modélisée pour tous les modèles (comme compar:IA). Avec les débits mesurés de la base EcoLogits, les
  modèles fermés et ceux de Mistral baisseraient de 26 à 92 % selon l'indicateur (surtout les métaux) : l'écart entre
  modèles fermés et ouverts est fragile.
- Les chiffres déclarés par les entreprises (tableau du bas) ne se comparent ni entre eux ni au graphique : périmètres
  différents (par exemple, l'eau de Google est consommée sur place seulement, celle de Mistral et d'EcoLogits inclut la
  production d'électricité).
