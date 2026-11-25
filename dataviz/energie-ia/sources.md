# Sources — « Électricité, eau, carbone et métaux par entreprise d'IA »

Toutes les sources ont été consultées le **25/11/2026**. Les chiffres des graphiques sont
recalculés par `calcul_agregats.py` ; rien n'est saisi à la main dans `data-energie.js`.

Les deux sources principales, **AI Energy Score** et **compar:IA**, figurent dans la liste des données du défi
data.gouv.fr « L'impact environnemental de l'IA générative » (défi proposé par l'ADEME, Open Data University,
saison 4) : <https://www.data.gouv.fr/topics/limpact-environnemental-de-lia-generative>. Ce défi cite cinq
sources : Données de Compar:IA ; Consommation annuelle d'électricité et de gaz par IRIS des sites industriels ;
Localisation des centres de données sur OpenStreetMap ; Données d'AI Energy Score ; Foundation Model
Transparency Index (Stanford).

## 1. Sources utilisées dans les graphiques

### AI Energy Score — électricité (valeurs **mesurées** par un tiers)

| | |
|---|---|
| Titre | AI Energy Score Leaderboard – December 2025 (version 2, « Refreshed Leaderboard, now with Reasoning ») |
| Éditeur | Projet AI Energy Score, hébergé par Hugging Face (billet de Sasha Luccioni et Boris Gamazaychikov) |
| Liens | Classement : <https://huggingface.co/spaces/AIEnergyScore/Leaderboard> ; fichiers `data/energy/text_generation.csv` (62 modèles) et `data/energy/reasoning.csv` (18 lignes) ; billet du 4 décembre 2025 : <https://huggingface.co/blog/sasha/ai-energy-score-v2> ; méthode : <https://huggingface.github.io/AIEnergyScore/> |
| Date | Classement « Last updated: December 2025 » (fichiers de données modifiés il y a environ 11 mois) ; aucune version plus récente trouvée |
| Périmètre | Énergie des **GPU seulement** (NVIDIA H100 80 Go, mesure CodeCarbon), 1 000 requêtes par tâche (jeux WikiText, OSCAR, UltraChat), moyenne de 10 passages, lot de 1 requête. **Modèles ouverts** surtout : aucun modèle d'Anthropic ni de Perplexity. Génération de texte et raisonnement sont deux tâches distinctes (le billet v2 indique que les modèles qui raisonnent consomment en moyenne 30 fois plus). |
| Unité | Wh pour 1 000 requêtes (colonne `total_gpu_energy` en kWh, multipliée par 1 000 comme le fait `app.py`) |
| Copie | `donnees-brutes/aienergyscore_*_2025-12.csv`, recopiés depuis le Space (deux lectures indépendantes identiques ; mêmes valeurs que l'instantané benchmarklist.com du 06/05/2026 des notes de N1) |

### EcoLogits — eau, carbone, métaux et minéraux, électricité estimée (valeurs **estimées**)

| | |
|---|---|
| Titre | EcoLogits — méthode « LLM Inference », page « Proprietary models » et base de données, version 0.11.3 (14/10/2026) |
| Éditeur | EcoLogits, projet de l'association CodeCarbon (créé par l'association GenAI Impact) ; code sous licence MPL-2.0 |
| Liens | <https://ecologits.ai/latest/methodology/llm_inference/> ; <https://ecologits.ai/latest/methodology/proprietary_models/> ; code et données : <https://github.com/mlco2/ecologits> (fichiers `ecologits/impacts/llm.py`, `ecologits/tracers/utils.py`, `ecologits/data/models.json`, `ecologits/data/electricity_mixes.json`) ; versions : <https://pypi.org/project/ecologits/> |
| Périmètre | Inférence seulement : électricité des serveurs et GPU (avec le PUE du centre de données) + **fabrication** des serveurs et GPU, au prorata du temps de calcul (durée de vie 3 ans). Hors entraînement, réseau, appareils des utilisateurs et fin de vie. Eau : usage seulement (refroidissement sur site + eau de production de l'électricité). |
| Unité fonctionnelle | Une requête qui **génère 1 000 tokens** (environ 750 mots) |
| Unités affichées | Électricité en Wh ; carbone (GWP) en g CO₂e ; eau (WCF) en mL ; métaux et minéraux (ADPe) en µg Sb éq. ; énergie primaire (MJ, dans le CSV seulement) |

Constantes reprises de `llm.py` : énergie GPU par token = 1,1665e-6 × exp(−0,011206 × 64) × P_actifs + 4,0529e-5 Wh ;
latence modélisée par token = 6,785e-4 × P_actifs + 3,119e-4 × 64 + 0,019474 s ; lot de 64 requêtes ; GPU H100 80 Go ;
poids en 16 bits avec 20 % de mémoire en plus ; nombre de GPU arrondi à la puissance de 2 supérieure ; serveur hors GPU
1,2 kW pour 8 GPU ; fabrication : 5 700 kg CO₂e, 0,37 kg Sb éq. et 70 000 MJ par serveur, 273 kg CO₂e,
0,00895 kg Sb éq. et 3 721 MJ par GPU.
Fournisseurs (`utils.py`) : OpenAI États-Unis, PUE 1,20, WUE 0,569 L/kWh ; Anthropic États-Unis, PUE 1,09 à 1,14,
WUE 0,13 à 0,999 ; Google États-Unis, PUE 1,09, WUE 0,999 ; Mistral AI Suède, PUE 1,16, WUE 0,09 ; modèles ouverts
(« Hugging Face Hub ») États-Unis, PUE 1,09 à 1,14, WUE 0,13 à 0,99.
Mix électriques (`electricity_mixes.json`) : États-Unis 0,3844 kg CO₂e, 9,855e-8 kg Sb éq., 9,6884 MJ et 3,1321 L
d'eau par kWh ; Suède 0,03526 kg CO₂e, 7,771e-8 kg Sb éq., 4,73 MJ et 6,0315 L par kWh.

**Calcul du groupe.** La bibliothèque EcoLogits ne pouvait pas être installée ici. Le calcul est donc refait dans
`calcul_agregats.py` avec ces formules et ces données. Il reproduit les valeurs publiées par compar:IA pour
14 modèles ouverts, avec au plus 0,98 % d'écart (voir `_checks/n3/calcul-agregats-sortie.txt`).

**Choix : latence modélisée pour tous les modèles.** EcoLogits 0.11 utilise des débits mesurés (tokens par seconde)
quand sa base en contient, mais il n'en a pas pour les modèles ouverts absents de sa base (Llama 4, DeepSeek V4,
Phi-4). Pour que toutes les valeurs d'un graphique suivent la même méthode, la latence est modélisée pour tous les
modèles, comme le fait compar:IA. Avec les débits mesurés, les modèles qui en ont baisseraient de 26 à 39 %
(électricité et eau), de 38 à 65 % (carbone) et de 63 à 92 % (métaux et minéraux). L'écart entre modèles fermés
et ouverts est donc fragile, surtout pour les métaux.

