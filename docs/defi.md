# Le défi : « L'impact environnemental de l'IA générative »

Relevé fait le 25 novembre 2026. Défi confirmé par le groupe.

La page officielle du défi (defis.data.gouv.fr) ne s'affiche qu'avec JavaScript. Son contenu est le même que celui de la page « thématique » de data.gouv.fr, lisible sans JavaScript, d'où vient ce relevé. Les citations entre guillemets sont des extraits de cette page ; le reste est un résumé. En cas de doute, la page du défi fait foi.

## En bref

| | |
|---|---|
| Titre | L'impact environnemental de l'IA générative |
| Porteur | ADEME (Agence de la transition écologique), partenaire de l'Open Data University |
| Programme | Open Data University, porté par l'association Latitudes avec le soutien de la DINUM, sur la plateforme defis.data.gouv.fr |
| Page du défi | <https://defis.data.gouv.fr/defis/limpact-environnemental-de-lia-generative> |
| Même contenu, lisible sans JavaScript | <https://www.data.gouv.fr/fr/topics/limpact-environnemental-de-lia-generative/> |
| Étiquettes de la page | `defisdatagouvfr`, `defisdatagouvfr-saison-saison-4` |
| Dernière mise à jour de la page | 20 mai 2026 |
| Référente du projet à l'ADEME | Lydie Bousseau, chargée de mission Sobriété numérique (adresse de contact sur la page du défi) |

## Contexte (résumé de la page du défi)

La page part du constat que l'IA est perçue comme immatérielle alors qu'elle repose sur des terminaux, des réseaux et des centres de données. Points avancés, avec la source que la page associe à chacun :

- L'IA est décrite comme une « industrie extractive » (*Contre-atlas de l'intelligence artificielle*, Kate Crawford).
- Les équipements ont un cycle de vie complet : extraction de minerais, consommation d'énergie, déchets en fin de vie (norme Afnor sur l'impact environnemental de l'IA).
- En 2022, le numérique représentait 4,4 % de l'empreinte carbone de la France (étude ADEME-Arcep).
- Le développement de l'IA amplifie cet impact : de nouveaux usages justifient de nouvelles infrastructures, qui stimulent à leur tour les usages (rapport du Shift Project).
- Google et Microsoft ont augmenté leurs émissions malgré leurs promesses de réduction : la page donne +48 % pour Google et +29 % pour Microsoft (2020-2023), d'après un article de NPR de juillet 2024. La période indiquée pour Google est à vérifier dans l'article avant de la reprendre.
- L'IA frugale est présentée comme une voie possible, avec le référentiel général porté par le ministère de la Transition écologique.
- En 2024, les centres de données ont consommé environ 415 TWh d'électricité, soit 1,5 % de la consommation mondiale ; sans changement majeur, environ 945 TWh en 2030 (Agence internationale de l'énergie).
- L'effet rebond (paradoxe de Jevons) peut annuler les gains d'efficacité.
- Au niveau local, les centres de données consomment de l'eau, occupent du foncier et nécessitent des minerais. Ces impacts restent mal connus.
- Évaluer l'impact de l'IA est difficile : la consommation d'une requête varie selon le modèle, la longueur et la tâche, et les entreprises utilisent des méthodes et des périmètres différents et publient peu de rapports détaillés.

## La problématique posée

> « Face à l'opacité du secteur de l'IA générative sur son impact environnemental, comment mobiliser les données existantes pour éclairer le débat public et permettre des choix avisés ? »

(Formulation relevée sur la page ; la ponctuation exacte est à vérifier sur la page du défi.)

## Objectifs du défi

- Permettre aux citoyens et aux acteurs du numérique de comprendre la matérialité de l'IA générative et les ordres de grandeur de son impact environnemental.
- Nourrir le débat public sur la transparence du secteur, en confrontant les discours des entreprises à leurs impacts réels.
- Sensibiliser aux enjeux environnementaux de la trajectoire actuelle de l'IA, dans un contexte d'urgence climatique.

## Réalisations possibles (exemples donnés par le défi)

Les participants choisissent librement leur livrable. Exemples proposés, par niveau :

