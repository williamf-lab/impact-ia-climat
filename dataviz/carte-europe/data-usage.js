/* Données de la carte « IA la plus utilisée par pays » — fichier GÉNÉRÉ par
   build_data.py à partir du fichier Excel du groupe (non publié) : ne pas modifier
   à la main (remplacer l'Excel puis relancer le script).
   Source : StatCounter Global Stats, octobre 2026. */
window.DATA_USAGE_IA = {
  "source": "StatCounter Global Stats, octobre 2026",
  "sourceUrl": "https://gs.statcounter.com/ai-chatbot-market-share/",
  "periode": "octobre 2026",
  "mesure": "Part des visites envoyées vers des sites web par chaque IA conversationnelle (clics de référence), en %",
  "genereLe": "2026-11-25",
  "ias": [
    {
      "id": "gemini",
      "label": "Gemini",
      "entreprise": "Google",
      "cssVar": "--ia-gemini"
    },
    {
      "id": "claude",
      "label": "Claude",
      "entreprise": "Anthropic",
      "cssVar": "--ia-claude"
    },
    {
      "id": "chatgpt",
      "label": "ChatGPT",
      "entreprise": "OpenAI",
      "cssVar": "--ia-chatgpt"
    },
    {
      "id": "perplexity",
      "label": "Perplexity",
      "entreprise": "Perplexity AI",
      "cssVar": "--ia-perplexity"
    },
    {
      "id": "copilot",
      "label": "Copilot",
      "entreprise": "Microsoft",
      "cssVar": "--ia-copilot"
    }
  ],
  "autre": {
    "id": "autre",
    "label": "Autre IA",
    "cssVar": "--autre",
    "definition": "100 % moins la somme des cinq IA du fichier (arrondi à 0,01 ; jamais négatif)"
  },
  "corrections": [
    {
      "pays": "Belgique",
      "iso3": "BEL",
      "ia": "chatgpt",
      "valeurFichier": 49.9,
      "valeurRetenue": 46.9,
      "source": "relevé StatCounter Global Stats d'octobre 2026 (vérifié le 25/11/2026)",
      "raison": "Avec 49,9 % la somme des cinq IA atteignait 102,99 %."
    }
  ],
  "pays": [
    {
      "nom": "Albanie",
      "iso2": "AL",
      "iso3": "ALB",
      "num": 8,
      "parts": {
        "chatgpt": 65.71,
        "claude": 3.81,
        "copilot": 2.86,
        "gemini": 19.05,
        "perplexity": 8.57,
        "autre": 0
      },
      "enTete": "chatgpt",
      "atypique": false
    },
    {
      "nom": "Allemagne",
      "iso2": "DE",
      "iso3": "DEU",
      "num": 276,
      "parts": {
        "chatgpt": 41.5,
        "claude": 4.04,
        "copilot": 3.68,
        "gemini": 34.88,
        "perplexity": 15.87,
        "autre": 0.03
      },
      "enTete": "chatgpt",
      "atypique": false
    },
    {
      "nom": "Andorre",
      "iso2": "AD",
      "iso3": "AND",
      "num": 20,
      "parts": {
        "chatgpt": 30.77,
        "claude": 0,
        "copilot": 0,
        "gemini": 53.85,
        "perplexity": 15.38,
        "autre": 0
      },
      "enTete": "gemini",
      "atypique": true
    },
    {
      "nom": "Arménie",
      "iso2": "AM",
      "iso3": "ARM",
      "num": 51,
      "parts": {
        "chatgpt": 49.34,
        "claude": 6.55,
        "copilot": 1.31,
        "gemini": 33.19,
        "perplexity": 9.61,
        "autre": 0
      },
      "enTete": "chatgpt",
      "atypique": false
    },
    {
      "nom": "Autriche",
      "iso2": "AT",
      "iso3": "AUT",
      "num": 40,
      "parts": {
        "chatgpt": 44.39,
        "claude": 6.12,
        "copilot": 2.49,
        "gemini": 34.88,
        "perplexity": 12.12,
        "autre": 0
      },
      "enTete": "chatgpt",
      "atypique": false
    },
    {
      "nom": "Azerbaïdjan",
      "iso2": "AZ",
      "iso3": "AZE",
      "num": 31,
      "parts": {
        "chatgpt": 66.67,
        "claude": 2.67,
        "copilot": 0.48,
        "gemini": 25.09,
        "perplexity": 5.09,
        "autre": 0
      },
      "enTete": "chatgpt",
      "atypique": false,
      "nomSource": "Azerbaidjan"
    },
    {
      "nom": "Belgique",
      "iso2": "BE",
      "iso3": "BEL",
      "num": 56,
      "parts": {
        "chatgpt": 46.9,
        "claude": 4.37,
        "copilot": 3.6,
        "gemini": 37.61,
        "perplexity": 7.51,
        "autre": 0.01
      },
      "enTete": "chatgpt",
      "atypique": false,
      "note": "ChatGPT : 49,9 % dans le fichier du groupe, corrigé en 46,9 % d'après le relevé StatCounter Global Stats d'octobre 2026 (vérifié le 25/11/2026)."
    },
    {
      "nom": "Biélorussie",
      "iso2": "BY",
      "iso3": "BLR",
      "num": 112,
      "parts": {
        "chatgpt": 6.99,
        "claude": 2.1,
        "copilot": 0.7,
        "gemini": 49.65,
        "perplexity": 40.56,
        "autre": 0
      },
      "enTete": "gemini",
      "atypique": false
    },
    {
      "nom": "Bosnie-Herzégovine",
      "iso2": "BA",
      "iso3": "BIH",
      "num": 70,
      "parts": {
        "chatgpt": 55.56,
        "claude": 1.85,
        "copilot": 1.85,
        "gemini": 38.15,
        "perplexity": 2.59,
        "autre": 0
      },
      "enTete": "chatgpt",
      "atypique": false
    },
    {
      "nom": "Bulgarie",
      "iso2": "BG",
      "iso3": "BGR",
      "num": 100,
      "parts": {
        "chatgpt": 51.08,
        "claude": 2.78,
        "copilot": 1.36,
        "gemini": 38.9,
        "perplexity": 5.88,
        "autre": 0
      },
      "enTete": "chatgpt",
      "atypique": false
    },
    {
      "nom": "Chypre",
      "iso2": "CY",
      "iso3": "CYP",
      "num": 196,
      "parts": {
        "chatgpt": 54.64,
        "claude": 5.15,
        "copilot": 1.72,
        "gemini": 29.55,
        "perplexity": 8.93,
        "autre": 0.01
      },
      "enTete": "chatgpt",
      "atypique": false
    },
    {
      "nom": "Croatie",
      "iso2": "HR",
      "iso3": "HRV",
      "num": 191,
      "parts": {
        "chatgpt": 61.56,
        "claude": 2.26,
        "copilot": 2.01,
        "gemini": 26.63,
        "perplexity": 7.54,
        "autre": 0
      },
      "enTete": "chatgpt",
      "atypique": false
    },
    {
      "nom": "Danemark",
      "iso2": "DK",
      "iso3": "DNK",
      "num": 208,
      "parts": {
        "chatgpt": 58.73,
        "claude": 3.25,
        "copilot": 3.92,
        "gemini": 23.41,
        "perplexity": 10.69,
        "autre": 0
      },
      "enTete": "chatgpt",
      "atypique": false
    },
    {
      "nom": "Espagne",
      "iso2": "ES",
      "iso3": "ESP",
      "num": 724,
      "parts": {
        "chatgpt": 41.72,
        "claude": 2.09,
        "copilot": 2.86,
        "gemini": 44.03,
        "perplexity": 9.3,
        "autre": 0
      },
      "enTete": "gemini",
      "atypique": false
    },
    {
      "nom": "Estonie",
      "iso2": "EE",
      "iso3": "EST",
      "num": 233,
      "parts": {
        "chatgpt": 47.87,
        "claude": 5.21,
        "copilot": 3.08,
        "gemini": 36.49,
        "perplexity": 7.35,
        "autre": 0
      },
      "enTete": "chatgpt",
      "atypique": false
    },
    {
      "nom": "Finlande",
      "iso2": "FI",
      "iso3": "FIN",
      "num": 246,
      "parts": {
        "chatgpt": 40.85,
        "claude": 6,
        "copilot": 4.83,
        "gemini": 34.55,
        "perplexity": 13.76,
        "autre": 0.01
      },
      "enTete": "chatgpt",
      "atypique": false
    },
    {
      "nom": "France",
      "iso2": "FR",
      "iso3": "FRA",
      "num": 250,
      "parts": {
        "chatgpt": 43.33,
        "claude": 4.65,
        "copilot": 3.59,
        "gemini": 36.38,
        "perplexity": 12.05,
        "autre": 0
      },
      "enTete": "chatgpt",
      "atypique": false
    },
    {
      "nom": "Géorgie",
      "iso2": "GE",
      "iso3": "GEO",
      "num": 268,
      "parts": {
        "chatgpt": 53.18,
        "claude": 5.06,
        "copilot": 1.63,
        "gemini": 33.93,
        "perplexity": 6.2,
        "autre": 0
      },
      "enTete": "chatgpt",
      "atypique": false
    },
    {
      "nom": "Grèce",
      "iso2": "GR",
      "iso3": "GRC",
      "num": 300,
      "parts": {
        "chatgpt": 45.84,
        "claude": 3.51,
        "copilot": 3.02,
        "gemini": 39.64,
        "perplexity": 7.99,
        "autre": 0
      },
      "enTete": "chatgpt",
      "atypique": false
    },
    {
      "nom": "Hongrie",
      "iso2": "HU",
      "iso3": "HUN",
      "num": 348,
      "parts": {
        "chatgpt": 41.92,
        "claude": 1.78,
        "copilot": 2.33,
        "gemini": 46.16,
        "perplexity": 7.81,
        "autre": 0
      },
      "enTete": "gemini",
      "atypique": false
    },
    {
      "nom": "Irlande",
      "iso2": "IE",
      "iso3": "IRL",
      "num": 372,
      "parts": {
        "chatgpt": 42.77,
        "claude": 4.65,
        "copilot": 4.75,
        "gemini": 39.98,
        "perplexity": 7.85,
        "autre": 0
      },
      "enTete": "chatgpt",
      "atypique": false
    },
    {
      "nom": "Islande",
      "iso2": "IS",
      "iso3": "ISL",
      "num": 352,
      "parts": {
        "chatgpt": 54.72,
        "claude": 7.55,
        "copilot": 5.66,
        "gemini": 22.64,
        "perplexity": 9.43,
        "autre": 0
      },
      "enTete": "chatgpt",
      "atypique": false
    },
    {
      "nom": "Italie",
      "iso2": "IT",
      "iso3": "ITA",
      "num": 380,
      "parts": {
        "chatgpt": 29.68,
        "claude": 3.4,
        "copilot": 3.7,
        "gemini": 51.93,
        "perplexity": 11.28,
        "autre": 0.01
      },
      "enTete": "gemini",
      "atypique": false
    },
    {
      "nom": "Kazakhstan",
      "iso2": "KZ",
      "iso3": "KAZ",
      "num": 398,
      "parts": {
        "chatgpt": 30.53,
        "claude": 5.34,
        "copilot": 0.65,
        "gemini": 54.96,
        "perplexity": 8.51,
        "autre": 0.01
      },
      "enTete": "gemini",
      "atypique": false
    },
    {
      "nom": "Lettonie",
      "iso2": "LV",
      "iso3": "LVA",
      "num": 428,
      "parts": {
        "chatgpt": 38.17,
        "claude": 1.39,
        "copilot": 1.19,
        "gemini": 48.11,
        "perplexity": 11.13,
        "autre": 0.01
      },
      "enTete": "gemini",
      "atypique": false
    },
    {
      "nom": "Liechtenstein",
      "iso2": "LI",
      "iso3": "LIE",
      "num": 438,
      "parts": {
        "chatgpt": 66.67,
        "claude": 0,
        "copilot": 0,
        "gemini": 16.67,
        "perplexity": 16.67,
        "autre": 0
      },
      "enTete": "chatgpt",
      "atypique": true
    },
    {
      "nom": "Lituanie",
      "iso2": "LT",
      "iso3": "LTU",
      "num": 440,
      "parts": {
        "chatgpt": 54.52,
        "claude": 4.27,
        "copilot": 1.97,
        "gemini": 32.51,
        "perplexity": 6.73,
        "autre": 0
      },
      "enTete": "chatgpt",
      "atypique": false
    },
    {
      "nom": "Luxembourg",
      "iso2": "LU",
      "iso3": "LUX",
      "num": 442,
      "parts": {
        "chatgpt": 56.84,
        "claude": 6.32,
        "copilot": 5.26,
        "gemini": 20,
        "perplexity": 11.58,
        "autre": 0
      },
      "enTete": "chatgpt",
      "atypique": false
    },
    {
      "nom": "Macédoine du Nord",
      "iso2": "MK",
      "iso3": "MKD",
      "num": 807,
      "parts": {
        "chatgpt": 68.57,
        "claude": 1.9,
        "copilot": 1.9,
        "gemini": 25.24,
        "perplexity": 2.38,
        "autre": 0.01
      },
      "enTete": "chatgpt",
      "atypique": false
    },
    {
      "nom": "Malte",
      "iso2": "MT",
      "iso3": "MLT",
      "num": 470,
      "parts": {
        "chatgpt": 55.43,
        "claude": 1.71,
        "copilot": 3.43,
        "gemini": 36,
        "perplexity": 3.43,
        "autre": 0
      },
      "enTete": "chatgpt",
      "atypique": false
    },
    {
      "nom": "Moldavie",
      "iso2": "MD",
      "iso3": "MDA",
      "num": 498,
      "parts": {
        "chatgpt": 60.19,
        "claude": 1.91,
        "copilot": 0,
        "gemini": 32.8,
        "perplexity": 5.1,
        "autre": 0
      },
      "enTete": "chatgpt",
      "atypique": false
    },
    {
      "nom": "Monaco",
      "iso2": "MC",
      "iso3": "MCO",
      "num": 492,
      "parts": {
        "chatgpt": 0,
        "claude": 80,
        "copilot": 0,
        "gemini": 20,
        "perplexity": 0,
        "autre": 0
      },
      "enTete": "claude",
      "atypique": true
    },
    {
      "nom": "Monténégro",
      "iso2": "ME",
      "iso3": "MNE",
      "num": 499,
      "parts": {
        "chatgpt": 45.26,
        "claude": 3.16,
        "copilot": 2.11,
        "gemini": 38.95,
        "perplexity": 10.53,
        "autre": 0
      },
      "enTete": "chatgpt",
      "atypique": false
    },
    {
      "nom": "Norvège",
      "iso2": "NO",
      "iso3": "NOR",
      "num": 578,
      "parts": {
        "chatgpt": 56.17,
        "claude": 4.35,
        "copilot": 6.24,
        "gemini": 26.85,
        "perplexity": 6.39,
        "autre": 0
      },
      "enTete": "chatgpt",
      "atypique": false,
      "nomSource": "Norvege"
    },
    {
      "nom": "Pays-Bas",
      "iso2": "NL",
      "iso3": "NLD",
      "num": 528,
      "parts": {
        "chatgpt": 52.64,
        "claude": 2.81,
        "copilot": 4.79,
        "gemini": 30.79,
        "perplexity": 8.97,
        "autre": 0
      },
      "enTete": "chatgpt",
      "atypique": false
    },
    {
      "nom": "Pologne",
      "iso2": "PL",
      "iso3": "POL",
      "num": 616,
      "parts": {
        "chatgpt": 43.5,
        "claude": 2.43,
        "copilot": 1.92,
        "gemini": 42.59,
        "perplexity": 9.56,
        "autre": 0
      },
      "enTete": "chatgpt",
      "atypique": false
    },
    {
      "nom": "Portugal",
      "iso2": "PT",
      "iso3": "PRT",
      "num": 620,
      "parts": {
        "chatgpt": 40.8,
        "claude": 4.31,
        "copilot": 3.65,
        "gemini": 42.84,
        "perplexity": 8.39,
        "autre": 0.01
      },
      "enTete": "gemini",
      "atypique": false
    },
    {
      "nom": "Roumanie",
      "iso2": "RO",
      "iso3": "ROU",
      "num": 642,
      "parts": {
        "chatgpt": 48.74,
        "claude": 3.86,
        "copilot": 2.56,
        "gemini": 37.08,
        "perplexity": 7.76,
        "autre": 0
      },
      "enTete": "chatgpt",
      "atypique": false
    },
    {
      "nom": "Royaume-Uni",
      "iso2": "GB",
      "iso3": "GBR",
      "num": 826,
      "parts": {
        "chatgpt": 44.43,
        "claude": 4.19,
        "copilot": 10.57,
        "gemini": 31.14,
        "perplexity": 9.67,
        "autre": 0
      },
      "enTete": "chatgpt",
      "atypique": false
    },
    {
      "nom": "Russie",
      "iso2": "RU",
      "iso3": "RUS",
      "num": 643,
      "parts": {
        "chatgpt": 23.38,
        "claude": 2.47,
        "copilot": 2.27,
        "gemini": 32.44,
        "perplexity": 39.34,
        "autre": 0.1
      },
      "enTete": "perplexity",
      "atypique": false
    },
    {
      "nom": "Saint-Marin",
      "iso2": "SM",
      "iso3": "SMR",
      "num": 674,
      "parts": {
        "chatgpt": 0,
        "claude": 0,
        "copilot": 0,
        "gemini": 100,
        "perplexity": 0,
        "autre": 0
      },
      "enTete": "gemini",
      "atypique": true
    },
    {
      "nom": "Serbie",
      "iso2": "RS",
      "iso3": "SRB",
      "num": 688,
      "parts": {
        "chatgpt": 52.95,
        "claude": 3.85,
        "copilot": 1.54,
        "gemini": 36.03,
        "perplexity": 5.64,
        "autre": 0
      },
      "enTete": "chatgpt",
      "atypique": false
    },
    {
      "nom": "Slovaquie",
      "iso2": "SK",
      "iso3": "SVK",
      "num": 703,
      "parts": {
        "chatgpt": 43.45,
        "claude": 1.41,
        "copilot": 2.12,
        "gemini": 43.04,
        "perplexity": 9.98,
        "autre": 0
      },
      "enTete": "chatgpt",
      "atypique": false
    },
    {
      "nom": "Slovénie",
      "iso2": "SI",
      "iso3": "SVN",
      "num": 705,
      "parts": {
        "chatgpt": 59.23,
        "claude": 2.05,
        "copilot": 3.19,
        "gemini": 32.35,
        "perplexity": 2.96,
        "autre": 0.22
      },
      "enTete": "chatgpt",
      "atypique": false
    },
    {
      "nom": "Suède",
      "iso2": "SE",
      "iso3": "SWE",
      "num": 752,
      "parts": {
        "chatgpt": 52.23,
        "claude": 2.9,
        "copilot": 5.15,
        "gemini": 33.99,
        "perplexity": 5.73,
        "autre": 0
      },
      "enTete": "chatgpt",
      "atypique": false
    },
    {
      "nom": "Suisse",
      "iso2": "CH",
      "iso3": "CHE",
      "num": 756,
      "parts": {
        "chatgpt": 44.54,
        "claude": 3.39,
        "copilot": 3.16,
        "gemini": 34.54,
        "perplexity": 14.37,
        "autre": 0
      },
      "enTete": "chatgpt",
      "atypique": false
    },
    {
      "nom": "Tchéquie",
      "iso2": "CZ",
      "iso3": "CZE",
      "num": 203,
      "parts": {
        "chatgpt": 36.8,
        "claude": 3.3,
        "copilot": 3.64,
        "gemini": 46.53,
        "perplexity": 9.73,
        "autre": 0
      },
      "enTete": "gemini",
      "atypique": false,
      "nomSource": "République Tchèque"
    },
    {
      "nom": "Turquie",
      "iso2": "TR",
      "iso3": "TUR",
      "num": 792,
      "parts": {
        "chatgpt": 32.07,
        "claude": 2.68,
        "copilot": 1.55,
        "gemini": 60.42,
        "perplexity": 3.28,
        "autre": 0
      },
      "enTete": "gemini",
      "atypique": false
    },
    {
      "nom": "Ukraine",
      "iso2": "UA",
      "iso3": "UKR",
      "num": 804,
      "parts": {
        "chatgpt": 32.57,
        "claude": 2.84,
        "copilot": 1.31,
        "gemini": 57.67,
        "perplexity": 5.61,
        "autre": 0
      },
      "enTete": "gemini",
      "atypique": false
    }
  ]
};