### compar:IA — vérification du calcul et tailles des modèles ouverts

| | |
|---|---|
| Titre | Compar:IA — jeux de données « conversations », « votes » et « réactions » ; classement des modèles |
| Éditeur | Ministère de la Culture |
| Liens | <https://www.data.gouv.fr/datasets/compar-ia> (Licence Ouverte 2.0, mise à jour du 3 juin 2026) ; classement du 16 juin 2026 : <https://comparia.beta.gouv.fr/ranking> ; documentation des colonnes : <https://huggingface.co/datasets/ministere-culture/comparia-conversations> |
| Contenu utile | Par conversation : `total_conv_a_kwh` et `total_conv_b_kwh` (électricité estimée, en kWh), tokens générés, paramètres totaux et actifs. **Ni carbone, ni eau, ni métaux.** Le classement affiche une « énergie moyenne pour 1 000 tokens » (méthode EcoLogits) pour les modèles ouverts et « N/A » pour **tous** les modèles propriétaires (OpenAI, Anthropic, Google…). |
| Unité | mWh pour 1 000 tokens (classement) ; kWh par conversation (jeu de données) |

Valeurs du classement utilisées pour vérifier le calcul (mWh pour 1 000 tokens) : gpt-oss-120b 342 ; gpt-oss-20b 83 ;
Llama 3.1 8B 89 ; Llama 70B 658 ; Llama 3.1 405B 9 134 ; Llama 4 Maverick 1 601 ; Llama 4 Scout 400 ; DeepSeek 671 G
3 979 ; DeepSeek-V4-Pro 8 890 ; DeepSeek-V4-Flash 1 524 ; Mistral Large 3 4 134 ; Mistral 24 G 109 ; Phi-4 96 ;
Gemma 3 27B 112. Le classement n'affiche pas les noms des modèles dans le texte lu : ils sont identifiés par
l'entreprise, la taille et la date de sortie.