**Niveau débutant**
- Infographie pédagogique sur la matérialité de l'IA et ses ordres de grandeur.
- Datavisualisation comparant la consommation de différents modèles (à partir de Compar:IA ou de l'AI Energy Score).
- Article de vulgarisation qui déconstruit une idée reçue sur l'impact de l'IA.

**Niveau intermédiaire**
- Analyse comparative de la transparence des modèles d'IA, croisant le Foundation Model Transparency Index et des données de consommation énergétique.
- Étude de la variabilité de la consommation énergétique selon les types de requêtes.
- Carte interactive des centres de données en France et de leur consommation estimée (OpenStreetMap et ODRE).
- Article de data journalisme comparant les engagements climatiques des géants de la tech (Google, Microsoft…) à leurs émissions réelles.
- Outil de sensibilisation estimant l'impact d'un usage donné de l'IA (nombre de requêtes par jour, type de modèle).

**Niveau avancé**
- Méthodologie de banc d'essai reproductible de l'efficacité énergétique de modèles open source.
- Outil interactif d'estimation d'impact (modèle, fréquence, localisation, mix énergétique).
- Étude prospective sur les conflits d'usage de l'électricité entre centres de données d'IA et secteurs à décarboner.
- Application qui note la « frugalité » d'un modèle d'IA.

## Jeux de données associés au défi (data.gouv.fr)

| Jeu de données | Producteur | Licence | Lien |
|---|---|---|---|
| Compar:IA (conversations, votes et réactions de la plateforme de comparaison d'IA conversationnelles, en Parquet) | Ministère de la Culture | Licence Ouverte 2.0 | <https://www.data.gouv.fr/datasets/compar-ia> |
| Consommation annuelle définitive d'électricité et de gaz par IRIS des sites industriels raccordés aux réseaux de transport | Open Data Réseaux Énergies (NaTran, RTE, Teréga) | Licence Ouverte 2.0 | <https://www.data.gouv.fr/datasets/consommation-annuelle-definitive-delectricite-et-de-gaz-par-iris-des-sites-industriels-raccordes-aux-reseaux-de-transport> |
| Données OpenStreetMap intégrales de France métropolitaine | OpenStreetMap | ODbL | <https://www.data.gouv.fr/datasets/donnees-openstreetmap-integrales-de-france-metropolitaine> |

Le texte du défi cite aussi, sans lien : le Foundation Model Transparency Index, l'AI Energy Score, Compar:IA, OpenStreetMap et l'ODRE. Les licences ci-dessus ont été relevées sur les pages data.gouv.fr des jeux de données le 25 novembre 2026.

## Ressources citées par le défi (« Pour en savoir plus »)

- Anatomy of an AI System (Kate Crawford et Vladan Joler, 2018) : <https://anatomyof.ai/>
- Impacts importés des centres de données (Hubblo) : <https://hubblo.org/fr/blog/datacenters-imported-impacts/>
- Étude ADEME-Arcep, impact environnemental du numérique en France (2022) : <https://infos.ademe.fr/magazine-janvier-2025/numerique-quel-impact-environnemental-en-2022/>
- Rapport du Shift Project sur l'IA et les centres de données (2025) : <https://theshiftproject.org/publications/intelligence-artificielle-centres-de-donnees-rapport-final/>
- Rapport de l'AIE *Energy and AI* (2025) : <https://www.iea.org/reports/energy-and-ai>
- Rapports environnementaux de Google : <https://sustainability.google/stories/>
- Rapports environnementaux de Microsoft : <https://www.microsoft.com/en-us/corporate-responsibility/sustainability/report/>
- Données Opcore (efficacité énergétique de centres de données) : <https://pue.dc5.opcore.eu/en/>
- Boavizta : <https://www.boavizta.org/>
- Kit d'engagement pour une IA frugale : <https://greentechinnovation.fr/storage/Kit-dengagement-IA-frugale-1.pdf>
- Étude Mistral / Carbone 4 : <https://mistral.ai/fr/news/our-contribution-to-a-global-environmental-standard-for-ai>
- Ecologits : <https://ecologits.ai/latest/>

## Forme de rendu attendue

- **Livrable libre** : infographie, datavisualisation, article, outil… (voir les exemples ci-dessus). Un site web avec des datavisualisations correspond aux exemples des niveaux débutant et intermédiaire.
- **Valorisation** : la section « Valorisation du projet » demande de publier le travail comme **réutilisation sur data.gouv.fr**, en suivant le guide <https://guides.data.gouv.fr/reutilisations/publier-une-reutilisation>. Bénéfices cités : visibilité accrue, retours constructifs, dialogue avec les producteurs de données, inspirer les autres.
- La section « Aspects techniques » de la page ne contient pas d'indication particulière.

## Saison, dates, critères

- **Saison** : la page porte l'étiquette « saison 4 » de defis.data.gouv.fr (année 2025-2026). La finale de la saison 4 de l'Open Data University a eu lieu le 9 juin 2026. Des réutilisations publiées en octobre 2026 se réclament encore de ce défi. **À vérifier sur la page du défi** : si le défi est ouvert pour la saison en cours.
- **Dates limites** : aucune date de rendu n'est indiquée sur la page. **À vérifier sur la page du défi** et auprès de l'enseignant.
- **Critères d'évaluation** : aucun critère n'est publié sur la page. **À vérifier sur la page du défi** et auprès de l'enseignant.

## Ce que cela implique pour notre site

- Le sous-groupe Transparence répond directement à un exemple du niveau intermédiaire (transparence croisée avec la consommation) et à un exemple du niveau débutant (datavisualisation de la consommation des modèles).
- **Point d'attention** : StatCounter, le Foundation Model Transparency Index et l'AI Energy Score ne sont pas des jeux de données de data.gouv.fr. Pour la réutilisation, il faudra associer au moins un jeu de data.gouv.fr effectivement utilisé (par exemple Compar:IA, cité par le défi pour la consommation des modèles), ou ceux des autres sous-groupes. À décider par le groupe.

## Réutilisations déjà publiées qui citent ce défi

Utiles pour voir ce que d'autres étudiants ont rendu, et pour s'en démarquer :

- **Le poids de l'IA** (BUT MMI, SAÉ 303, octobre 2026), « pour le défi de l'ADEME sur l'impact environnemental de l'IA générative » : <https://www.data.gouv.fr/reuses/le-poids-de-lia>
- **L'impact environnemental de l'IA générative** (BUT MMI, IUT Nord Franche-Comté, octobre 2026), « dans le cadre du défi « L'impact environnemental de l'IA générative » proposé par l'ADEME » : <https://www.data.gouv.fr/reuses/limpact-environnemental-de-lia-generative-1>
- **Comprendre l'électricité de l'IA** (SAÉ 303, « Open Data University × ADEME », octobre 2026), qui compare l'AI Energy Score et Compar:IA : <https://www.data.gouv.fr/reuses/comprendre-lelectricite-de-lia>
- **Sans filtre : peut-on vérifier les promesses climatiques de l'IA ?** (BUT MMI, octobre 2026), très proche de l'angle transparence : <https://www.data.gouv.fr/reuses/sans-filtre-peut-on-verifier-les-promesses-climatiques-de-lia>
- **AiBalance** (Hackathon ADEME 2026, avril 2026) : <https://www.data.gouv.fr/reuses/aibalance>

Ces réutilisations utilisent souvent le mot-clé `opendatauniversity` et la thématique « Environnement et énergie ».

## Autre défi proche, écarté

- **IA culturelles** (ministère de la Culture, saison 4), autour de Compar:IA : <https://www.data.gouv.fr/topics/ia-culturelles>. Il propose notamment, au niveau intermédiaire, d'analyser le lien entre performance des modèles et consommation énergétique. Écarté : le groupe a confirmé le défi de l'ADEME.

## Sources de ce relevé

- Page thématique du défi sur data.gouv.fr (consultée le 25/11/2026) : <https://www.data.gouv.fr/fr/topics/limpact-environnemental-de-lia-generative/>
- Article « Open Data University : découvrez les projets finalistes de la quatrième saison » (17 juin 2026) : <https://www.data.gouv.fr/posts/open-data-university-decouvrez-les-projets-finalistes-de-la-quatrieme-saison>
- Article « Lancement de defis.data.gouv.fr » (5 décembre 2024) : <https://www.data.gouv.fr/posts/lancement-de-defis-data-gouv-fr>
- Pages des jeux de données et des réutilisations citées ci-dessus.
