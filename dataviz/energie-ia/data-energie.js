/* data-energie.js — généré par calcul_agregats.py le 2026-11-25. Ne pas modifier à la main :
   changer le script puis relancer « python3 -I calcul_agregats.py ». Sources : sources.md */
window.DATA_ENERGIE_IA = {
 "version": "2026-11-25",
 "entreprises": [
  {
   "id": "google",
   "nom": "Google",
   "assistant": "Gemini",
   "couleur": "--ia-gemini"
  },
  {
   "id": "anthropic",
   "nom": "Anthropic",
   "assistant": "Claude",
   "couleur": "--ia-claude"
  },
  {
   "id": "openai",
   "nom": "OpenAI",
   "assistant": "ChatGPT",
   "couleur": "--ia-chatgpt"
  },
  {
   "id": "perplexity",
   "nom": "Perplexity",
   "assistant": "Perplexity",
   "couleur": "--ia-perplexity"
  },
  {
   "id": "microsoft",
   "nom": "Microsoft",
   "assistant": "Copilot",
   "couleur": "--ia-copilot"
  },
  {
   "id": "mistral",
   "nom": "Mistral AI",
   "assistant": "Le Chat",
   "couleur": "--ia-mistral"
  },
  {
   "id": "meta",
   "nom": "Meta",
   "assistant": "Meta AI",
   "couleur": "--ia-meta"
  },
  {
   "id": "deepseek",
   "nom": "DeepSeek",
   "assistant": "DeepSeek",
   "couleur": "--ia-deepseek"
  }
 ],
 "indicateurs": [
  {
   "id": "electricite",
   "libelle": "Électricité",
   "vues": [
    "electricite-texte",
    "electricite-raisonnement",
    "electricite-ecologits"
   ]
  },
  {
   "id": "eau",
   "libelle": "Eau",
   "vues": [
    "eau"
   ]
  },
  {
   "id": "carbone",
   "libelle": "Empreinte carbone",
   "vues": [
    "carbone"
   ]
  },
  {
   "id": "metaux",
   "libelle": "Métaux et minéraux",
   "vues": [
    "metaux"
   ]
  }
 ],
 "vues": [
  {
   "id": "electricite-texte",
   "indicateur": "electricite",
   "libelle": "Génération de texte",
   "grandeur": "Électricité consommée par les GPU, tâche « génération de texte »",
   "unite": "Wh",
   "uniteCourte": "Wh",
   "uniteLongue": "Wh pour 1 000 requêtes",
   "type": "mesuré",
   "facteur": 1,
   "note": "Ce classement ne mesure que des modèles ouverts : ChatGPT, Gemini et Copilot fonctionnent avec des modèles fermés, non mesurés ; Anthropic et Perplexity n'y ont aucun modèle.",
   "source": "AI Energy Score (Hugging Face), classement de décembre 2025",
   "sourceUrl": "https://huggingface.co/spaces/AIEnergyScore/Leaderboard",
   "methode": "Énergie des GPU (NVIDIA H100) mesurée sur 1 000 requêtes. Moyenne des modèles retenus de chaque entreprise (modèles ouverts seulement) ; les anciennes générations sont écartées.",
   "lignes": [
    {
     "entreprise": "google",
     "statut": "valeur",
     "valeur": 26.604175,
     "mediane": 23.358349999999998,
     "n": 4,
     "modeles": [
      {
       "nom": "Gemma 3 27B",
       "id": "google/gemma-3-27b-pt",
       "valeur": 50.410000000000004,
       "detail": "classe B"
      },
      {
       "nom": "Gemma 3 4B",
       "id": "google/gemma-3-4b-pt",
       "valeur": 34.3867,
       "detail": "classe A"
      },
      {
       "nom": "Gemma 3 1B",
       "id": "google/gemma-3-1b-pt",
       "valeur": 12.33,
       "detail": "classe A"
      },
      {
       "nom": "Gemma 3 270M",
       "id": "google/gemma-3-270m",
       "valeur": 9.29,
       "detail": "classe A"
      }
     ],
     "ecartes": 3,
     "resume": "Gemma 3 : 27B, 4B, 1B, 270M",
     "note": "Modèles ouverts Gemma 3. Gemini utilise des modèles fermés, non mesurés."
    },
    {
     "entreprise": "anthropic",
     "statut": "aucune",
     "texte": "Aucune donnée publique",
     "raison": "Anthropic n'a aucun modèle dans le classement : ses modèles sont fermés et non soumis."
    },
    {
     "entreprise": "openai",
     "statut": "non-mesure",
     "texte": "Aucun modèle actuel mesuré",
     "raison": "5 ancien(s) modèle(s) mesuré(s), écarté(s) : gpt2, gpt2-xl, gpt2-medium, gpt2-large, openai-gpt. Les modèles actuels gpt-oss ne sont mesurés qu'en raisonnement."
    },
    {
     "entreprise": "perplexity",
     "statut": "aucune",
     "texte": "Aucune donnée publique",
     "raison": "Perplexity n'a aucun modèle dans le classement."
    },
    {
     "entreprise": "microsoft",
     "statut": "valeur",
     "valeur": 23.5805,
     "mediane": 23.5805,
     "n": 2,
     "modeles": [
      {
       "nom": "Phi-4",
       "id": "microsoft/phi-4",
       "valeur": 28.741,
       "detail": "classe A"
      },
      {
       "nom": "Phi-4-reasoning-plus",
       "id": "microsoft/Phi-4-reasoning-plus",
       "valeur": 18.419999999999998,
       "detail": "classe A"
      }
     ],
     "ecartes": 3,
     "resume": "Phi-4, Phi-4-reasoning-plus",
     "note": "Modèles ouverts Phi-4. Copilot utilise des modèles fermés, non mesurés."
    },
    {
     "entreprise": "mistral",
     "statut": "valeur",
     "valeur": 22.0325,
     "mediane": 22.0325,
     "n": 2,
     "modeles": [
      {
       "nom": "Mistral NeMo 12B",
       "id": "mistralai/Mistral-Nemo-Instruct-2407",
       "valeur": 23.189999999999998,
       "detail": "classe A"
      },
      {
       "nom": "Ministral 8B",
       "id": "mistralai/Ministral-8B-Instruct-2410",
       "valeur": 20.875,
       "detail": "classe A"
      }
     ],
     "ecartes": 2,
     "resume": "Mistral NeMo 12B, Ministral 8B",
     "note": "Modèles ouverts de 2024 ; les modèles Mistral 3 et suivants ne sont pas mesurés."
    },
    {
     "entreprise": "meta",
     "statut": "valeur",
     "valeur": 17.375999999999998,
     "mediane": 17.375999999999998,
     "n": 1,
     "modeles": [
      {
       "nom": "Llama 3.1 8B",
       "id": "meta-llama/Meta-Llama-3.1-8B",
       "valeur": 17.375999999999998,
       "detail": "classe A"
      }
     ],
     "ecartes": 7,
     "resume": "Llama 3.1 8B",
     "note": "Llama 3.1 est la génération de Meta la plus récente mesurée ; Llama 4 et Muse Spark ne le sont pas."
    },
    {
     "entreprise": "deepseek",
     "statut": "valeur",
     "valeur": 43.085,
     "mediane": 43.085,
     "n": 2,
     "modeles": [
      {
       "nom": "R1-Distill-Llama-70B",
       "id": "deepseek-ai/DeepSeek-R1-Distill-Llama-70B",
       "valeur": 49.53,
       "detail": "classe C"
      },
      {
       "nom": "R1-Distill-Qwen-32B",
       "id": "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B",
       "valeur": 36.64,
       "detail": "classe C"
      }
     ],
     "ecartes": 0,
     "resume": "R1-Distill-Llama-70B, R1-Distill-Qwen-32B",
     "note": "Distillations de DeepSeek-R1 sur des bases Qwen et Llama ; le modèle de l'application DeepSeek n'est pas mesuré."
    }
   ]
  },
  {
   "id": "electricite-raisonnement",
   "indicateur": "electricite",
   "libelle": "Raisonnement",
   "grandeur": "Électricité consommée par les GPU, tâche « raisonnement »",
   "unite": "Wh",
   "uniteCourte": "Wh",
   "uniteLongue": "Wh pour 1 000 requêtes",
   "type": "mesuré",
   "facteur": 1,
   "note": "Ce classement ne mesure que des modèles ouverts : ChatGPT, Gemini et Copilot fonctionnent avec des modèles fermés, non mesurés ; Anthropic et Perplexity n'y ont aucun modèle. D'après AI Energy Score, les modèles qui raisonnent consomment en moyenne 30 fois plus que les autres : ne pas comparer cette vue à la génération de texte.",
   "source": "AI Energy Score (Hugging Face), classement de décembre 2025",
   "sourceUrl": "https://huggingface.co/spaces/AIEnergyScore/Leaderboard",
   "methode": "Énergie des GPU (NVIDIA H100) mesurée sur 1 000 requêtes. Moyenne des modèles retenus de chaque entreprise (modèles ouverts seulement) ; les anciennes générations sont écartées.",
   "lignes": [
    {
     "entreprise": "google",
     "statut": "valeur",
     "valeur": 11811.18,
     "mediane": 11811.18,
     "n": 1,
     "modeles": [
      {
       "nom": "Gemma 3 4B",
       "id": "google/gemma-3-4b-pt",
       "valeur": 11811.18,
       "detail": "classe A"
      }
     ],
     "ecartes": 0,
     "resume": "Gemma 3 4B",
     "note": "Modèles ouverts Gemma 3. Gemini utilise des modèles fermés, non mesurés."
    },
    {
     "entreprise": "anthropic",
     "statut": "aucune",
     "texte": "Aucune donnée publique",
     "raison": "Anthropic n'a aucun modèle dans le classement : ses modèles sont fermés et non soumis."
    },
    {
     "entreprise": "openai",
     "statut": "valeur",
     "valeur": 5195.426666666666,
     "mediane": 5195.426666666666,
     "n": 2,
     "modeles": [
      {
       "nom": "gpt-oss-120b",
       "id": "openai/gpt-oss-120b",
       "valeur": 6800.95,
       "detail": "faible 5 313 ; moyen 6 586 ; élevé 8 504 Wh"
      },
      {
       "nom": "gpt-oss-20b",
       "id": "openai/gpt-oss-20b",
       "valeur": 3589.9033333333336,
       "detail": "faible 1 136 ; moyen 4 122 ; élevé 5 512 Wh"
      }
     ],
     "ecartes": 0,
     "resume": "gpt-oss-120b, gpt-oss-20b",
     "note": "Modèles ouverts gpt-oss. ChatGPT utilise des modèles fermés, non mesurés."
    },
    {
     "entreprise": "perplexity",
     "statut": "aucune",
     "texte": "Aucune donnée publique",
     "raison": "Perplexity n'a aucun modèle dans le classement."
    },
    {
     "entreprise": "microsoft",
     "statut": "valeur",
     "valeur": 9461.61,
     "mediane": 9461.61,
     "n": 1,
     "modeles": [
      {
       "nom": "Phi-4-reasoning-plus",
       "id": "microsoft/Phi-4-reasoning-plus",
       "valeur": 9461.61,
       "detail": "classe A"
      }
     ],
     "ecartes": 0,
     "resume": "Phi-4-reasoning-plus",
     "note": "Modèles ouverts Phi-4. Copilot utilise des modèles fermés, non mesurés."
    },
    {
     "entreprise": "mistral",
     "statut": "non-mesure",
     "texte": "Aucun modèle mesuré pour cette tâche",
     "raison": "Aucun modèle de cette entreprise n'a été testé sur cette tâche."
    },
    {
     "entreprise": "meta",
     "statut": "non-mesure",
     "texte": "Aucun modèle mesuré pour cette tâche",
     "raison": "Aucun modèle de cette entreprise n'a été testé sur cette tâche."
    },
    {
     "entreprise": "deepseek",
     "statut": "valeur",
     "valeur": 6208.18,
     "mediane": 6208.18,
     "n": 2,
     "modeles": [
      {
       "nom": "R1-Distill-Llama-70B",
       "id": "deepseek-ai/DeepSeek-R1-Distill-Llama-70B",
       "valeur": 7626.53,
       "detail": "classe C"
      },
      {
       "nom": "R1-Distill-Qwen-32B",
       "id": "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B",
       "valeur": 4789.83,
       "detail": "classe C"
      }
     ],
     "ecartes": 0,
     "resume": "R1-Distill-Llama-70B, R1-Distill-Qwen-32B",
     "note": "Distillations de DeepSeek-R1 sur des bases Qwen et Llama ; le modèle de l'application DeepSeek n'est pas mesuré."
    }
   ]
  },
  {
   "id": "electricite-ecologits",
   "indicateur": "electricite",
   "libelle": "Estimation EcoLogits",
   "grandeur": "Électricité estimée pour une réponse de 1 000 tokens, modèles fermés compris",
   "unite": "Wh",
   "uniteCourte": "Wh",
   "uniteLongue": "Wh pour 1 000 tokens générés",
   "type": "estimé",
   "facteur": 1,
   "source": "Méthode EcoLogits 0.11.3 (CodeCarbon), calcul du groupe ; tailles : base EcoLogits ou entreprises",
   "sourceUrl": "https://ecologits.ai/latest/methodology/llm_inference/",
   "methode": "Estimation par la méthode EcoLogits 0.11.3 (analyse de cycle de vie simplifiée : usage et fabrication des serveurs et GPU, hors entraînement et réseau), recalculée par le groupe avec les formules et données publiées. Valeur centrale de la fourchette, moyenne des modèles retenus de chaque entreprise.",
   "note": "Estimations, pas des mesures : la taille des modèles fermés n'est pas publiée et la fourchette (trait fin) reflète cette incertitude. Ces valeurs ne se comparent pas aux chiffres déclarés par les entreprises, dont le périmètre est différent.",
   "lignes": [
    {
     "entreprise": "google",
     "statut": "valeur",
     "valeur": 10.034840780777243,
     "mediane": 8.128595271151429,
     "n": 3,
     "min": 6.223878329975986,
     "max": 13.8458032315785,
     "modeles": [
      {
       "nom": "Gemini 3.1 Pro (préversion)",
       "valeur": 21.547534631610162,
       "min": 13.08298408871847,
       "max": 30.012085174501856,
       "detail": "taille estimée par EcoLogits"
      },
      {
       "nom": "Gemini 3.5 Flash",
       "valeur": 8.128595271151429,
       "min": 5.483423226497774,
       "max": 10.773767315805081,
       "detail": "taille estimée par EcoLogits"
      },
      {
       "nom": "Gemini 3.1 Flash-Lite",
       "valeur": 0.4283924395701386,
       "min": 0.10522767471171407,
       "max": 0.7515572044285632,
       "detail": "taille estimée par EcoLogits"
      }
     ],
     "resume": "Gemini 3.1 Pro (préversion), Gemini 3.5 Flash, Gemini 3.1 Flash-Lite",
     "note": "Modèles fermés : taille estimée par EcoLogits (fourchette large)."
    },
    {
     "entreprise": "anthropic",
     "statut": "valeur",
     "valeur": 3.3920315650278177,
     "mediane": 2.7863132899413925,
     "n": 3,
     "min": 2.228649075566229,
     "max": 4.5554140544894075,
     "modeles": [
      {
       "nom": "Claude Opus 4.8",
       "valeur": 7.232370922763631,
       "min": 4.6722371328039864,
       "max": 9.792504712723277,
       "detail": "taille estimée par EcoLogits"
      },
      {
       "nom": "Claude Sonnet 4.6",
       "valeur": 2.7863132899413925,
       "min": 1.9305255195550999,
       "max": 3.6421010603276853,
       "detail": "taille estimée par EcoLogits"
      },
      {
       "nom": "Claude Haiku 4.5",
       "valeur": 0.15741048237842994,
       "min": 0.08318457433960032,
       "max": 0.2316363904172596,
       "detail": "taille estimée par EcoLogits"
      }
     ],
     "resume": "Claude Opus 4.8, Claude Sonnet 4.6, Claude Haiku 4.5",
     "note": "Modèles fermés : taille estimée par EcoLogits (fourchette large)."
    },
    {
     "entreprise": "openai",
     "statut": "valeur",
     "valeur": 3.84814589083681,
     "mediane": 1.2320342461303826,
     "n": 3,
     "min": 2.143077426172964,
     "max": 5.553214355500657,
     "modeles": [
      {
       "nom": "GPT-5.5",
       "valeur": 10.113758630105933,
       "min": 6.036796212658099,
       "max": 14.190721047553767,
       "detail": "taille estimée par EcoLogits"
      },
      {
       "nom": "GPT-5.4 mini",
       "valeur": 1.2320342461303826,
       "min": 0.294789809604687,
       "max": 2.1692786826560786,
       "detail": "taille estimée par EcoLogits"
      },
      {
       "nom": "GPT-5.4 nano",
       "valeur": 0.19864479627411494,
       "min": 0.09764625625610504,
       "max": 0.2996433362921248,
       "detail": "taille estimée par EcoLogits"
      }
     ],
     "resume": "GPT-5.5, GPT-5.4 mini, GPT-5.4 nano",
     "note": "Modèles fermés : taille estimée par EcoLogits (fourchette large)."
    },
    {
     "entreprise": "perplexity",
     "statut": "aucune",
     "texte": "Aucune donnée publique",
     "raison": "Perplexity ne publie ni chiffres environnementaux ni taille de ses modèles ; EcoLogits ne le couvre pas."
    },
    {
     "entreprise": "microsoft",
     "statut": "valeur",
     "valeur": 0.0896022126345282,
     "mediane": 0.0896022126345282,
     "n": 1,
     "min": 0.08759319441402308,
     "max": 0.0916112308550333,
     "modeles": [
      {
       "nom": "Phi-4",
       "valeur": 0.0896022126345282,
       "min": 0.08759319441402308,
       "max": 0.0916112308550333,
       "detail": "taille publiée par Microsoft"
      }
     ],
     "resume": "Phi-4",
     "note": "Modèle ouvert Phi-4 seulement. Copilot utilise des modèles fermés dont la taille n'est pas publiée."
    },
    {
     "entreprise": "mistral",
     "statut": "valeur",
     "valeur": 1.747274920688753,
     "mediane": 0.9077324226814056,
     "n": 3,
     "min": 1.747274920688753,
     "max": 1.747274920688753,
     "modeles": [
      {
       "nom": "Mistral Large 3",
       "valeur": 3.996406626143029,
       "min": 3.996406626143029,
       "max": 3.996406626143029,
       "detail": "taille publiée par Mistral AI"
      },
      {
       "nom": "Mistral Medium 3.5",
       "valeur": 0.9077324226814056,
       "min": 0.9077324226814056,
       "max": 0.9077324226814056,
       "detail": "taille publiée par Mistral AI"
      },
      {
       "nom": "Mistral Small 4",
       "valeur": 0.3376857132418248,
       "min": 0.3376857132418248,
       "max": 0.3376857132418248,
       "detail": "taille publiée par Mistral AI"
      }
     ],
     "resume": "Mistral Large 3, Mistral Medium 3.5, Mistral Small 4",
     "note": "Poids ouverts : taille publiée par Mistral AI ; serveurs supposés en Suède (hypothèse EcoLogits)."
    },
    {
     "entreprise": "meta",
     "statut": "valeur",
     "valeur": 0.9298451404483645,
     "mediane": 0.9298451404483645,
     "n": 2,
     "min": 0.9089965946984013,
     "max": 0.9506936861983278,
     "modeles": [
      {
       "nom": "Llama 4 Maverick",
       "valeur": 1.4877522247173833,
       "min": 1.4543945515174421,
       "max": 1.5211098979173245,
       "detail": "taille publiée par Meta"
      },
      {
       "nom": "Llama 4 Scout",
       "valeur": 0.37193805617934583,
       "min": 0.36359863787936053,
       "max": 0.38027747447933113,
       "detail": "taille publiée par Meta"
      }
     ],
     "resume": "Llama 4 Maverick, Llama 4 Scout",
     "note": "Llama 4 (avril 2025) : derniers modèles de Meta dont la taille est publiée. Meta AI fonctionne depuis avril 2026 avec Muse Spark, de taille non publiée."
    },
    {
     "entreprise": "deepseek",
     "statut": "valeur",
     "valeur": 4.837794894802065,
     "mediane": 4.837794894802065,
     "n": 2,
     "min": 4.729324157250449,
     "max": 4.946265632353679,
     "modeles": [
      {
       "nom": "DeepSeek-V4-Pro",
       "valeur": 8.259993328306656,
       "min": 8.07479168417422,
       "max": 8.44519497243909,
       "detail": "taille publiée par DeepSeek"
      },
      {
       "nom": "DeepSeek-V4-Flash",
       "valeur": 1.4155964612974736,
       "min": 1.3838566303266784,
       "max": 1.4473362922682689,
       "detail": "taille publiée par DeepSeek"
      }
     ],
     "resume": "DeepSeek-V4-Pro, DeepSeek-V4-Flash",
     "note": "Poids ouverts : taille publiée par DeepSeek. Hébergement supposé aux États-Unis (hypothèse EcoLogits pour les modèles ouverts)."
    }
   ]
  },
  {
   "id": "eau",
   "indicateur": "eau",
   "libelle": "Eau",
   "grandeur": "Eau consommée pour une réponse de 1 000 tokens (centre de données et production de l'électricité)",
   "unite": "mL",
   "uniteCourte": "mL",
   "uniteLongue": "mL pour 1 000 tokens générés",
   "type": "estimé",
   "facteur": 1,
   "source": "Méthode EcoLogits 0.11.3 (CodeCarbon), calcul du groupe ; tailles : base EcoLogits ou entreprises",
   "sourceUrl": "https://ecologits.ai/latest/methodology/llm_inference/",
   "methode": "Estimation par la méthode EcoLogits 0.11.3 (analyse de cycle de vie simplifiée : usage et fabrication des serveurs et GPU, hors entraînement et réseau), recalculée par le groupe avec les formules et données publiées. Valeur centrale de la fourchette, moyenne des modèles retenus de chaque entreprise.",
   "note": "Estimations, pas des mesures : la taille des modèles fermés n'est pas publiée et la fourchette (trait fin) reflète cette incertitude. Ces valeurs ne se comparent pas aux chiffres déclarés par les entreprises, dont le périmètre est différent. Inclut l'eau évaporée pour produire l'électricité : à ne pas comparer aux chiffres d'eau sur site publiés par Google ou Microsoft.",
   "lignes": [
    {
     "entreprise": "google",
     "statut": "valeur",
     "valeur": 40.627194479193925,
     "mediane": 32.90954267618648,
     "n": 3,
     "min": 25.19807945644256,
     "max": 56.056309501945286,
     "modeles": [
      {
       "nom": "Gemini 3.1 Pro (préversion)",
       "valeur": 87.23764523524282,
       "min": 52.96794942265103,
       "max": 121.50734104783463,
       "detail": "taille estimée par EcoLogits"
      },
      {
       "nom": "Gemini 3.5 Flash",
       "valeur": 32.90954267618648,
       "min": 22.200262734751544,
       "max": 43.61882261762141,
       "detail": "taille estimée par EcoLogits"
      },
      {
       "nom": "Gemini 3.1 Flash-Lite",
       "valeur": 1.7343955261524644,
       "min": 0.4260262119251122,
       "max": 3.0427648403798164,
       "detail": "taille estimée par EcoLogits"
      }
     ],
     "resume": "Gemini 3.1 Pro (préversion), Gemini 3.5 Flash, Gemini 3.1 Flash-Lite",
     "note": "Modèles fermés : taille estimée par EcoLogits (fourchette large)."
    },
    {
     "entreprise": "anthropic",
     "statut": "valeur",
     "valeur": 12.753073788255534,
     "mediane": 10.437950269878792,
     "n": 3,
     "min": 7.246153952905398,
     "max": 18.259993623605673,
     "modeles": [
      {
       "nom": "Claude Opus 4.8",
       "valeur": 27.22179186184959,
       "min": 15.191153214723728,
       "max": 39.25243050897544,
       "detail": "taille estimée par EcoLogits"
      },
      {
       "nom": "Claude Sonnet 4.6",
       "valeur": 10.437950269878792,
       "min": 6.276845142681246,
       "max": 14.59905539707634,
       "detail": "taille estimée par EcoLogits"
      },
      {
       "nom": "Claude Haiku 4.5",
       "valeur": 0.5994792330382253,
       "min": 0.2704635013112163,
       "max": 0.9284949647652342,
       "detail": "taille estimée par EcoLogits"
      }
     ],
     "resume": "Claude Opus 4.8, Claude Sonnet 4.6, Claude Haiku 4.5",
     "note": "Modèles fermés : taille estimée par EcoLogits (fourchette large)."
    },
    {
     "entreprise": "openai",
     "statut": "valeur",
     "valeur": 13.877440254595093,
     "mediane": 4.443044034011795,
     "n": 3,
     "min": 7.7285086860933525,
     "max": 20.026371823096834,
     "modeles": [
      {
       "nom": "GPT-5.5",
       "valeur": 36.47291062246335,
       "min": 21.77029695516848,
       "max": 51.17552428975823,
       "detail": "taille estimée par EcoLogits"
      },
      {
       "nom": "GPT-5.4 mini",
       "valeur": 4.443044034011795,
       "min": 1.0630906640503959,
       "max": 7.8229974039731935,
       "detail": "taille estimée par EcoLogits"
      },
      {
       "nom": "GPT-5.4 nano",
       "valeur": 0.7163661073101315,
       "min": 0.3521384390611831,
       "max": 1.08059377555908,
       "detail": "taille estimée par EcoLogits"
      }
     ],
     "resume": "GPT-5.5, GPT-5.4 mini, GPT-5.4 nano",
     "note": "Modèles fermés : taille estimée par EcoLogits (fourchette large)."
    },
    {
     "entreprise": "perplexity",
     "statut": "aucune",
     "texte": "Aucune donnée publique",
     "raison": "Perplexity ne publie ni chiffres environnementaux ni taille de ses modèles ; EcoLogits ne le couvre pas."
    },
    {
     "entreprise": "microsoft",
     "statut": "valeur",
     "valeur": 0.3256450983319203,
     "mediane": 0.3256450983319203,
     "n": 1,
     "min": 0.28479753897078824,
     "max": 0.36649265769305234,
     "modeles": [
      {
       "nom": "Phi-4",
       "valeur": 0.3256450983319203,
       "min": 0.28479753897078824,
       "max": 0.36649265769305234,
       "detail": "taille publiée par Microsoft"
      }
     ],
     "resume": "Phi-4",
     "note": "Modèle ouvert Phi-4 seulement. Copilot utilise des modèles fermés dont la taille n'est pas publiée."
    },
    {
     "entreprise": "mistral",
     "statut": "valeur",
     "valeur": 10.674253117635928,
     "mediane": 5.545415622955766,
     "n": 3,
     "min": 10.674253117635928,
     "max": 10.674253117635928,
     "modeles": [
      {
       "nom": "Mistral Large 3",
       "valeur": 24.41439259692036,
       "min": 24.41439259692036,
       "max": 24.41439259692036,
       "detail": "taille publiée par Mistral AI"
      },
      {
       "nom": "Mistral Medium 3.5",
       "valeur": 5.545415622955766,
       "min": 5.545415622955766,
       "max": 5.545415622955766,
       "detail": "taille publiée par Mistral AI"
      },
      {
       "nom": "Mistral Small 4",
       "valeur": 2.062951133031656,
       "min": 2.062951133031656,
       "max": 2.062951133031656,
       "detail": "taille publiée par Mistral AI"
      }
     ],
     "resume": "Mistral Large 3, Mistral Medium 3.5, Mistral Small 4",
     "note": "Poids ouverts : taille publiée par Mistral AI ; serveurs supposés en Suède (hypothèse EcoLogits)."
    },
    {
     "entreprise": "meta",
     "statut": "valeur",
     "valeur": 3.3793753891975014,
     "mediane": 3.3793753891975014,
     "n": 2,
     "min": 2.955480672154672,
     "max": 3.8032701062403302,
     "modeles": [
      {
       "nom": "Llama 4 Maverick",
       "valeur": 5.407000622716002,
       "min": 4.728769075447476,
       "max": 6.085232169984528,
       "detail": "taille publiée par Meta"
      },
      {
       "nom": "Llama 4 Scout",
       "valeur": 1.3517501556790006,
       "min": 1.182192268861869,
       "max": 1.521308042496132,
       "detail": "taille publiée par Meta"
      }
     ],
     "resume": "Llama 4 Maverick, Llama 4 Scout",
     "note": "Llama 4 (avril 2025) : derniers modèles de Meta dont la taille est publiée. Meta AI fonctionne depuis avril 2026 avec Muse Spark, de taille non publiée."
    },
    {
     "entreprise": "deepseek",
     "statut": "valeur",
     "valeur": 17.58220191116574,
     "mediane": 17.58220191116574,
     "n": 2,
     "min": 15.376764028192532,
     "max": 19.787639794138943,
     "modeles": [
      {
       "nom": "DeepSeek-V4-Pro",
       "valeur": 30.019641932155846,
       "min": 26.25410358349074,
       "max": 33.785180280820946,
       "detail": "taille publiée par DeepSeek"
      },
      {
       "nom": "DeepSeek-V4-Flash",
       "valeur": 5.144761890175633,
       "min": 4.499424472894325,
       "max": 5.790099307456941,
       "detail": "taille publiée par DeepSeek"
      }
     ],
     "resume": "DeepSeek-V4-Pro, DeepSeek-V4-Flash",
     "note": "Poids ouverts : taille publiée par DeepSeek. Hébergement supposé aux États-Unis (hypothèse EcoLogits pour les modèles ouverts)."
    }
   ]
  },
  {
   "id": "carbone",
   "indicateur": "carbone",
   "libelle": "Empreinte carbone",
   "grandeur": "Gaz à effet de serre pour une réponse de 1 000 tokens (électricité et fabrication du matériel)",
   "unite": "g CO₂e",
   "uniteCourte": "g",
   "uniteLongue": "g CO₂e pour 1 000 tokens générés",
   "type": "estimé",
   "facteur": 1,
   "source": "Méthode EcoLogits 0.11.3 (CodeCarbon), calcul du groupe ; tailles : base EcoLogits ou entreprises",
   "sourceUrl": "https://ecologits.ai/latest/methodology/llm_inference/",
   "methode": "Estimation par la méthode EcoLogits 0.11.3 (analyse de cycle de vie simplifiée : usage et fabrication des serveurs et GPU, hors entraînement et réseau), recalculée par le groupe avec les formules et données publiées. Valeur centrale de la fourchette, moyenne des modèles retenus de chaque entreprise.",
   "note": "Estimations, pas des mesures : la taille des modèles fermés n'est pas publiée et la fourchette (trait fin) reflète cette incertitude. Ces valeurs ne se comparent pas aux chiffres déclarés par les entreprises, dont le périmètre est différent.",
   "lignes": [
    {
     "entreprise": "google",
     "statut": "valeur",
     "valeur": 4.83621553435426,
     "mediane": 3.9131281531218263,
     "n": 3,
     "min": 2.9898344126504903,
     "max": 6.6825966560580286,
     "modeles": [
      {
       "nom": "Gemini 3.1 Pro (préversion)",
       "valeur": 10.38994958154476,
       "min": 6.288040341062987,
       "max": 14.491858822026535,
       "detail": "taille estimée par EcoLogits"
      },
      {
       "nom": "Gemini 3.5 Flash",
       "valeur": 3.9131281531218263,
       "min": 2.6312815154712714,
       "max": 5.19497479077238,
       "detail": "taille estimée par EcoLogits"
      },
      {
       "nom": "Gemini 3.1 Flash-Lite",
       "valeur": 0.2055688683961931,
       "min": 0.050181381417213365,
       "max": 0.3609563553751728,
       "detail": "taille estimée par EcoLogits"
      }
     ],
     "resume": "Gemini 3.1 Pro (préversion), Gemini 3.5 Flash, Gemini 3.1 Flash-Lite",
     "note": "Modèles fermés : taille estimée par EcoLogits (fourchette large)."
    },
    {
     "entreprise": "anthropic",
     "statut": "valeur",
     "valeur": 1.620369205563765,
     "mediane": 1.3292517422070922,
     "n": 3,
     "min": 1.0667407760726753,
     "max": 2.173997635054855,
     "modeles": [
      {
       "nom": "Claude Opus 4.8",
       "valeur": 3.4573016620535673,
       "min": 2.238181879925101,
       "max": 4.676421444182033,
       "detail": "taille estimée par EcoLogits"
      },
      {
       "nom": "Claude Sonnet 4.6",
       "valeur": 1.3292517422070922,
       "min": 0.9225411221894658,
       "max": 1.735962362224719,
       "detail": "taille estimée par EcoLogits"
      },
      {
       "nom": "Claude Haiku 4.5",
       "valeur": 0.07455421243063567,
       "min": 0.03949932610345875,
       "max": 0.10960909875781258,
       "detail": "taille estimée par EcoLogits"
      }
     ],
     "resume": "Claude Opus 4.8, Claude Sonnet 4.6, Claude Haiku 4.5",
     "note": "Modèles fermés : taille estimée par EcoLogits (fourchette large)."
    },
    {
     "entreprise": "openai",
     "statut": "valeur",
     "valeur": 1.8190432280502973,
     "mediane": 0.5816669750788803,
     "n": 3,
     "min": 1.009377392258034,
     "max": 2.6287090638425608,
     "modeles": [
      {
       "nom": "GPT-5.5",
       "valeur": 4.782241949778214,
       "min": 2.8439980913513008,
       "max": 6.720485808205127,
       "detail": "taille estimée par EcoLogits"
      },
      {
       "nom": "GPT-5.4 mini",
       "valeur": 0.5816669750788803,
       "min": 0.13852351690795925,
       "max": 1.0248104332498014,
       "detail": "taille estimée par EcoLogits"
      },
      {
       "nom": "GPT-5.4 nano",
       "valeur": 0.09322075929379744,
       "min": 0.045610568514841694,
       "max": 0.14083095007275317,
       "detail": "taille estimée par EcoLogits"
      }
     ],
     "resume": "GPT-5.5, GPT-5.4 mini, GPT-5.4 nano",
     "note": "Modèles fermés : taille estimée par EcoLogits (fourchette large)."
    },
    {
     "entreprise": "perplexity",
     "statut": "aucune",
     "texte": "Aucune donnée publique",
     "raison": "Perplexity ne publie ni chiffres environnementaux ni taille de ses modèles ; EcoLogits ne le couvre pas."
    },
    {
     "entreprise": "microsoft",
     "statut": "valeur",
     "valeur": 0.04240800377017184,
     "mediane": 0.04240800377017184,
     "n": 1,
     "min": 0.04163573716620968,
     "max": 0.04318027037413401,
     "modeles": [
      {
       "nom": "Phi-4",
       "valeur": 0.04240800377017184,
       "min": 0.04163573716620968,
       "max": 0.04318027037413401,
       "detail": "taille publiée par Microsoft"
      }
     ],
     "resume": "Phi-4",
     "note": "Modèle ouvert Phi-4 seulement. Copilot utilise des modèles fermés dont la taille n'est pas publiée."
    },
    {
     "entreprise": "mistral",
     "statut": "valeur",
     "valeur": 0.21529453872662765,
     "mediane": 0.11422437385786427,
     "n": 3,
     "min": 0.21529453872662765,
     "max": 0.21529453872662765,
     "modeles": [
      {
       "nom": "Mistral Large 3",
       "valeur": 0.4912058224353463,
       "min": 0.4912058224353463,
       "max": 0.4912058224353463,
       "detail": "taille publiée par Mistral AI"
      },
      {
       "nom": "Mistral Medium 3.5",
       "valeur": 0.11422437385786427,
       "min": 0.11422437385786427,
       "max": 0.11422437385786427,
       "detail": "taille publiée par Mistral AI"
      },
      {
       "nom": "Mistral Small 4",
       "valeur": 0.04045341988667245,
       "min": 0.04045341988667245,
       "max": 0.04045341988667245,
       "detail": "taille publiée par Mistral AI"
      }
     ],
     "resume": "Mistral Large 3, Mistral Medium 3.5, Mistral Small 4",
     "note": "Poids ouverts : taille publiée par Mistral AI ; serveurs supposés en Suède (hypothèse EcoLogits)."
    },
    {
     "entreprise": "meta",
     "statut": "valeur",
     "valeur": 0.4403946356190146,
     "mediane": 0.4403946356190146,
     "n": 2,
     "min": 0.43238045463272873,
     "max": 0.44840881660530046,
     "modeles": [
      {
       "nom": "Llama 4 Maverick",
       "valeur": 0.7046314169904233,
       "min": 0.691808727412366,
       "max": 0.7174541065684807,
       "detail": "taille publiée par Meta"
      },
      {
       "nom": "Llama 4 Scout",
       "valeur": 0.17615785424760583,
       "min": 0.1729521818530915,
       "max": 0.17936352664212019,
       "detail": "taille publiée par Meta"
      }
     ],
     "resume": "Llama 4 Maverick, Llama 4 Scout",
     "note": "Llama 4 (avril 2025) : derniers modèles de Meta dont la taille est publiée. Meta AI fonctionne depuis avril 2026 avec Muse Spark, de taille non publiée."
    },
    {
     "entreprise": "deepseek",
     "statut": "valeur",
     "valeur": 2.301047913607985,
     "mediane": 2.301047913607985,
     "n": 2,
     "min": 2.2593517620931443,
     "max": 2.342744065122826,
     "modeles": [
      {
       "nom": "DeepSeek-V4-Pro",
       "valeur": 3.932268885782445,
       "min": 3.861077373777937,
       "max": 4.003460397786953,
       "detail": "taille publiée par DeepSeek"
      },
      {
       "nom": "DeepSeek-V4-Flash",
       "valeur": 0.669826941433525,
       "min": 0.6576261504083513,
       "max": 0.6820277324586986,
       "detail": "taille publiée par DeepSeek"
      }
     ],
     "resume": "DeepSeek-V4-Pro, DeepSeek-V4-Flash",
     "note": "Poids ouverts : taille publiée par DeepSeek. Hébergement supposé aux États-Unis (hypothèse EcoLogits pour les modèles ouverts)."
    }
   ]
  },
  {
   "id": "metaux",
   "indicateur": "metaux",
   "libelle": "Métaux et minéraux",
   "grandeur": "Épuisement des ressources minérales et métalliques pour une réponse de 1 000 tokens",
   "unite": "µg Sb éq.",
   "uniteCourte": "µg",
   "uniteLongue": "µg Sb éq. pour 1 000 tokens générés",
   "type": "estimé",
   "facteur": 1,
   "source": "Méthode EcoLogits 0.11.3 (CodeCarbon), calcul du groupe ; tailles : base EcoLogits ou entreprises",
   "sourceUrl": "https://ecologits.ai/latest/methodology/llm_inference/",
   "methode": "Estimation par la méthode EcoLogits 0.11.3 (analyse de cycle de vie simplifiée : usage et fabrication des serveurs et GPU, hors entraînement et réseau), recalculée par le groupe avec les formules et données publiées. Valeur centrale de la fourchette, moyenne des modèles retenus de chaque entreprise.",
   "note": "Estimations, pas des mesures : la taille des modèles fermés n'est pas publiée et la fourchette (trait fin) reflète cette incertitude. Ces valeurs ne se comparent pas aux chiffres déclarés par les entreprises, dont le périmètre est différent. Indicateur d'analyse de cycle de vie : épuisement des ressources abiotiques (ADPe), en antimoine équivalent. Il ne mesure pas la toxicité des « métaux lourds ».",
   "lignes": [
    {
     "entreprise": "google",
     "statut": "valeur",
     "valeur": 55.814925593381425,
     "mediane": 44.966457564423706,
     "n": 3,
     "min": 34.07366981514843,
     "max": 77.55618137161444,
     "modeles": [
      {
       "nom": "Gemini 3.1 Pro (préversion)",
       "valeur": 120.14549356360781,
       "min": 71.80536806799117,
       "max": 168.4856190592245,
       "detail": "taille estimée par EcoLogits"
      },
      {
       "nom": "Gemini 3.5 Flash",
       "valeur": 44.966457564423706,
       "min": 29.860168347043498,
       "max": 60.07274678180391,
       "detail": "taille estimée par EcoLogits"
      },
      {
       "nom": "Gemini 3.1 Flash-Lite",
       "valeur": 2.3328256521127733,
       "min": 0.555473030410604,
       "max": 4.110178273814943,
       "detail": "taille estimée par EcoLogits"
      }
     ],
     "resume": "Gemini 3.1 Pro (préversion), Gemini 3.5 Flash, Gemini 3.1 Flash-Lite",
     "note": "Modèles fermés : taille estimée par EcoLogits (fourchette large)."
    },
    {
     "entreprise": "anthropic",
     "statut": "valeur",
     "valeur": 18.06058548453599,
     "mediane": 14.736538235261403,
     "n": 3,
     "min": 11.984883029168165,
     "max": 24.136287939903823,
     "modeles": [
      {
       "nom": "Claude Opus 4.8",
       "valeur": 38.642979499690654,
       "min": 25.2275729870469,
       "max": 52.05838601233442,
       "detail": "taille estimée par EcoLogits"
      },
      {
       "nom": "Claude Sonnet 4.6",
       "valeur": 14.736538235261403,
       "min": 10.297488813525153,
       "max": 19.17558765699765,
       "detail": "taille estimée par EcoLogits"
      },
      {
       "nom": "Claude Haiku 4.5",
       "valeur": 0.8022387186559172,
       "min": 0.4295872869324358,
       "max": 1.1748901503793987,
       "detail": "taille estimée par EcoLogits"
      }
     ],
     "resume": "Claude Opus 4.8, Claude Sonnet 4.6, Claude Haiku 4.5",
     "note": "Modèles fermés : taille estimée par EcoLogits (fourchette large)."
    },
    {
     "entreprise": "openai",
     "statut": "valeur",
     "valeur": 19.413065633165537,
     "mediane": 6.17482154098673,
     "n": 3,
     "min": 10.60585204693533,
     "max": 28.22027921939574,
     "modeles": [
      {
       "nom": "GPT-5.5",
       "valeur": 51.10033841840051,
       "min": 29.9147032548296,
       "max": 72.28597358197142,
       "detail": "taille estimée par EcoLogits"
      },
      {
       "nom": "GPT-5.4 mini",
       "valeur": 6.17482154098673,
       "min": 1.4409120513069624,
       "max": 10.908731030666498,
       "detail": "taille estimée par EcoLogits"
      },
      {
       "nom": "GPT-5.4 nano",
       "valeur": 0.9640369401093701,
       "min": 0.4619408346694315,
       "max": 1.4661330455493087,
       "detail": "taille estimée par EcoLogits"
      }
     ],
     "resume": "GPT-5.5, GPT-5.4 mini, GPT-5.4 nano",
     "note": "Modèles fermés : taille estimée par EcoLogits (fourchette large)."
    },
    {
     "entreprise": "perplexity",
     "statut": "aucune",
     "texte": "Aucune donnée publique",
     "raison": "Perplexity ne publie ni chiffres environnementaux ni taille de ses modèles ; EcoLogits ne le couvre pas."
    },
    {
     "entreprise": "microsoft",
     "statut": "valeur",
     "valeur": 0.4549624243737003,
     "mediane": 0.4549624243737003,
     "n": 1,
     "min": 0.4547644356280695,
     "max": 0.45516041311933103,
     "modeles": [
      {
       "nom": "Phi-4",
       "valeur": 0.4549624243737003,
       "min": 0.4547644356280695,
       "max": 0.45516041311933103,
       "detail": "taille publiée par Microsoft"
      }
     ],
     "resume": "Phi-4",
     "note": "Modèle ouvert Phi-4 seulement. Copilot utilise des modèles fermés dont la taille n'est pas publiée."
    },
    {
     "entreprise": "mistral",
     "statut": "valeur",
     "valeur": 8.744047097635633,
     "mediane": 4.675733819192963,
     "n": 3,
     "min": 8.744047097635633,
     "max": 8.744047097635633,
     "modeles": [
      {
       "nom": "Mistral Large 3",
       "valeur": 19.931207505568388,
       "min": 19.931207505568388,
       "max": 19.931207505568388,
       "detail": "taille publiée par Mistral AI"
      },
      {
       "nom": "Mistral Medium 3.5",
       "valeur": 4.675733819192963,
       "min": 4.675733819192963,
       "max": 4.675733819192963,
       "detail": "taille publiée par Mistral AI"
      },
      {
       "nom": "Mistral Small 4",
       "valeur": 1.6251999681455476,
       "min": 1.6251999681455476,
       "max": 1.6251999681455476,
       "detail": "taille publiée par Mistral AI"
      }
     ],
     "resume": "Mistral Large 3, Mistral Medium 3.5, Mistral Small 4",
     "note": "Poids ouverts : taille publiée par Mistral AI ; serveurs supposés en Suède (hypothèse EcoLogits)."
    },
    {
     "entreprise": "meta",
     "statut": "valeur",
     "valeur": 4.738527595681606,
     "mediane": 4.738527595681606,
     "n": 2,
     "min": 4.736472971497947,
     "max": 4.740582219865265,
     "modeles": [
      {
       "nom": "Llama 4 Maverick",
       "valeur": 7.581644153090569,
       "min": 7.578356754396715,
       "max": 7.5849315517844245,
       "detail": "taille publiée par Meta"
      },
      {
       "nom": "Llama 4 Scout",
       "valeur": 1.8954110382726423,
       "min": 1.8945891885991788,
       "max": 1.8962328879461061,
       "detail": "taille publiée par Meta"
      }
     ],
     "resume": "Llama 4 Maverick, Llama 4 Scout",
     "note": "Llama 4 (avril 2025) : derniers modèles de Meta dont la taille est publiée. Meta AI fonctionne depuis avril 2026 avec Muse Spark, de taille non publiée."
    },
    {
     "entreprise": "deepseek",
     "statut": "valeur",
     "valeur": 25.20051455369465,
     "mediane": 25.20051455369465,
     "n": 2,
     "min": 25.18982476250894,
     "max": 25.211204344880365,
     "modeles": [
      {
       "nom": "DeepSeek-V4-Pro",
       "valeur": 43.22237877178055,
       "min": 43.2041271497513,
       "max": 43.24063039380981,
       "detail": "taille publiée par DeepSeek"
      },
      {
       "nom": "DeepSeek-V4-Flash",
       "valeur": 7.178650335608749,
       "min": 7.175522375266578,
       "max": 7.181778295950921,
       "detail": "taille publiée par DeepSeek"
      }
     ],
     "resume": "DeepSeek-V4-Pro, DeepSeek-V4-Flash",
     "note": "Poids ouverts : taille publiée par DeepSeek. Hébergement supposé aux États-Unis (hypothèse EcoLogits pour les modèles ouverts)."
    }
   ]
  }
 ],
 "publications": [
  {
   "entreprise": "google",
   "objet": "Application Gemini : requête texte médiane (mai 2025)",
   "electricite": "0,24 Wh",
   "carbone": "0,03 g CO₂e",
   "eau": "0,26 mL",
   "metaux": "Non publié",
   "perimetre": "Exploitation des serveurs (puces, processeurs et mémoire, machines en attente, refroidissement). Carbone : électricité en « market-based » (0,023 g) et fabrication du matériel (0,010 g). Eau : consommée sur place par les centres de données, sans l'eau de production de l'électricité. Hors entraînement, réseau et appareils des utilisateurs. Non vérifié par un tiers.",
   "type": "déclaré",
   "source": "Google, « Measuring the environmental impact of AI inference », 21 août 2025 ; article arXiv 2508.15734",
   "url": "https://cloud.google.com/blog/products/infrastructure/measuring-the-environmental-impact-of-ai-inference"
  },
  {
   "entreprise": "openai",
   "objet": "ChatGPT : requête moyenne",
   "electricite": "0,34 Wh",
   "carbone": "Non publié",
   "eau": "0,32 mL (0,000085 gallon)",
   "metaux": "Non publié",
   "perimetre": "Chiffres donnés dans un billet de blog, sans méthode ni périmètre publiés.",
   "type": "déclaré",
   "source": "Sam Altman (PDG d'OpenAI), « The Gentle Singularity », 10 juin 2025",
   "url": "https://blog.samaltman.com/the-gentle-singularity"
  },
  {
   "entreprise": "mistral",
   "objet": "Le Chat (Mistral Large 2) : réponse de 400 tokens",
   "electricite": "Non publié",
   "carbone": "1,14 g CO₂e",
   "eau": "45 mL",
   "metaux": "0,16 mg Sb éq.",
   "perimetre": "Analyse de cycle de vie : impact marginal de l'inférence, fabrication des serveurs comprise, hors appareils des utilisateurs (méthode AFNOR « IA frugale », avec Carbone 4 et l'ADEME, revue par Resilio et Hubblo). Entraînement et 18 mois d'usage : 20,4 kt CO₂e, 281 000 m³ d'eau, 660 kg Sb éq.",
   "type": "déclaré",
   "source": "Mistral AI, « Our contribution to a global environmental standard for AI », 22 juillet 2025",
   "url": "https://mistral.ai/news/our-contribution-to-a-global-environmental-standard-for-ai"
  },
  {
   "entreprise": "microsoft",
   "objet": "« Requête typique » (environ 300 tokens générés) adressée à de grands modèles non nommés",
   "electricite": "0,16 à 0,60 Wh",
   "carbone": "Non publié",
   "eau": "0 à 0,067 mL",
   "metaux": "Non publié",
   "perimetre": "Estimation pour des modèles de plus de 200 G paramètres servis à grande échelle ; eau de refroidissement. Ce n'est pas une mesure de Copilot.",
   "type": "déclaré",
   "source": "Microsoft, « Scaling AI with 8 to 20x energy efficiency », 15 juin 2026 ; Oviedo et al., Joule (2026)",
   "url": "https://www.microsoft.com/en-us/microsoft-cloud/blog/2026/06/15/scaling-ai-with-8-to-20x-energy-efficiency/"
  },
  {
   "entreprise": "meta",
   "objet": "Entraînement de Llama 4 Scout et Maverick (aucun chiffre par requête)",
   "electricite": "7,38 millions d'heures de GPU H100",
   "carbone": "1 999 t CO₂e (location-based) ; 0 t (market-based)",
   "eau": "Non publié",
   "metaux": "Non publié",
   "perimetre": "Entraînement seulement, d'après la carte du modèle.",
   "type": "déclaré",
   "source": "Meta, carte du modèle Llama 4 sur Hugging Face, 5 avril 2025",
   "url": "https://huggingface.co/meta-llama/Llama-4-Maverick-17B-128E-Instruct"
  },
  {
   "entreprise": "anthropic",
   "objet": "Claude",
   "electricite": "Non publié",
   "carbone": "Non publié",
   "eau": "Non publié",
   "metaux": "Non publié",
   "perimetre": "Aucun chiffre environnemental par requête ou par modèle trouvé (recherche du 25/11/2026).",
   "type": "rien",
   "source": "",
   "url": ""
  },
  {
   "entreprise": "perplexity",
   "objet": "Perplexity",
   "electricite": "Non publié",
   "carbone": "Non publié",
   "eau": "Non publié",
   "metaux": "Non publié",
   "perimetre": "Aucun chiffre environnemental trouvé (recherche du 25/11/2026).",
   "type": "rien",
   "source": "",
   "url": ""
  },
  {
   "entreprise": "deepseek",
   "objet": "DeepSeek",
   "electricite": "Non publié",
   "carbone": "Non publié",
   "eau": "Non publié",
   "metaux": "Non publié",
   "perimetre": "Aucun chiffre environnemental trouvé, y compris dans l'annonce de DeepSeek V4 (24/04/2026).",
   "type": "rien",
   "source": "",
   "url": ""
  }
 ],
 "matrice": {
  "colonnes": [
   {
    "id": "electricite",
    "libelle": "Électricité"
   },
   {
    "id": "eau",
    "libelle": "Eau"
   },
   {
    "id": "carbone",
    "libelle": "Empreinte carbone"
   },
   {
    "id": "metaux",
    "libelle": "Métaux et minéraux"
   }
  ],
  "etats": {
   "publie": "Publié par l'entreprise",
   "tiers": "Mesuré ou estimé par un tiers",
   "rien": "Rien"
  },
  "lignes": [
   {
    "entreprise": "google",
    "cellules": {
     "electricite": {
      "etat": "publie",
      "detail": "0,24 Wh par requête médiane de l'application Gemini (Google, août 2025).",
      "partiel": false
     },
     "eau": {
      "etat": "publie",
      "detail": "0,26 mL par requête médiane, eau consommée sur place (Google, août 2025).",
      "partiel": false
     },
     "carbone": {
      "etat": "publie",
      "detail": "0,03 g CO₂e par requête médiane (Google, août 2025).",
      "partiel": false
     },
     "metaux": {
      "etat": "tiers",
      "detail": "Estimation EcoLogits seulement.",
      "partiel": false
     }
    }
   },
   {
    "entreprise": "anthropic",
    "cellules": {
     "electricite": {
      "etat": "tiers",
      "detail": "Estimations EcoLogits et CLEER (Sustainable AI Group, septembre 2026).",
      "partiel": false
     },
     "eau": {
      "etat": "tiers",
      "detail": "Estimation EcoLogits seulement.",
      "partiel": false
     },
     "carbone": {
      "etat": "tiers",
      "detail": "Estimations EcoLogits et CLEER.",
      "partiel": false
     },
     "metaux": {
      "etat": "tiers",
      "detail": "Estimation EcoLogits seulement.",
      "partiel": false
     }
    }
   },
   {
    "entreprise": "openai",
    "cellules": {
     "electricite": {
      "etat": "publie",
      "detail": "0,34 Wh par requête moyenne, sans méthode publiée (Sam Altman, juin 2025).",
      "partiel": true
     },
     "eau": {
      "etat": "publie",
      "detail": "0,32 mL par requête moyenne, sans méthode publiée (Sam Altman, juin 2025).",
      "partiel": true
     },
     "carbone": {
      "etat": "tiers",
      "detail": "Estimations EcoLogits et CLEER.",
      "partiel": false
     },
     "metaux": {
      "etat": "tiers",
      "detail": "Estimation EcoLogits seulement.",
      "partiel": false
     }
    }
   },
   {
    "entreprise": "perplexity",
    "cellules": {
     "electricite": {
      "etat": "rien",
      "detail": "Aucune donnée publiée ni estimée.",
      "partiel": false
     },
     "eau": {
      "etat": "rien",
      "detail": "Aucune donnée publiée ni estimée.",
      "partiel": false
     },
     "carbone": {
      "etat": "rien",
      "detail": "Aucune donnée publiée ni estimée.",
      "partiel": false
     },
     "metaux": {
      "etat": "rien",
      "detail": "Aucune donnée publiée ni estimée.",
      "partiel": false
     }
    }
   },
   {
    "entreprise": "microsoft",
    "cellules": {
     "electricite": {
      "etat": "publie",
      "detail": "0,16 à 0,60 Wh pour une « requête typique » à de grands modèles non nommés, pas Copilot (Microsoft, juin 2026). Phi mesurés par AI Energy Score.",
      "partiel": true
     },
     "eau": {
      "etat": "publie",
      "detail": "0 à 0,067 mL d'eau de refroidissement par « requête typique », modèles non nommés (Microsoft, juin 2026).",
      "partiel": true
     },
     "carbone": {
      "etat": "tiers",
      "detail": "Estimation EcoLogits pour le modèle ouvert Phi-4 seulement.",
      "partiel": false
     },
     "metaux": {
      "etat": "tiers",
      "detail": "Estimation EcoLogits pour le modèle ouvert Phi-4 seulement.",
      "partiel": false
     }
    }
   },
   {
    "entreprise": "mistral",
    "cellules": {
     "electricite": {
      "etat": "tiers",
      "detail": "L'analyse de cycle de vie ne donne pas de Wh ; mesures AI Energy Score et estimation EcoLogits.",
      "partiel": false
     },
     "eau": {
      "etat": "publie",
      "detail": "45 mL par réponse de 400 tokens (analyse de cycle de vie, juillet 2025).",
      "partiel": false
     },
     "carbone": {
      "etat": "publie",
      "detail": "1,14 g CO₂e par réponse de 400 tokens (analyse de cycle de vie, juillet 2025).",
      "partiel": false
     },
     "metaux": {
      "etat": "publie",
      "detail": "0,16 mg Sb éq. par réponse de 400 tokens (analyse de cycle de vie, juillet 2025).",
      "partiel": false
     }
    }
   },
   {
    "entreprise": "meta",
    "cellules": {
     "electricite": {
      "etat": "tiers",
      "detail": "Mesures AI Energy Score (Llama 3.1) et estimation EcoLogits ; Meta publie seulement les heures de GPU d'entraînement.",
      "partiel": false
     },
     "eau": {
      "etat": "tiers",
      "detail": "Estimation EcoLogits seulement.",
      "partiel": false
     },
     "carbone": {
      "etat": "publie",
      "detail": "Entraînement seulement : 1 999 t CO₂e pour Llama 4 (carte du modèle, avril 2025).",
      "partiel": true
     },
     "metaux": {
      "etat": "tiers",
      "detail": "Estimation EcoLogits seulement.",
      "partiel": false
     }
    }
   },
   {
    "entreprise": "deepseek",
    "cellules": {
     "electricite": {
      "etat": "tiers",
      "detail": "Mesures AI Energy Score (distillations de R1) et estimation EcoLogits.",
      "partiel": false
     },
     "eau": {
      "etat": "tiers",
      "detail": "Estimation EcoLogits seulement.",
      "partiel": false
     },
     "carbone": {
      "etat": "tiers",
      "detail": "Estimation EcoLogits seulement.",
      "partiel": false
     },
     "metaux": {
      "etat": "tiers",
      "detail": "Estimation EcoLogits seulement.",
      "partiel": false
     }
    }
   }
  ],
  "notePartiel": "* Publication partielle : chiffre sans méthode (OpenAI), estimation générique pour des modèles non nommés (Microsoft) ou entraînement seulement (Meta).",
  "source": "Publications des entreprises (voir le tableau « Ce que publient les entreprises ») ; tiers : AI Energy Score (décembre 2025), EcoLogits 0.11.3, CLEER (Sustainable AI Group, septembre 2026). Recherche arrêtée au 25/11/2026."
 },
 "sources": {
  "aies": {
   "titre": "AI Energy Score Leaderboard – December 2025 (v2)",
   "editeur": "AI Energy Score (Hugging Face, Salesforce et partenaires) – S. Luccioni, B. Gamazaychikov",
   "url": "https://huggingface.co/spaces/AIEnergyScore/Leaderboard",
   "date": "décembre 2025 (données du Space, fichiers data/energy/*.csv)"
  },
  "ecologits": {
   "titre": "EcoLogits – méthode et base de données (version 0.11.3)",
   "editeur": "EcoLogits, projet de l'association CodeCarbon (initié par GenAI Impact)",
   "url": "https://ecologits.ai/latest/methodology/llm_inference/",
   "date": "14 octobre 2026 (version 0.11.3)"
  },
  "comparia": {
   "titre": "Compar:IA – jeux de données (conversations, votes, réactions) et classement",
   "editeur": "Ministère de la Culture",
   "url": "https://www.data.gouv.fr/datasets/compar-ia",
   "date": "données du 3 juin 2026 ; classement du 16 juin 2026"
  }
 }
};