### Tailles publiées des modèles ouverts (vues EcoLogits)

- Mistral Large 3 : 675 G paramètres, 41 G actifs, 2 décembre 2025 — <https://docs.mistral.ai/models/mistral-large-3-25-12> (la base EcoLogits indique à tort un modèle dense de 123 G).
- Mistral Small 4 : 119 G, 6,5 G actifs, 16 mars 2026 — <https://docs.mistral.ai/models/mistral-small-4-0-26-03> (EcoLogits : 8 G actifs).
- Mistral Medium 3.5 : 128 G, dense, poids ouverts, modèle par défaut de Le Chat (annonce du 29 avril 2026) — <https://gigazine.net/gsc_news/en/20260430-mistral-medium-3-5/> ; même valeur dans la base EcoLogits.
- Llama 4 Scout (109 G, 17 G actifs) et Maverick (400 G, 17 G actifs), 5 avril 2025 — <https://huggingface.co/meta-llama/Llama-4-Maverick-17B-128E-Instruct>.
- DeepSeek-V4-Pro (1,6 T, 49 G actifs) et DeepSeek-V4-Flash (284 G, 13 G actifs), 24 avril 2026 — <https://deepseek.com/en/news/v4-preview/>.
- Phi-4 : 14 G, dense, décembre 2024 — valeur du classement compar:IA.
- Modèles fermés (OpenAI, Anthropic, Google) : tailles **estimées** par EcoLogits (`models.json`), sous forme de fourchette.

## 2. Chiffres déclarés par les entreprises (tableau « Ce que publient les entreprises »)

| Entreprise | Titre, éditeur, date | Lien | Périmètre | Unité et valeurs |
|---|---|---|---|---|
| Google | « Measuring the environmental impact of AI inference », A. Vahdat et J. Dean, Google Cloud, 21/08/2025 ; article « Measuring the environmental impact of delivering AI at Google Scale », Elsworth et al., arXiv 2508.15734 | <https://cloud.google.com/blog/products/infrastructure/measuring-the-environmental-impact-of-ai-inference> | Requête texte médiane de l'application Gemini, données de mai 2025. Exploitation complète (puces, CPU et mémoire, machines en attente, PUE). Carbone : électricité « market-based » 0,023 g + fabrication du matériel 0,010 g. Eau consommée sur place (WUE 1,15 L/kWh), sans l'eau de production de l'électricité. Hors entraînement, réseau externe, terminaux. Non vérifié par un tiers. | Par requête : 0,24 Wh ; 0,03 g CO₂e ; 0,26 mL |
| OpenAI | « The Gentle Singularity », Sam Altman (PDG), blog personnel, 10/06/2025 | <https://blog.samaltman.com/the-gentle-singularity> | Requête moyenne de ChatGPT ; aucune méthode ni périmètre publiés | Par requête : 0,34 Wh ; 0,000085 gallon US d'eau, soit 0,32 mL |
| Mistral AI | « Our contribution to a global environmental standard for AI », Mistral AI, 22/07/2025 (étude avec Carbone 4 et l'ADEME, revue par Resilio et Hubblo, méthode AFNOR « IA frugale ») | <https://mistral.ai/news/our-contribution-to-a-global-environmental-standard-for-ai> | Analyse de cycle de vie de Mistral Large 2 : impact marginal d'une réponse de Le Chat (inférence, fabrication des serveurs comprise, hors terminaux) ; total entraînement + 18 mois d'usage (janvier 2025) | Réponse de 400 tokens : 1,14 g CO₂e ; 45 mL ; 0,16 mg Sb éq. Total : 20,4 kt CO₂e ; 281 000 m³ ; 660 kg Sb éq. Pas de Wh. |
| Microsoft | « Scaling AI with 8 to 20x energy efficiency », M. Nakagawa et J. Lavista Ferres, Microsoft Cloud Blog, 15/06/2026 ; article Oviedo et al., Joule (2026) | <https://www.microsoft.com/en-us/microsoft-cloud/blog/2026/06/15/scaling-ai-with-8-to-20x-energy-efficiency/> ; <https://www.cell.com/joule/fulltext/S2542-4351(26)00114-5> | « Requête typique » (environ 300 tokens générés) adressée à de grands modèles **non nommés** (plus de 200 G paramètres, serveurs H100), eau de refroidissement. Ce n'est pas une mesure de Copilot. | Par requête : 0,16 à 0,60 Wh ; 0 à 0,067 mL ; carbone non publié |
| Meta | Carte du modèle Llama 4, Meta, 05/04/2025 | <https://huggingface.co/meta-llama/Llama-4-Maverick-17B-128E-Instruct> | Entraînement de Llama 4 Scout et Maverick seulement | 7,38 millions d'heures de GPU H100 ; 1 999 t CO₂e « location-based », 0 t « market-based » |
| Anthropic, Perplexity, DeepSeek | — | — | Aucun chiffre environnemental par requête ou par modèle trouvé (recherches web du 25/11/2026 ; rien non plus dans l'annonce de DeepSeek V4) | — |

## 3. Matrice « Qui publie quoi ? »

États : **publié** par l'entreprise (une astérisque signale une publication partielle) ; **tiers** = seulement mesuré
(AI Energy Score) ou estimé (EcoLogits, CLEER) par d'autres ; **rien**. Les sources sont celles des parties 1 et 2, plus :

| | |
|---|---|
| Titre | CLEER (Closed-model Latent Energy Estimation Range), tableau de bord et rapport technique, version CLEER-Text-0926 |
| Éditeur | Sustainable AI Group (N. Jegham, C. Y. Koh, B. Gamazaychikov, S. Luccioni) |
| Liens | <https://cleerdash.sustainableaigroup.com/> ; <https://reports.sustainableaigroup.com/CLEER-Tech-Report> ; article de Computing du 30/09/2026 : <https://www.computing.co.uk/news/2026/ai/new-dashboard-estimates-energy-consumption-of-claude-gpt-and-gemini> |
| Date | 29 septembre 2026 |
| Périmètre | Énergie par token de 36 modèles fermés (Claude, GPT, Gemini…) estimée à partir de modèles ouverts comparables ; CO₂e dans le tableau de bord ; pas d'eau (« prévue »), pas de métaux |
| Unité | Énergie par token d'entrée et de sortie ; sessions de discussion et sessions « agentiques » |
| Usage ici | Seulement dans la matrice (estimation par un tiers). Pas dans les graphiques : la source imposée pour l'électricité est AI Energy Score, les données détaillées n'ont pas pu être lues automatiquement (tableau de bord en JavaScript, dossier GitHub inaccessible au robot) et elles sont sous licence CC BY-NC 4.0. |

## 4. Sources consultées mais non utilisées

- ADEME, communiqué « IA générative, comment quantifier les impacts ? » et avis « L'intelligence artificielle générative, des impacts environnementaux importants », 22/07/2026 — <https://www.ademe.fr/wp-content/uploads/2026/07/cp-ademe-avis-ia-072026.pdf> : aucun chiffre par requête ; demande une méthode commune et dénonce l'opacité du secteur (utile pour le texte du sous-groupe Transparence).
- API Impact CO2 (ADEME) sur data.gouv.fr — <https://www.data.gouv.fr/dataservices/api-impact-co2> : pas de catégorie IA.
- Meta, Muse Spark (8 avril 2026, modèle de Meta AI) et Muse Glimmer (10 août 2026) : tailles non publiées, donc pas d'estimation possible (Axios, <https://www.axios.com/2026/04/08/meta-muse-alexandr-wang>).

## 5. Sélection des modèles

### AI Energy Score (génération de texte et raisonnement)

Règle : pour chaque entreprise, la génération la plus récente présente dans le classement et encore utilisée ;
les générations précédentes et les versions remplacées sont écartées. Une valeur par modèle (pour gpt-oss, moyenne
des trois niveaux de raisonnement mesurés, car le document d'OpenAI n'indique pas de niveau par défaut), puis
moyenne, médiane et nombre de modèles par entreprise et par tâche. Les autres entreprises du classement (Qwen, IBM,
Hugging Face…) ne sont pas reprises.

| Tâche | Entreprise | Modèle | Wh / 1 000 requêtes | Décision | Justification |
|---|---|---|---|---|---|
| Texte | OpenAI | `openai-community/gpt2` | 2,15 | écarté | GPT-2 (2019) : génération ancienne. |
| Texte | OpenAI | `openai-community/gpt2-xl` | 8,92 | écarté | GPT-2 (2019) : génération ancienne. |
| Texte | OpenAI | `openai-community/gpt2-medium` | 3,96 | écarté | GPT-2 (2019) : génération ancienne. |
| Texte | OpenAI | `openai-community/gpt2-large` | 6,12 | écarté | GPT-2 (2019) : génération ancienne. |
| Texte | OpenAI | `openai-community/openai-gpt` | 2,7 | écarté | GPT-1 (2018) : génération ancienne, sans lien avec les modèles actuels d'OpenAI. |
| Texte | Microsoft | `microsoft/phi-1` | 6,39 | écarté | Phi-1 (2023) : génération remplacée par Phi-4. |
| Texte | Microsoft | `microsoft/phi-1_5` | 6,29 | écarté | Phi-1.5 (2023) : génération remplacée par Phi-4. |
| Texte | Microsoft | `microsoft/phi-2` | 9,86 | écarté | Phi-2 (2023) : génération remplacée par Phi-4. |
| Texte | Microsoft | `microsoft/phi-4` | 28,7 | retenu | Phi-4 (décembre 2024) : génération actuelle des modèles ouverts de Microsoft. |
| Texte | Meta | `facebook/opt-2.7b` | 8,06 | écarté | OPT (2022) : génération ancienne. |
| Texte | Meta | `facebook/opt-125m` | 1,94 | écarté | OPT (2022) : génération ancienne. |
| Texte | Mistral AI | `mistralai/Mistral-7B-v0.1` | 19,1 | écarté | Mistral 7B v0.1 (2023) : première version, remplacée depuis. |
| Texte | Mistral AI | `mistralai/Ministral-8B-Instruct-2410` | 20,9 | retenu | Ministral 8B (octobre 2024) : modèle Mistral le plus récent mesuré. |
| Texte | Meta | `meta-llama/Meta-Llama-3-8B` | 17,3 | écarté | Llama 3 (avril 2024) : remplacé par Llama 3.1 8B, mesuré lui aussi. |
| Texte | Meta | `meta-llama/Llama-2-7b-hf` | 16,4 | écarté | Llama 2 (2023) : génération ancienne. |
| Texte | Meta | `meta-llama/Meta-Llama-3.1-8B` | 17,4 | retenu | Llama 3.1 (juillet 2024) : génération de Meta la plus récente mesurée, encore très utilisée. |
| Texte | Meta | `meta-llama/Llama-2-13b-hf` | 26,1 | écarté | Llama 2 (2023) : génération ancienne. |
| Texte | Google | `google/gemma-2b` | 8,68 | écarté | Gemma 1 (2024) : génération remplacée par Gemma 3. |
| Texte | Google | `google/gemma-7b` | 18,9 | écarté | Gemma 1 (2024) : génération remplacée par Gemma 3. |
| Texte | Google | `google/gemma-2-2b-it` | 18,6 | écarté | Gemma 2 (2024) : génération remplacée par Gemma 3. |
| Texte | Mistral AI | `mistralai/Mixtral-8x7B-v0.1` | 615 | écarté | Mixtral 8x7B v0.1 (2023) : génération ancienne. |
| Texte | Meta | `meta-llama/Meta-Llama-3-70B` | 1 720 | écarté | Llama 3 (avril 2024) : remplacé par les versions 3.1 et 3.3 de 70 G. |
| Texte | Meta | `meta-llama/Llama-2-70b-hf` | 1 649 | écarté | Llama 2 (2023) : génération ancienne. |
| Texte | Google | `google/gemma-3-4b-pt` | 34,4 | retenu | Gemma 3 (2025), version de base « pt » : génération la plus récente mesurée. |
| Texte | Google | `google/gemma-3-270m` | 9,29 | retenu | Gemma 3 (2025) : génération la plus récente de Google mesurée. |
| Texte | Mistral AI | `mistralai/Mistral-Nemo-Instruct-2407` | 23,2 | retenu | Mistral NeMo (juillet 2024) : modèle encore très diffusé. |
| Texte | Microsoft | `microsoft/Phi-4-reasoning-plus` | 18,4 | retenu | Phi-4-reasoning-plus (2025) : génération Phi-4 ; tâche texte mesurée sans le mode raisonnement. |
| Texte | Google | `google/gemma-3-1b-pt` | 12,3 | retenu | Gemma 3 (2025), version de base « pt » : génération la plus récente mesurée. |
| Texte | Google | `google/gemma-3-27b-pt` | 50,4 | retenu | Gemma 3 (2025), version de base « pt » : génération la plus récente mesurée. |
| Texte | DeepSeek | `deepseek-ai/DeepSeek-R1-Distill-Qwen-32B` | 36,6 | retenu | Distillation de DeepSeek-R1 (janvier 2025) sur une base Qwen ; pas le modèle de l'application DeepSeek. |
| Texte | DeepSeek | `deepseek-ai/DeepSeek-R1-Distill-Llama-70B` | 49,5 | retenu | Distillation de DeepSeek-R1 (janvier 2025) sur une base Llama ; pas le modèle de l'application DeepSeek. |
| Raisonnement | OpenAI | `openai/gpt-oss-120b` | 6 801 | retenu | gpt-oss (août 2025) : modèles ouverts actuels d'OpenAI ; valeur = moyenne des 3 niveaux de raisonnement mesurés. |
| Raisonnement | Microsoft | `microsoft/Phi-4-reasoning-plus` | 9 462 | retenu | Phi-4-reasoning-plus (2025) : génération Phi-4 ; tâche texte mesurée sans le mode raisonnement. |
| Raisonnement | OpenAI | `openai/gpt-oss-20b` | 3 590 | retenu | gpt-oss (août 2025) : modèles ouverts actuels d'OpenAI ; valeur = moyenne des 3 niveaux de raisonnement mesurés. |
| Raisonnement | DeepSeek | `deepseek-ai/DeepSeek-R1-Distill-Qwen-32B` | 4 790 | retenu | Distillation de DeepSeek-R1 (janvier 2025) sur une base Qwen ; pas le modèle de l'application DeepSeek. |
| Raisonnement | Google | `google/gemma-3-4b-pt` | 11 811 | retenu | Gemma 3 (2025), version de base « pt » : génération la plus récente mesurée. |
| Raisonnement | DeepSeek | `deepseek-ai/DeepSeek-R1-Distill-Llama-70B` | 7 627 | retenu | Distillation de DeepSeek-R1 (janvier 2025) sur une base Llama ; pas le modèle de l'application DeepSeek. |

### EcoLogits (eau, carbone, métaux et minéraux, électricité estimée)

Règle : les modèles de langage les plus récents de chaque entreprise, un par gamme, dont la taille est publiée
(poids ouverts) ou estimée par EcoLogits (modèles fermés). Les variantes spécialisées (image, audio, code, recherche,
« pro ») sont écartées. Perplexity : aucun modèle estimable.

| Entreprise | Modèle | Taille et hypothèses | Justification |
|---|---|---|---|
| OpenAI | GPT-5.5 | MoE ; 900 G paramètres, 90 à 300 G actifs ; 32 GPU H100 ; fournisseur EcoLogits « openai » | Modèle actuel d'OpenAI (avril 2026) ; taille estimée par EcoLogits. |
| OpenAI | GPT-5.4 mini | dense ; 56 à 158 G paramètres ; 2 à 8 GPU H100 ; fournisseur EcoLogits « openai » | Modèle actuel d'OpenAI (mars 2026) ; taille estimée par EcoLogits. |
| OpenAI | GPT-5.4 nano | dense ; 15 à 58 G paramètres ; 1 à 2 GPU H100 ; fournisseur EcoLogits « openai » | Modèle actuel d'OpenAI (mars 2026) ; taille estimée par EcoLogits. |
| Anthropic | Claude Opus 4.8 | MoE ; 670 G paramètres, 67 à 200 G actifs ; 32 GPU H100 ; fournisseur EcoLogits « anthropic » | Modèle actuel d'Anthropic (2026) ; taille estimée par EcoLogits. |
| Anthropic | Claude Sonnet 4.6 | MoE ; 440 G paramètres, 44 à 132 G actifs ; 16 GPU H100 ; fournisseur EcoLogits « anthropic » | Modèle actuel d'Anthropic (2026) ; taille estimée par EcoLogits. |
| Anthropic | Claude Haiku 4.5 | dense ; 10 à 35 G paramètres ; 1 à 2 GPU H100 ; fournisseur EcoLogits « anthropic » | Modèle actuel d'Anthropic (octobre 2025) ; taille estimée par EcoLogits. |
| Google | Gemini 3.5 Flash | MoE ; 900 G paramètres, 90 à 240 G actifs ; 32 GPU H100 ; fournisseur EcoLogits « google_genai » | Modèle actuel de Google (2026) ; taille estimée par EcoLogits. |
| Google | Gemini 3.1 Pro (préversion) | MoE ; 1200 G paramètres, 120 à 360 G actifs ; 64 GPU H100 ; fournisseur EcoLogits « google_genai » | Modèle actuel de Google (2026) ; taille estimée par EcoLogits. |
| Google | Gemini 3.1 Flash-Lite | dense ; 30 à 105 G paramètres ; 1 à 4 GPU H100 ; fournisseur EcoLogits « google_genai » | Modèle actuel de Google (2026) ; taille estimée par EcoLogits. |
| Mistral AI | Mistral Medium 3.5 | dense ; 128 G paramètres ; 4 GPU H100 ; fournisseur EcoLogits « mistralai » | Modèle actuel de Mistral AI (avril 2026) ; taille publiée par Mistral AI. |
| Mistral AI | Mistral Large 3 | MoE ; 675 G paramètres, 41 G actifs ; 32 GPU H100 ; fournisseur EcoLogits « mistralai » ; La base EcoLogits le décrit comme un modèle dense de 123 G ; Mistral AI publie un MoE de 675 G (41 G actifs), valeur utilisée ici. | Modèle actuel de Mistral AI (décembre 2025) ; taille publiée par Mistral AI. |
| Mistral AI | Mistral Small 4 | MoE ; 119 G paramètres, 6,5 G actifs ; 4 GPU H100 ; fournisseur EcoLogits « mistralai » ; La base EcoLogits indique 8 G actifs ; Mistral AI publie 6,5 G, valeur utilisée ici. | Modèle actuel de Mistral AI (mars 2026) ; taille publiée par Mistral AI. |
| Meta | Llama 4 Maverick | MoE ; 400 G paramètres, 17 G actifs ; 16 GPU H100 ; fournisseur EcoLogits « huggingface_hub » | Modèle actuel de Meta (avril 2025) ; taille publiée par Meta. |
| Meta | Llama 4 Scout | MoE ; 109 G paramètres, 17 G actifs ; 4 GPU H100 ; fournisseur EcoLogits « huggingface_hub » | Modèle actuel de Meta (avril 2025) ; taille publiée par Meta. |
| DeepSeek | DeepSeek-V4-Pro | MoE ; 1600 G paramètres, 49 G actifs ; 64 GPU H100 ; fournisseur EcoLogits « huggingface_hub » | Modèle actuel de DeepSeek (avril 2026) ; taille publiée par DeepSeek. |
| DeepSeek | DeepSeek-V4-Flash | MoE ; 284 G paramètres, 13 G actifs ; 16 GPU H100 ; fournisseur EcoLogits « huggingface_hub » | Modèle actuel de DeepSeek (avril 2026) ; taille publiée par DeepSeek. |
| Microsoft | Phi-4 | dense ; 14 G paramètres ; 1 GPU H100 ; fournisseur EcoLogits « huggingface_hub » | Modèle actuel de Microsoft (décembre 2024) ; taille publiée par Microsoft. |

## 6. « Métaux lourds » ou « métaux et minéraux » ?

Les analyses de cycle de vie (EcoLogits, étude de Mistral AI) ne mesurent pas la toxicité des « métaux lourds » (plomb,
mercure, cadmium…). Leur indicateur est l'**épuisement des ressources abiotiques — minéraux et métaux (ADPe)** :
la quantité de métaux et de minéraux extraits pour fabriquer le matériel et produire l'électricité, pondérée par leur
rareté et exprimée en **kilogrammes d'antimoine équivalent (kg Sb éq.)**. C'est pourquoi l'indicateur s'appelle
« Métaux et minéraux » sur le site.
