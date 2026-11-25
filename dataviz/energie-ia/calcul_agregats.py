#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
calcul_agregats.py — données de la dataviz « Électricité, eau, carbone et métaux par entreprise d'IA »

Ce script :
  1. lit les deux fichiers AI Energy Score (donnees-brutes/), garde les modèles
     « vraiment utilisés » de chaque entreprise et calcule moyenne, médiane et nombre
     de modèles, tâche par tâche (jamais de somme, jamais de mélange texte/raisonnement) ;
  2. recalcule avec les formules et les données publiées d'EcoLogits (association
     CodeCarbon, ex-GenAI Impact) l'électricité, l'eau, le carbone et l'épuisement
     des ressources abiotiques (métaux et minéraux) pour 1 000 tokens générés ;
  3. vérifie ce calcul contre les valeurs publiées par compar:IA (même méthode) ;
  4. écrit energie-par-modele.csv, energie-par-entreprise.csv et data-energie.js.

Lancement (Python 3, bibliothèque standard seulement) :
    python3 -I calcul_agregats.py
Les chemins sont relatifs au dossier du script.

Toutes les valeurs d'entrée sont recopiées des sources citées dans sources.md
(consultées le 25/11/2026). Ne rien changer ici sans mettre sources.md à jour.
"""

import csv
import json
import math
import re
import statistics
import sys
from pathlib import Path

ICI = Path(__file__).resolve().parent
DATE_CONSULTATION = "2026-11-25"

# ---------------------------------------------------------------------------
# Entreprises (ordre et couleurs = tokens.css, validés)
# ---------------------------------------------------------------------------
ENTREPRISES = [
    {"id": "google", "nom": "Google", "assistant": "Gemini", "couleur": "--ia-gemini"},
    {"id": "anthropic", "nom": "Anthropic", "assistant": "Claude", "couleur": "--ia-claude"},
    {"id": "openai", "nom": "OpenAI", "assistant": "ChatGPT", "couleur": "--ia-chatgpt"},
    {"id": "perplexity", "nom": "Perplexity", "assistant": "Perplexity", "couleur": "--ia-perplexity"},
    {"id": "microsoft", "nom": "Microsoft", "assistant": "Copilot", "couleur": "--ia-copilot"},
    {"id": "mistral", "nom": "Mistral AI", "assistant": "Le Chat", "couleur": "--ia-mistral"},
    {"id": "meta", "nom": "Meta", "assistant": "Meta AI", "couleur": "--ia-meta"},
    {"id": "deepseek", "nom": "DeepSeek", "assistant": "DeepSeek", "couleur": "--ia-deepseek"},
]
NOM = {e["id"]: e["nom"] for e in ENTREPRISES}

# Préfixe du dépôt Hugging Face -> entreprise
PREFIXES = {
    "openai-community/": "openai",
    "openai/": "openai",
    "microsoft/": "microsoft",
    "google/": "google",
    "meta-llama/": "meta",
    "facebook/": "meta",
    "mistralai/": "mistral",
    "deepseek-ai/": "deepseek",
}

# ---------------------------------------------------------------------------
# 1. AI Energy Score — sélection des modèles (une ligne de justification chacun)
# ---------------------------------------------------------------------------
# Règle : pour chaque entreprise, on garde la génération la plus récente présente
# dans le classement (décembre 2025) et encore distribuée ; on écarte les
# générations précédentes et les versions remplacées par une version plus récente
# de la même famille.
SELECTION_AIES = {
    # --- génération de texte ---
    "openai-community/openai-gpt": (False, "GPT-1 (2018) : génération ancienne, sans lien avec les modèles actuels d'OpenAI."),
    "openai-community/gpt2": (False, "GPT-2 (2019) : génération ancienne."),
    "openai-community/gpt2-medium": (False, "GPT-2 (2019) : génération ancienne."),
    "openai-community/gpt2-large": (False, "GPT-2 (2019) : génération ancienne."),
    "openai-community/gpt2-xl": (False, "GPT-2 (2019) : génération ancienne."),
    "microsoft/phi-1": (False, "Phi-1 (2023) : génération remplacée par Phi-4."),
    "microsoft/phi-1_5": (False, "Phi-1.5 (2023) : génération remplacée par Phi-4."),
    "microsoft/phi-2": (False, "Phi-2 (2023) : génération remplacée par Phi-4."),
    "microsoft/phi-4": (True, "Phi-4 (décembre 2024) : génération actuelle des modèles ouverts de Microsoft."),
    "microsoft/Phi-4-reasoning-plus": (True, "Phi-4-reasoning-plus (2025) : génération Phi-4 ; tâche texte mesurée sans le mode raisonnement."),
    "google/gemma-2b": (False, "Gemma 1 (2024) : génération remplacée par Gemma 3."),
    "google/gemma-7b": (False, "Gemma 1 (2024) : génération remplacée par Gemma 3."),
    "google/gemma-2-2b-it": (False, "Gemma 2 (2024) : génération remplacée par Gemma 3."),
    "google/gemma-3-270m": (True, "Gemma 3 (2025) : génération la plus récente de Google mesurée."),
    "google/gemma-3-1b-pt": (True, "Gemma 3 (2025), version de base « pt » : génération la plus récente mesurée."),
    "google/gemma-3-4b-pt": (True, "Gemma 3 (2025), version de base « pt » : génération la plus récente mesurée."),
    "google/gemma-3-27b-pt": (True, "Gemma 3 (2025), version de base « pt » : génération la plus récente mesurée."),
    "meta-llama/Llama-2-7b-hf": (False, "Llama 2 (2023) : génération ancienne."),
    "meta-llama/Llama-2-13b-hf": (False, "Llama 2 (2023) : génération ancienne."),
    "meta-llama/Llama-2-70b-hf": (False, "Llama 2 (2023) : génération ancienne."),
    "meta-llama/Meta-Llama-3-8B": (False, "Llama 3 (avril 2024) : remplacé par Llama 3.1 8B, mesuré lui aussi."),
    "meta-llama/Meta-Llama-3-70B": (False, "Llama 3 (avril 2024) : remplacé par les versions 3.1 et 3.3 de 70 G."),
    "meta-llama/Meta-Llama-3.1-8B": (True, "Llama 3.1 (juillet 2024) : génération de Meta la plus récente mesurée, encore très utilisée."),
    "facebook/opt-125m": (False, "OPT (2022) : génération ancienne."),
    "facebook/opt-2.7b": (False, "OPT (2022) : génération ancienne."),
    "mistralai/Mistral-7B-v0.1": (False, "Mistral 7B v0.1 (2023) : première version, remplacée depuis."),
    "mistralai/Mixtral-8x7B-v0.1": (False, "Mixtral 8x7B v0.1 (2023) : génération ancienne."),
    "mistralai/Ministral-8B-Instruct-2410": (True, "Ministral 8B (octobre 2024) : modèle Mistral le plus récent mesuré."),
    "mistralai/Mistral-Nemo-Instruct-2407": (True, "Mistral NeMo (juillet 2024) : modèle encore très diffusé."),
    "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B": (True, "Distillation de DeepSeek-R1 (janvier 2025) sur une base Qwen ; pas le modèle de l'application DeepSeek."),
    "deepseek-ai/DeepSeek-R1-Distill-Llama-70B": (True, "Distillation de DeepSeek-R1 (janvier 2025) sur une base Llama ; pas le modèle de l'application DeepSeek."),
    # --- raisonnement ---
    "openai/gpt-oss-120b": (True, "gpt-oss (août 2025) : modèles ouverts actuels d'OpenAI ; valeur = moyenne des 3 niveaux de raisonnement mesurés."),
    "openai/gpt-oss-20b": (True, "gpt-oss (août 2025) : modèles ouverts actuels d'OpenAI ; valeur = moyenne des 3 niveaux de raisonnement mesurés."),
}

NIVEAUX = {"low": "faible", "medium": "moyen", "high": "élevé"}

NOMS_LISIBLES = {
    "google/gemma-3-27b-pt": "Gemma 3 27B", "google/gemma-3-4b-pt": "Gemma 3 4B",
    "google/gemma-3-1b-pt": "Gemma 3 1B", "google/gemma-3-270m": "Gemma 3 270M",
    "microsoft/phi-4": "Phi-4", "microsoft/Phi-4-reasoning-plus": "Phi-4-reasoning-plus",
    "meta-llama/Meta-Llama-3.1-8B": "Llama 3.1 8B",
    "mistralai/Ministral-8B-Instruct-2410": "Ministral 8B", "mistralai/Mistral-Nemo-Instruct-2407": "Mistral NeMo 12B",
    "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B": "R1-Distill-Qwen-32B",
    "deepseek-ai/DeepSeek-R1-Distill-Llama-70B": "R1-Distill-Llama-70B",
    "openai/gpt-oss-120b": "gpt-oss-120b", "openai/gpt-oss-20b": "gpt-oss-20b",
}


def resume_noms(noms):
    """Texte court affiché sous le nom de l'entreprise (ex. « Gemma 3 : 27B, 4B, 1B, 270M »)."""
    if len(noms) > 2:
        prefixe = noms[0].rsplit(" ", 1)[0] + " "
        if all(n.startswith(prefixe) for n in noms):
            return prefixe.strip() + " : " + ", ".join(n[len(prefixe):] for n in noms)
    return ", ".join(noms)


def lire_aies(fichier, tache):
    """Lit un CSV AI Energy Score ; renvoie les lignes des 8 entreprises suivies."""
    lignes = []
    with open(ICI / "donnees-brutes" / fichier, newline="", encoding="utf-8") as f:
        for r in csv.DictReader(f):
            nom = r["model"].strip()
            ent = next((e for p, e in PREFIXES.items() if nom.startswith(p)), None)
            if ent is None:
                continue  # autre entreprise (Qwen, IBM, Hugging Face…) : hors périmètre
            niveau = None
            base = nom
            if " " in nom:  # « openai/gpt-oss-120b medium »
                base, niveau = nom.split(" ", 1)
            wh = float(r["total_gpu_energy"]) * 1000.0  # kWh pour 1 000 requêtes -> Wh
            lignes.append({
                "entreprise": ent, "modele": base, "niveau": niveau, "tache": tache,
                "wh_1000_req": wh, "kwh_csv": r["total_gpu_energy"],
                "classe": r["class"], "date_test": r["test date"],
            })
    return lignes


def agreger_aies(lignes, tache):
    """Une valeur par modèle (moyenne des niveaux s'il y en a), puis par entreprise."""
    par_modele = {}
    for l in lignes:
        if l["tache"] != tache:
            continue
        par_modele.setdefault((l["entreprise"], l["modele"]), []).append(l)
    modeles = []
    for (ent, mod), ls in par_modele.items():
        if mod not in SELECTION_AIES:
            raise SystemExit(f"Modèle sans décision de sélection : {mod}")
        retenu, justif = SELECTION_AIES[mod]
        valeur = statistics.fmean(l["wh_1000_req"] for l in ls)
        niveaux = [(NIVEAUX[l["niveau"]], l["wh_1000_req"]) for l in ls if l["niveau"]]
        niveaux.sort(key=lambda t: list(NIVEAUX.values()).index(t[0]))
        modeles.append({
            "entreprise": ent, "modele": mod, "valeur": valeur, "niveaux": niveaux,
            "classe": ls[0]["classe"], "date_test": ls[0]["date_test"],
            "retenu": retenu, "justification": justif, "lignes": ls,
        })
    return modeles


# ---------------------------------------------------------------------------
# 2. EcoLogits — formules et constantes (dépôt github.com/mlco2/ecologits, branche
#    main, EcoLogits 0.11.3 du 14/10/2026 ; fichiers ecologits/impacts/llm.py,
#    ecologits/tracers/utils.py, ecologits/data/models.json,
#    ecologits/data/electricity_mixes.json)
# ---------------------------------------------------------------------------
GPU_ENERGY_ALPHA = 1.1665273170451914e-06
GPU_ENERGY_BETA = -0.011205921025579175
GPU_ENERGY_GAMMA = 4.052928146734005e-05
LATENCY_ALPHA = 0.0006785088094353663
LATENCY_BETA = 0.0003119310311688259
LATENCY_GAMMA = 0.019473717579473387
BATCH_SIZE = 64
GPU_MEMORY_GB = 80              # NVIDIA H100 80 Go
MODEL_QUANTIZATION_BITS = 16
MEMORY_OVERHEAD = 1.2
SERVER_GPUS = 8                 # GPU installés par serveur (p5.48xlarge)
SERVER_POWER_KW = 1.2           # serveur hors GPU
GPU_EMBODIED = {"gwp": 273.0, "adpe": 0.00895, "pe": 3721.0}       # par GPU
SERVER_EMBODIED = {"gwp": 5700.0, "adpe": 0.37, "pe": 70000.0}     # par serveur hors GPU
HARDWARE_LIFESPAN_S = 3 * 365 * 24 * 3600                          # 3 ans

# Fournisseurs (PUE, WUE sur site en L/kWh, zone du mix électrique) — tracers/utils.py
FOURNISSEURS = {
    "openai": {"zone": "USA", "pue": (1.20, 1.20), "wue": (0.569, 0.569)},
    "anthropic": {"zone": "USA", "pue": (1.09, 1.14), "wue": (0.13, 0.999)},
    "google_genai": {"zone": "USA", "pue": (1.09, 1.09), "wue": (0.999, 0.999)},
    "mistralai": {"zone": "SWE", "pue": (1.16, 1.16), "wue": (0.09, 0.09)},
    "huggingface_hub": {"zone": "USA", "pue": (1.09, 1.14), "wue": (0.13, 0.99)},
}

# Mix électriques — data/electricity_mixes.json
# gwp kg CO2e/kWh ; adpe kg Sb éq./kWh ; pe MJ/kWh ; wue L/kWh (eau hors site, production d'électricité)
MIX = {
    "USA": {"adpe": 9.855e-08, "pe": 9.6884, "gwp": 0.3844, "wue": 3.1321},
    "SWE": {"adpe": 7.771e-08, "pe": 4.73, "gwp": 0.03526, "wue": 6.0315},
}

TOKENS_SORTIE = 1000  # unité fonctionnelle : une réponse de 1 000 tokens générés (≈ 750 mots)


def ecologits(p_actifs, p_total, n_tokens, tps, ttft, pue, wue_site, mix):
    """Une passe du calcul EcoLogits (valeurs ponctuelles). Renvoie kWh, kg, L, MJ."""
    e_gpu = n_tokens * (GPU_ENERGY_ALPHA * math.exp(GPU_ENERGY_BETA * BATCH_SIZE) * p_actifs
                        + GPU_ENERGY_GAMMA) / 1000.0                     # kWh, un GPU
    if tps:
        latence = n_tokens / tps + (ttft or 0.0)
    else:
        latence = n_tokens * (LATENCY_ALPHA * p_actifs + LATENCY_BETA * BATCH_SIZE + LATENCY_GAMMA)
    memoire = MEMORY_OVERHEAD * p_total * MODEL_QUANTIZATION_BITS / 8.0   # Go
    n = math.ceil(memoire / GPU_MEMORY_GB)
    gpus = 2 ** math.ceil(math.log2(n)) if n > 1 else 1
    e_serveur = (latence / 3600.0) * SERVER_POWER_KW * (gpus / SERVER_GPUS) / BATCH_SIZE
    e_it = e_serveur + gpus * e_gpu
    e = pue * e_it
    res = {"energie_kwh": e, "gpus": gpus, "latence_s": latence}
    for k in ("gwp", "adpe", "pe"):
        materiel = (gpus / SERVER_GPUS) * SERVER_EMBODIED[k] + gpus * GPU_EMBODIED[k]
        fabrication = latence * materiel / (HARDWARE_LIFESPAN_S * BATCH_SIZE)
        res[k + "_usage"] = e * mix[k]
        res[k + "_fabrication"] = fabrication
        res[k] = e * mix[k] + fabrication
    res["eau_l"] = e_it * (wue_site + pue * mix["wue"])  # eau : usage seulement (sur site + production d'électricité)
    return res


def ecologits_fourchette(modele, n_tokens=TOKENS_SORTIE, latence_mesuree=False):
    """Passe « min » et passe « max » (paramètres, PUE et WUE), comme EcoLogits.

    Par défaut, la latence est MODÉLISÉE pour tous les modèles (formule EcoLogits sans
    mesure de débit, celle qu'applique compar:IA) : sinon les modèles fermés, qui ont des
    débits mesurés dans la base EcoLogits, seraient traités autrement que les modèles
    ouverts qui n'en ont pas. latence_mesuree=True sert au test de sensibilité.
    """
    f = FOURNISSEURS[modele["fournisseur"]]
    mix = MIX[f["zone"]]
    pa, pt = modele["actifs"], modele["total"]
    tps = modele["tps"] if latence_mesuree else None
    ttft = modele["ttft"] if latence_mesuree else None
    bas = ecologits(pa[0], pt[0], n_tokens, tps, ttft, f["pue"][0], f["wue"][0], mix)
    haut = ecologits(pa[1], pt[1], n_tokens, tps, ttft, f["pue"][1], f["wue"][1], mix)
    out = {}
    for cle in ("energie_kwh", "gwp", "adpe", "pe", "eau_l"):
        lo, hi = bas[cle], haut[cle]
        out[cle] = {"min": lo, "max": hi, "centre": (lo + hi) / 2.0}
    out["gpus"] = (bas["gpus"], haut["gpus"])
    return out


def g(x):
    return (x, x)


# Modèles retenus pour les vues EcoLogits : modèles de langage les plus récents de chaque
# entreprise dont la taille est publiée (poids ouverts) ou estimée par la base EcoLogits
# (modèles fermés). Paramètres en milliards. tps/ttft = mesures de la base EcoLogits.
MODELES_ECOLOGITS = [
    # OpenAI — modèles fermés : estimations de la base EcoLogits
    {"entreprise": "openai", "id": "gpt-5.5", "nom": "GPT-5.5", "fournisseur": "openai",
     "archi": "MoE", "total": g(900), "actifs": (90, 300), "tps": 40.4, "ttft": 3.38,
     "taille": "estimée par EcoLogits", "date": "avril 2026"},
    {"entreprise": "openai", "id": "gpt-5.4-mini", "nom": "GPT-5.4 mini", "fournisseur": "openai",
     "archi": "dense", "total": (56, 158), "actifs": (56, 158), "tps": 73.0, "ttft": 0.67,
     "taille": "estimée par EcoLogits", "date": "mars 2026"},
    {"entreprise": "openai", "id": "gpt-5.4-nano", "nom": "GPT-5.4 nano", "fournisseur": "openai",
     "archi": "dense", "total": (15, 58), "actifs": (15, 58), "tps": 70.8, "ttft": 0.54,
     "taille": "estimée par EcoLogits", "date": "mars 2026"},
    # Anthropic — modèles fermés
    {"entreprise": "anthropic", "id": "claude-opus-4-8", "nom": "Claude Opus 4.8", "fournisseur": "anthropic",
     "archi": "MoE", "total": g(670), "actifs": (67, 200), "tps": 58.0, "ttft": 1.63,
     "taille": "estimée par EcoLogits", "date": "2026"},
    {"entreprise": "anthropic", "id": "claude-sonnet-4-6", "nom": "Claude Sonnet 4.6", "fournisseur": "anthropic",
     "archi": "MoE", "total": g(440), "actifs": (44, 132), "tps": 41.4, "ttft": 1.56,
     "taille": "estimée par EcoLogits", "date": "2026"},
    {"entreprise": "anthropic", "id": "claude-haiku-4-5-20251001", "nom": "Claude Haiku 4.5", "fournisseur": "anthropic",
     "archi": "dense", "total": (10, 35), "actifs": (10, 35), "tps": 71.1, "ttft": 0.67,
     "taille": "estimée par EcoLogits", "date": "octobre 2025"},
    # Google — modèles fermés
    {"entreprise": "google", "id": "gemini-3.5-flash", "nom": "Gemini 3.5 Flash", "fournisseur": "google_genai",
     "archi": "MoE", "total": g(900), "actifs": (90, 240), "tps": 130.6, "ttft": 2.72,
     "taille": "estimée par EcoLogits", "date": "2026"},
    {"entreprise": "google", "id": "gemini-3.1-pro-preview", "nom": "Gemini 3.1 Pro (préversion)", "fournisseur": "google_genai",
     "archi": "MoE", "total": g(1200), "actifs": (120, 360), "tps": 73.0, "ttft": 4.32,
     "taille": "estimée par EcoLogits", "date": "2026"},
    {"entreprise": "google", "id": "gemini-3.1-flash-lite", "nom": "Gemini 3.1 Flash-Lite", "fournisseur": "google_genai",
     "archi": "dense", "total": (30, 105), "actifs": (30, 105), "tps": 115.4, "ttft": 1.48,
     "taille": "estimée par EcoLogits", "date": "2026"},
    # Mistral AI — poids ouverts : tailles publiées par Mistral AI (docs.mistral.ai)
    {"entreprise": "mistral", "id": "mistral-medium-2604", "nom": "Mistral Medium 3.5", "fournisseur": "mistralai",
     "archi": "dense", "total": g(128), "actifs": g(128), "tps": 34.5, "ttft": 0.47,
     "taille": "publiée par Mistral AI", "date": "avril 2026"},
    {"entreprise": "mistral", "id": "mistral-large-2512", "nom": "Mistral Large 3", "fournisseur": "mistralai",
     "archi": "MoE", "total": g(675), "actifs": g(41), "tps": 41.5, "ttft": 0.68,
     "taille": "publiée par Mistral AI", "date": "décembre 2025",
     "remarque": "La base EcoLogits le décrit comme un modèle dense de 123 G ; Mistral AI publie un MoE de 675 G (41 G actifs), valeur utilisée ici."},
    {"entreprise": "mistral", "id": "mistral-small-2603", "nom": "Mistral Small 4", "fournisseur": "mistralai",
     "archi": "MoE", "total": g(119), "actifs": g(6.5), "tps": 116.9, "ttft": 0.46,
     "taille": "publiée par Mistral AI", "date": "mars 2026",
     "remarque": "La base EcoLogits indique 8 G actifs ; Mistral AI publie 6,5 G, valeur utilisée ici."},
    # Meta — poids ouverts (carte du modèle Llama 4) ; absents de la base EcoLogits -> latence modélisée
    {"entreprise": "meta", "id": "llama-4-maverick", "nom": "Llama 4 Maverick", "fournisseur": "huggingface_hub",
     "archi": "MoE", "total": g(400), "actifs": g(17), "tps": None, "ttft": None,
     "taille": "publiée par Meta", "date": "avril 2025"},
    {"entreprise": "meta", "id": "llama-4-scout", "nom": "Llama 4 Scout", "fournisseur": "huggingface_hub",
     "archi": "MoE", "total": g(109), "actifs": g(17), "tps": None, "ttft": None,
     "taille": "publiée par Meta", "date": "avril 2025"},
    # DeepSeek — poids ouverts (annonce DeepSeek V4, 24/04/2026)
    {"entreprise": "deepseek", "id": "deepseek-v4-pro", "nom": "DeepSeek-V4-Pro", "fournisseur": "huggingface_hub",
     "archi": "MoE", "total": g(1600), "actifs": g(49), "tps": None, "ttft": None,
     "taille": "publiée par DeepSeek", "date": "avril 2026"},
    {"entreprise": "deepseek", "id": "deepseek-v4-flash", "nom": "DeepSeek-V4-Flash", "fournisseur": "huggingface_hub",
     "archi": "MoE", "total": g(284), "actifs": g(13), "tps": None, "ttft": None,
     "taille": "publiée par DeepSeek", "date": "avril 2026"},
    # Microsoft — poids ouverts (Phi-4, 14 G, valeur utilisée par compar:IA)
    {"entreprise": "microsoft", "id": "phi-4", "nom": "Phi-4", "fournisseur": "huggingface_hub",
     "archi": "dense", "total": g(14), "actifs": g(14), "tps": None, "ttft": None,
     "taille": "publiée par Microsoft", "date": "décembre 2024"},
]

# Vérification : valeurs « énergie moyenne pour 1 000 tokens » publiées par compar:IA
# (classement du 16/06/2026, méthode EcoLogits). compar:IA applique une latence
# modélisée (sans mesures tps/ttft) et un PUE de 1,2 ; on refait ce calcul.
VERIF_COMPARIA = [
    ("gpt-oss-120b (OpenAI)", 117, 5.1, 342),
    ("gpt-oss-20b (OpenAI)", 21, 3.6, 83),
    ("Llama 3.1 8B (Meta)", 8, 8, 89),
    ("Llama 3.x 70B (Meta)", 70, 70, 658),
    ("Llama 3.1 405B (Meta)", 405, 405, 9134),
    ("Llama 4 Maverick (Meta)", 400, 17, 1601),
    ("Llama 4 Scout (Meta)", 109, 17, 400),
    ("DeepSeek-V3 671 G", 671, 37, 3979),
    ("DeepSeek-V4-Pro", 1600, 49, 8890),
    ("DeepSeek-V4-Flash", 284, 13, 1524),
    ("Mistral Large 3", 675, 41, 4134),
    ("Mistral Small 3.x 24 G", 24, 24, 109),
    ("Phi-4 (Microsoft)", 14, 14, 96),
    ("Gemma 3 27B (Google)", 27, 27, 112),
]


def verifier_comparia():
    rapport = []
    pire = 0.0
    for nom, pt, pa, publie in VERIF_COMPARIA:
        r = ecologits(pa, pt, 1000, None, None, 1.2, 0.0, MIX["USA"])
        calc = r["energie_kwh"] * 1e6  # mWh
        ecart = (calc - publie) / publie * 100
        pire = max(pire, abs(ecart))
        rapport.append(f"{nom:28s} compar:IA {publie:6d} mWh | calcul {calc:8.1f} mWh | écart {ecart:+5.2f} %")
    rapport.append(f"Écart maximal : {pire:.2f} %")
    return rapport, pire


# ---------------------------------------------------------------------------
# 3. Sources, publications des entreprises, matrice « Qui publie quoi ? »
# ---------------------------------------------------------------------------
SOURCES = {
    "aies": {
        "titre": "AI Energy Score Leaderboard – December 2025 (v2)",
        "editeur": "AI Energy Score (Hugging Face, Salesforce et partenaires) – S. Luccioni, B. Gamazaychikov",
        "url": "https://huggingface.co/spaces/AIEnergyScore/Leaderboard",
        "date": "décembre 2025 (données du Space, fichiers data/energy/*.csv)",
    },
    "ecologits": {
        "titre": "EcoLogits – méthode et base de données (version 0.11.3)",
        "editeur": "EcoLogits, projet de l'association CodeCarbon (initié par GenAI Impact)",
        "url": "https://ecologits.ai/latest/methodology/llm_inference/",
        "date": "14 octobre 2026 (version 0.11.3)",
    },
    "comparia": {
        "titre": "Compar:IA – jeux de données (conversations, votes, réactions) et classement",
        "editeur": "Ministère de la Culture",
        "url": "https://www.data.gouv.fr/datasets/compar-ia",
        "date": "données du 3 juin 2026 ; classement du 16 juin 2026",
    },
}

PUBLICATIONS = [
    {
        "entreprise": "google",
        "objet": "Application Gemini : requête texte médiane (mai 2025)",
        "electricite": "0,24 Wh", "carbone": "0,03 g CO₂e", "eau": "0,26 mL", "metaux": "Non publié",
        "perimetre": "Exploitation des serveurs (puces, processeurs et mémoire, machines en attente, refroidissement). "
                     "Carbone : électricité en « market-based » (0,023 g) et fabrication du matériel (0,010 g). "
                     "Eau : consommée sur place par les centres de données, sans l'eau de production de l'électricité. "
                     "Hors entraînement, réseau et appareils des utilisateurs. Non vérifié par un tiers.",
        "type": "déclaré",
        "source": "Google, « Measuring the environmental impact of AI inference », 21 août 2025 ; article arXiv 2508.15734",
        "url": "https://cloud.google.com/blog/products/infrastructure/measuring-the-environmental-impact-of-ai-inference",
    },
    {
        "entreprise": "openai",
        "objet": "ChatGPT : requête moyenne",
        "electricite": "0,34 Wh", "carbone": "Non publié", "eau": "0,32 mL (0,000085 gallon)", "metaux": "Non publié",
        "perimetre": "Chiffres donnés dans un billet de blog, sans méthode ni périmètre publiés.",
        "type": "déclaré",
        "source": "Sam Altman (PDG d'OpenAI), « The Gentle Singularity », 10 juin 2025",
        "url": "https://blog.samaltman.com/the-gentle-singularity",
    },
    {
        "entreprise": "mistral",
        "objet": "Le Chat (Mistral Large 2) : réponse de 400 tokens",
        "electricite": "Non publié", "carbone": "1,14 g CO₂e", "eau": "45 mL", "metaux": "0,16 mg Sb éq.",
        "perimetre": "Analyse de cycle de vie : impact marginal de l'inférence, fabrication des serveurs comprise, "
                     "hors appareils des utilisateurs (méthode AFNOR « IA frugale », avec Carbone 4 et l'ADEME, "
                     "revue par Resilio et Hubblo). Entraînement et 18 mois d'usage : 20,4 kt CO₂e, 281 000 m³ d'eau, 660 kg Sb éq.",
        "type": "déclaré",
        "source": "Mistral AI, « Our contribution to a global environmental standard for AI », 22 juillet 2025",
        "url": "https://mistral.ai/news/our-contribution-to-a-global-environmental-standard-for-ai",
    },
    {
        "entreprise": "microsoft",
        "objet": "« Requête typique » (environ 300 tokens générés) adressée à de grands modèles non nommés",
        "electricite": "0,16 à 0,60 Wh", "carbone": "Non publié", "eau": "0 à 0,067 mL", "metaux": "Non publié",
        "perimetre": "Estimation pour des modèles de plus de 200 G paramètres servis à grande échelle ; "
                     "eau de refroidissement. Ce n'est pas une mesure de Copilot.",
        "type": "déclaré",
        "source": "Microsoft, « Scaling AI with 8 to 20x energy efficiency », 15 juin 2026 ; Oviedo et al., Joule (2026)",
        "url": "https://www.microsoft.com/en-us/microsoft-cloud/blog/2026/06/15/scaling-ai-with-8-to-20x-energy-efficiency/",
    },
    {
        "entreprise": "meta",
        "objet": "Entraînement de Llama 4 Scout et Maverick (aucun chiffre par requête)",
        "electricite": "7,38 millions d'heures de GPU H100", "carbone": "1 999 t CO₂e (location-based) ; 0 t (market-based)",
        "eau": "Non publié", "metaux": "Non publié",
        "perimetre": "Entraînement seulement, d'après la carte du modèle.",
        "type": "déclaré",
        "source": "Meta, carte du modèle Llama 4 sur Hugging Face, 5 avril 2025",
        "url": "https://huggingface.co/meta-llama/Llama-4-Maverick-17B-128E-Instruct",
    },
    {
        "entreprise": "anthropic", "objet": "Claude", "electricite": "Non publié", "carbone": "Non publié",
        "eau": "Non publié", "metaux": "Non publié",
        "perimetre": "Aucun chiffre environnemental par requête ou par modèle trouvé (recherche du 25/11/2026).",
        "type": "rien", "source": "", "url": "",
    },
    {
        "entreprise": "perplexity", "objet": "Perplexity", "electricite": "Non publié", "carbone": "Non publié",
        "eau": "Non publié", "metaux": "Non publié",
        "perimetre": "Aucun chiffre environnemental trouvé (recherche du 25/11/2026).",
        "type": "rien", "source": "", "url": "",
    },
    {
        "entreprise": "deepseek", "objet": "DeepSeek", "electricite": "Non publié", "carbone": "Non publié",
        "eau": "Non publié", "metaux": "Non publié",
        "perimetre": "Aucun chiffre environnemental trouvé, y compris dans l'annonce de DeepSeek V4 (24/04/2026).",
        "type": "rien", "source": "", "url": "",
    },
]

# États : « publie » = publié par l'entreprise ; « tiers » = mesuré ou estimé par un tiers seulement ; « rien »
MATRICE = {
    "google": {
        "electricite": ("publie", "0,24 Wh par requête médiane de l'application Gemini (Google, août 2025)."),
        "eau": ("publie", "0,26 mL par requête médiane, eau consommée sur place (Google, août 2025)."),
        "carbone": ("publie", "0,03 g CO₂e par requête médiane (Google, août 2025)."),
        "metaux": ("tiers", "Estimation EcoLogits seulement."),
    },
    "anthropic": {
        "electricite": ("tiers", "Estimations EcoLogits et CLEER (Sustainable AI Group, septembre 2026)."),
        "eau": ("tiers", "Estimation EcoLogits seulement."),
        "carbone": ("tiers", "Estimations EcoLogits et CLEER."),
        "metaux": ("tiers", "Estimation EcoLogits seulement."),
    },
    "openai": {
        "electricite": ("publie", "0,34 Wh par requête moyenne, sans méthode publiée (Sam Altman, juin 2025)."),
        "eau": ("publie", "0,32 mL par requête moyenne, sans méthode publiée (Sam Altman, juin 2025)."),
        "carbone": ("tiers", "Estimations EcoLogits et CLEER."),
        "metaux": ("tiers", "Estimation EcoLogits seulement."),
    },
    "perplexity": {
        "electricite": ("rien", "Aucune donnée publiée ni estimée."),
        "eau": ("rien", "Aucune donnée publiée ni estimée."),
        "carbone": ("rien", "Aucune donnée publiée ni estimée."),
        "metaux": ("rien", "Aucune donnée publiée ni estimée."),
    },
    "microsoft": {
        "electricite": ("publie", "0,16 à 0,60 Wh pour une « requête typique » à de grands modèles non nommés, pas Copilot (Microsoft, juin 2026). Phi mesurés par AI Energy Score."),
        "eau": ("publie", "0 à 0,067 mL d'eau de refroidissement par « requête typique », modèles non nommés (Microsoft, juin 2026)."),
        "carbone": ("tiers", "Estimation EcoLogits pour le modèle ouvert Phi-4 seulement."),
        "metaux": ("tiers", "Estimation EcoLogits pour le modèle ouvert Phi-4 seulement."),
    },
    "mistral": {
        "electricite": ("tiers", "L'analyse de cycle de vie ne donne pas de Wh ; mesures AI Energy Score et estimation EcoLogits."),
        "eau": ("publie", "45 mL par réponse de 400 tokens (analyse de cycle de vie, juillet 2025)."),
        "carbone": ("publie", "1,14 g CO₂e par réponse de 400 tokens (analyse de cycle de vie, juillet 2025)."),
        "metaux": ("publie", "0,16 mg Sb éq. par réponse de 400 tokens (analyse de cycle de vie, juillet 2025)."),
    },
    "meta": {
        "electricite": ("tiers", "Mesures AI Energy Score (Llama 3.1) et estimation EcoLogits ; Meta publie seulement les heures de GPU d'entraînement."),
        "eau": ("tiers", "Estimation EcoLogits seulement."),
        "carbone": ("publie", "Entraînement seulement : 1 999 t CO₂e pour Llama 4 (carte du modèle, avril 2025)."),
        "metaux": ("tiers", "Estimation EcoLogits seulement."),
    },
    "deepseek": {
        "electricite": ("tiers", "Mesures AI Energy Score (distillations de R1) et estimation EcoLogits."),
        "eau": ("tiers", "Estimation EcoLogits seulement."),
        "carbone": ("tiers", "Estimation EcoLogits seulement."),
        "metaux": ("tiers", "Estimation EcoLogits seulement."),
    },
}
# Précisions affichées en note sous la matrice (astérisque dans la cellule)
MATRICE_PARTIEL = {
    ("openai", "electricite"), ("openai", "eau"),
    ("microsoft", "electricite"), ("microsoft", "eau"),
    ("meta", "carbone"),
}

# Notes par entreprise (info-bulles) — vues AI Energy Score
NOTE_AIES = {
    "openai": "Modèles ouverts gpt-oss. ChatGPT utilise des modèles fermés, non mesurés.",
    "google": "Modèles ouverts Gemma 3. Gemini utilise des modèles fermés, non mesurés.",
    "microsoft": "Modèles ouverts Phi-4. Copilot utilise des modèles fermés, non mesurés.",
    "meta": "Llama 3.1 est la génération de Meta la plus récente mesurée ; Llama 4 et Muse Spark ne le sont pas.",
    "mistral": "Modèles ouverts de 2024 ; les modèles Mistral 3 et suivants ne sont pas mesurés.",
    "deepseek": "Distillations de DeepSeek-R1 sur des bases Qwen et Llama ; le modèle de l'application DeepSeek n'est pas mesuré.",
}
NOTE_VUE_AIES = {
    "texte": ("Ce classement ne mesure que des modèles ouverts : ChatGPT, Gemini et Copilot fonctionnent avec des "
              "modèles fermés, non mesurés ; Anthropic et Perplexity n'y ont aucun modèle."),
    "raisonnement": ("Ce classement ne mesure que des modèles ouverts : ChatGPT, Gemini et Copilot fonctionnent avec des "
                     "modèles fermés, non mesurés ; Anthropic et Perplexity n'y ont aucun modèle. D'après AI Energy Score, "
                     "les modèles qui raisonnent consomment en moyenne 30 fois plus que les autres : ne pas comparer "
                     "cette vue à la génération de texte."),
}
NOTE_VUE_ECO = ("Estimations, pas des mesures : la taille des modèles fermés n'est pas publiée et la fourchette "
                "(trait fin) reflète cette incertitude. Ces valeurs ne se comparent pas aux chiffres déclarés par les "
                "entreprises, dont le périmètre est différent.")

VIDE_AIES = {
    "anthropic": ("aucune", "Aucune donnée publique", "Anthropic n'a aucun modèle dans le classement : ses modèles sont fermés et non soumis."),
    "perplexity": ("aucune", "Aucune donnée publique", "Perplexity n'a aucun modèle dans le classement."),
}
NOTE_ECO = {
    "openai": "Modèles fermés : taille estimée par EcoLogits (fourchette large).",
    "anthropic": "Modèles fermés : taille estimée par EcoLogits (fourchette large).",
    "google": "Modèles fermés : taille estimée par EcoLogits (fourchette large).",
    "mistral": "Poids ouverts : taille publiée par Mistral AI ; serveurs supposés en Suède (hypothèse EcoLogits).",
    "meta": "Llama 4 (avril 2025) : derniers modèles de Meta dont la taille est publiée. Meta AI fonctionne depuis avril 2026 avec Muse Spark, de taille non publiée.",
    "deepseek": "Poids ouverts : taille publiée par DeepSeek. Hébergement supposé aux États-Unis (hypothèse EcoLogits pour les modèles ouverts).",
    "microsoft": "Modèle ouvert Phi-4 seulement. Copilot utilise des modèles fermés dont la taille n'est pas publiée.",
}
VIDE_ECO = {
    "perplexity": ("aucune", "Aucune donnée publique", "Perplexity ne publie ni chiffres environnementaux ni taille de ses modèles ; EcoLogits ne le couvre pas."),
}


def fr(x, chiffres=3):
    """Nombre au format français (pour les CSV lisibles et les messages)."""
    if x == 0:
        return "0"
    d = max(0, chiffres - 1 - int(math.floor(math.log10(abs(x)))))
    s = f"{x:,.{d}f}".replace(",", " ").replace(".", ",")
    return s


def main():
    # ---------------- AI Energy Score ----------------
    brut = lire_aies("aienergyscore_text_generation_2025-12.csv", "texte") + \
        lire_aies("aienergyscore_reasoning_2025-12.csv", "raisonnement")
    vues = []
    lignes_modele_csv = []
    lignes_ent_csv = []

    taches = [
        ("electricite-texte", "texte", "Génération de texte"),
        ("electricite-raisonnement", "raisonnement", "Raisonnement"),
    ]
    for vue_id, tache, libelle in taches:
        modeles = agreger_aies(brut, tache)
        for m in modeles:
            detail_niv = " ; ".join(f"{n} {fr(v)} Wh" for n, v in m["niveaux"])
            lignes_modele_csv.append({
                "vue": vue_id, "entreprise": NOM[m["entreprise"]], "modele": m["modele"],
                "valeur": round(m["valeur"], 4), "valeur_min": "", "valeur_max": "",
                "unite": "Wh pour 1 000 requêtes (énergie GPU)", "type_valeur": "mesuré",
                "retenu": "oui" if m["retenu"] else "non", "justification": m["justification"],
                "details": (f"classe {m['classe']} ; test {m['date_test']}" + (f" ; niveaux : {detail_niv}" if detail_niv else "")),
                "source": "AI Energy Score, décembre 2025",
            })
        lignes = []
        for e in ENTREPRISES:
            eid = e["id"]
            retenus = [m for m in modeles if m["entreprise"] == eid and m["retenu"]]
            ecartes = [m for m in modeles if m["entreprise"] == eid and not m["retenu"]]
            if retenus:
                vals = [m["valeur"] for m in retenus]
                ligne = {
                    "entreprise": eid, "statut": "valeur",
                    "valeur": statistics.fmean(vals), "mediane": statistics.median(vals), "n": len(vals),
                    "modeles": [{
                        "nom": NOMS_LISIBLES.get(m["modele"], m["modele"]), "id": m["modele"], "valeur": m["valeur"],
                        "detail": (" ; ".join(f"{n} {fr(v)}" for n, v in m["niveaux"]) + " Wh") if m["niveaux"]
                        else f"classe {m['classe']}",
                    } for m in sorted(retenus, key=lambda m: -m["valeur"])],
                    "ecartes": len(ecartes),
                    "resume": resume_noms([NOMS_LISIBLES.get(m["modele"], m["modele"])
                                           for m in sorted(retenus, key=lambda m: -m["valeur"])]),
                    "note": NOTE_AIES.get(eid, ""),
                }
            else:
                if eid in VIDE_AIES:
                    statut, texte, raison = VIDE_AIES[eid]
                elif ecartes:
                    statut, texte = "non-mesure", "Aucun modèle actuel mesuré"
                    raison = (f"{len(ecartes)} ancien(s) modèle(s) mesuré(s), écarté(s) : "
                              + ", ".join(m["modele"].split("/", 1)[1] for m in ecartes) + ".")
                    if eid == "openai":
                        raison += " Les modèles actuels gpt-oss ne sont mesurés qu'en raisonnement."
                else:
                    statut, texte = "non-mesure", "Aucun modèle mesuré pour cette tâche"
                    raison = "Aucun modèle de cette entreprise n'a été testé sur cette tâche."
                ligne = {"entreprise": eid, "statut": statut, "texte": texte, "raison": raison}
            lignes.append(ligne)
            lignes_ent_csv.append(csv_ent(vue_id, e, ligne, "Wh pour 1 000 requêtes (énergie GPU)", "mesuré",
                                          "AI Energy Score, décembre 2025"))
        vues.append({
            "id": vue_id, "indicateur": "electricite", "libelle": libelle,
            "grandeur": f"Électricité consommée par les GPU, tâche « {libelle.lower()} »",
            "unite": "Wh", "uniteCourte": "Wh", "uniteLongue": "Wh pour 1 000 requêtes",
            "type": "mesuré", "facteur": 1,
            "note": NOTE_VUE_AIES[tache],
            "source": "AI Energy Score (Hugging Face), classement de décembre 2025",
            "sourceUrl": SOURCES["aies"]["url"],
            "methode": ("Énergie des GPU (NVIDIA H100) mesurée sur 1 000 requêtes. Moyenne des modèles retenus de chaque "
                        "entreprise (modèles ouverts seulement) ; les anciennes générations sont écartées."),
            "lignes": lignes,
        })

    # ---------------- EcoLogits ----------------
    resultats = []
    for m in MODELES_ECOLOGITS:
        r = ecologits_fourchette(m)
        resultats.append((m, r))
        for cle, unite_csv, fac in (("energie_kwh", "Wh pour 1 000 tokens générés", 1e3),
                                    ("gwp", "g CO2e pour 1 000 tokens générés", 1e3),
                                    ("eau_l", "mL pour 1 000 tokens générés", 1e3),
                                    ("adpe", "µg Sb éq. pour 1 000 tokens générés", 1e9),
                                    ("pe", "kJ d'énergie primaire pour 1 000 tokens générés", 1e3)):
            lignes_modele_csv.append({
                "vue": {"energie_kwh": "electricite-ecologits", "gwp": "carbone", "eau_l": "eau",
                        "adpe": "metaux", "pe": "energie-primaire"}[cle],
                "entreprise": NOM[m["entreprise"]], "modele": m["nom"],
                "valeur": sig(r[cle]["centre"] * fac), "valeur_min": sig(r[cle]["min"] * fac),
                "valeur_max": sig(r[cle]["max"] * fac),
                "unite": unite_csv, "type_valeur": "estimé", "retenu": "oui",
                "justification": f"Modèle actuel {de(NOM[m['entreprise']])} ({m['date']}) ; taille {m['taille']}.",
                "details": (f"{m['archi']} ; {fmt_params(m)} ; "
                            + (f"{r['gpus'][0]} GPU H100 ; " if r['gpus'][0] == r['gpus'][1]
                               else f"{r['gpus'][0]} à {r['gpus'][1]} GPU H100 ; ")
                            + f"fournisseur EcoLogits « {m['fournisseur']} »" + (f" ; {m['remarque']}" if m.get("remarque") else "")),
                "source": "Méthode EcoLogits 0.11.3, calcul du groupe (calcul_agregats.py)",
            })

    defs_eco = [
        ("electricite-ecologits", "electricite", "Estimation EcoLogits", "energie_kwh", 1e3, "Wh", "Wh pour 1 000 tokens générés",
         "Électricité estimée pour une réponse de 1 000 tokens, modèles fermés compris", "Wh"),
        ("eau", "eau", "Eau", "eau_l", 1e3, "mL", "mL pour 1 000 tokens générés",
         "Eau consommée pour une réponse de 1 000 tokens (centre de données et production de l'électricité)", "mL"),
        ("carbone", "carbone", "Empreinte carbone", "gwp", 1e3, "g CO₂e", "g CO₂e pour 1 000 tokens générés",
         "Gaz à effet de serre pour une réponse de 1 000 tokens (électricité et fabrication du matériel)", "g"),
        ("metaux", "metaux", "Métaux et minéraux", "adpe", 1e9, "µg Sb éq.", "µg Sb éq. pour 1 000 tokens générés",
         "Épuisement des ressources minérales et métalliques pour une réponse de 1 000 tokens", "µg"),
    ]
    methode_eco = ("Estimation par la méthode EcoLogits 0.11.3 (analyse de cycle de vie simplifiée : usage et fabrication "
                   "des serveurs et GPU, hors entraînement et réseau), recalculée par le groupe avec les formules et données "
                   "publiées. Valeur centrale de la fourchette, moyenne des modèles retenus de chaque entreprise.")
    for vue_id, indic, libelle, cle, fac, unite, unite_longue, grandeur, unite_courte in defs_eco:
        lignes = []
        for e in ENTREPRISES:
            eid = e["id"]
            mods = [(m, r) for m, r in resultats if m["entreprise"] == eid]
            if mods:
                centres = [r[cle]["centre"] * fac for _, r in mods]
                ligne = {
                    "entreprise": eid, "statut": "valeur",
                    "valeur": statistics.fmean(centres), "mediane": statistics.median(centres), "n": len(centres),
                    "min": statistics.fmean(r[cle]["min"] * fac for _, r in mods),
                    "max": statistics.fmean(r[cle]["max"] * fac for _, r in mods),
                    "modeles": [{
                        "nom": m["nom"], "valeur": r[cle]["centre"] * fac,
                        "min": r[cle]["min"] * fac, "max": r[cle]["max"] * fac,
                        "detail": f"taille {m['taille']}",
                    } for m, r in sorted(mods, key=lambda t: -t[1][cle]["centre"])],
                    "resume": resume_noms([m["nom"] for m, r in sorted(mods, key=lambda t: -t[1][cle]["centre"])]),
                    "note": NOTE_ECO.get(eid, ""),
                }
            else:
                statut, texte, raison = VIDE_ECO[eid]
                ligne = {"entreprise": eid, "statut": statut, "texte": texte, "raison": raison}
            lignes.append(ligne)
            lignes_ent_csv.append(csv_ent(vue_id, e, ligne, unite_longue, "estimé", "Méthode EcoLogits 0.11.3, calcul du groupe"))
        note_metaux = ("Indicateur d'analyse de cycle de vie : épuisement des ressources abiotiques (ADPe), en antimoine "
                       "équivalent. Il ne mesure pas la toxicité des « métaux lourds ».") if indic == "metaux" else ""
        note_eau = ("Inclut l'eau évaporée pour produire l'électricité : à ne pas comparer aux chiffres d'eau "
                    "sur site publiés par Google ou Microsoft.") if indic == "eau" else ""
        vues.append({
            "id": vue_id, "indicateur": indic, "libelle": libelle, "grandeur": grandeur,
            "unite": unite, "uniteCourte": unite_courte, "uniteLongue": unite_longue, "type": "estimé", "facteur": 1,
            "source": "Méthode EcoLogits 0.11.3 (CodeCarbon), calcul du groupe ; tailles : base EcoLogits ou entreprises",
            "sourceUrl": SOURCES["ecologits"]["url"],
            "methode": methode_eco, "note": " ".join(t for t in (NOTE_VUE_ECO, note_metaux, note_eau) if t),
            "lignes": lignes,
        })

    # ---------------- Vérification compar:IA ----------------
    rapport, pire = verifier_comparia()
    if pire > 1.0:
        print("\n".join(rapport))
        raise SystemExit("Le calcul EcoLogits ne reproduit pas compar:IA à 1 % près : à corriger.")

    # ---------------- Sorties ----------------
    ecrire_csv(ICI / "energie-par-modele.csv", lignes_modele_csv,
               ["vue", "entreprise", "modele", "valeur", "valeur_min", "valeur_max", "unite", "type_valeur",
                "retenu", "justification", "details", "source"])
    ecrire_csv(ICI / "energie-par-entreprise.csv", lignes_ent_csv,
               ["vue", "entreprise", "assistant", "statut", "moyenne", "mediane", "nombre_de_modeles",
                "fourchette_min", "fourchette_max", "unite", "type_valeur", "modeles", "source", "remarque"])

    indicateurs = [
        {"id": "electricite", "libelle": "Électricité",
         "vues": ["electricite-texte", "electricite-raisonnement", "electricite-ecologits"]},
        {"id": "eau", "libelle": "Eau", "vues": ["eau"]},
        {"id": "carbone", "libelle": "Empreinte carbone", "vues": ["carbone"]},
        {"id": "metaux", "libelle": "Métaux et minéraux", "vues": ["metaux"]},
    ]
    data = {
        "version": DATE_CONSULTATION,
        "entreprises": ENTREPRISES,
        "indicateurs": indicateurs,
        "vues": vues,
        "publications": PUBLICATIONS,
        "matrice": {
            "colonnes": [{"id": "electricite", "libelle": "Électricité"}, {"id": "eau", "libelle": "Eau"},
                         {"id": "carbone", "libelle": "Empreinte carbone"}, {"id": "metaux", "libelle": "Métaux et minéraux"}],
            "etats": {"publie": "Publié par l'entreprise", "tiers": "Mesuré ou estimé par un tiers", "rien": "Rien"},
            "lignes": [{"entreprise": e["id"], "cellules": {
                c: {"etat": MATRICE[e["id"]][c][0], "detail": MATRICE[e["id"]][c][1],
                    "partiel": (e["id"], c) in MATRICE_PARTIEL}
                for c in ("electricite", "eau", "carbone", "metaux")}} for e in ENTREPRISES],
            "notePartiel": ("* Publication partielle : chiffre sans méthode (OpenAI), estimation générique pour des modèles "
                            "non nommés (Microsoft) ou entraînement seulement (Meta)."),
            "source": ("Publications des entreprises (voir le tableau « Ce que publient les entreprises ») ; tiers : "
                       "AI Energy Score (décembre 2025), EcoLogits 0.11.3, CLEER (Sustainable AI Group, septembre 2026). "
                       "Recherche arrêtée au 25/11/2026."),
        },
        "sources": SOURCES,
    }
    data = typo_fr(data)
    js = ("/* data-energie.js — généré par calcul_agregats.py le " + DATE_CONSULTATION + ". Ne pas modifier à la main :\n"
          "   changer le script puis relancer « python3 -I calcul_agregats.py ». Sources : sources.md */\n"
          "window.DATA_ENERGIE_IA = " + json.dumps(data, ensure_ascii=False, indent=1) + ";\n")
    (ICI / "data-energie.js").write_text(js, encoding="utf-8")

    # Résumé à l'écran
    print("Vérification EcoLogits contre compar:IA (énergie pour 1 000 tokens) :")
    print("\n".join(rapport))
    print()
    print("Détail EcoLogits par modèle (1 000 tokens ; valeur centrale [min – max]) :")
    for m, r in resultats:
        print(f"   {NOM[m['entreprise']]:10s} {m['nom']:28s} GPU {r['gpus'][0]:>2}–{r['gpus'][1]:<2} "
              f"élec {fr(r['energie_kwh']['centre']*1e3):>6s} Wh  CO2 {fr(r['gwp']['centre']*1e3):>6s} g  "
              f"eau {fr(r['eau_l']['centre']*1e3):>6s} mL  Sb {fr(r['adpe']['centre']*1e9):>6s} µg")
    print()
    print("Sensibilité : latence mesurée (débits de la base EcoLogits) au lieu de la latence modélisée :")
    for m, _ in resultats:
        if not m["tps"]:
            continue
        a = ecologits_fourchette(m)
        b = ecologits_fourchette(m, latence_mesuree=True)
        def d(cle):
            return (b[cle]["centre"] - a[cle]["centre"]) / a[cle]["centre"] * 100
        print(f"   {m['nom']:28s} élec {d('energie_kwh'):+6.1f} %  CO2 {d('gwp'):+6.1f} %  "
              f"eau {d('eau_l'):+6.1f} %  Sb {d('adpe'):+6.1f} %")
    print()
    for v in vues:
        print(f"== {v['id']} ({v['uniteLongue']}, {v['type']})")
        for l in v["lignes"]:
            if l["statut"] == "valeur":
                extra = f" [fourchette {fr(l['min'])} – {fr(l['max'])}]" if "min" in l else ""
                print(f"   {NOM[l['entreprise']]:11s} moyenne {fr(l['valeur']):>9s}  médiane {fr(l['mediane']):>9s}  n={l['n']}{extra}")
            else:
                print(f"   {NOM[l['entreprise']]:11s} {l['texte']}")
    return 0


CLES_SANS_TYPO = {"id", "url", "sourceUrl", "couleur", "entreprise", "statut", "etat", "type",
                  "indicateur", "version"}   # les identifiants n'ont pas d'espace : la fonction ne les change pas


def typo_fr(obj, cle=None):
    """Espaces insécables dans les textes affichés : « 1 000 », « 0,24 Wh », « Opus 4.8 », « mot : »."""
    if isinstance(obj, dict):
        return {k: (v if k in CLES_SANS_TYPO else typo_fr(v, k)) for k, v in obj.items()}
    if isinstance(obj, list):
        return [typo_fr(v, cle) for v in obj]
    if not isinstance(obj, str):
        return obj
    t = re.sub(r"(?<=\d) (?=\d{3}(?!\d))", "\u202f", obj)                       # 1 000
    t = re.sub(r"(?<=\d) (?=(?:Wh|mL|g|µg|mg|kg|kt|t|m³|G|millions)\b)", "\u00a0", t)  # 0,24 Wh
    t = re.sub(r"(?<=[A-Za-zÀ-ÿ]) (?=\d)", "\u00a0", t)                          # Opus 4.8, de 1 000
    for a, b in ((" :", "\u00a0:"), (" ;", "\u00a0;"), (" ?", "\u00a0?"), ("« ", "«\u00a0"), (" »", "\u00a0»")):
        t = t.replace(a, b)
    return t


def sig(x, chiffres=6):
    if x == 0:
        return 0
    return round(x, max(0, chiffres - 1 - int(math.floor(math.log10(abs(x))))))


def de(nom):
    return ("d'" if nom[0] in "AEIOUaeiou" else "de ") + nom


def fmt_params(m):
    t, a = m["total"], m["actifs"]
    def n(x):
        return str(int(x)) if float(x).is_integer() else str(x).replace(".", ",")

    def p(v):
        return n(v[0]) if v[0] == v[1] else f"{n(v[0])} à {n(v[1])}"
    if m["archi"] == "MoE":
        return f"{p(t)} G paramètres, {p(a)} G actifs"
    return f"{p(t)} G paramètres"


def csv_ent(vue_id, e, ligne, unite, type_valeur, source):
    if ligne["statut"] == "valeur":
        return {
            "vue": vue_id, "entreprise": e["nom"], "assistant": e["assistant"], "statut": "valeur",
            "moyenne": sig(ligne["valeur"]), "mediane": sig(ligne["mediane"]), "nombre_de_modeles": ligne["n"],
            "fourchette_min": sig(ligne["min"]) if "min" in ligne else "",
            "fourchette_max": sig(ligne["max"]) if "max" in ligne else "",
            "unite": unite, "type_valeur": type_valeur,
            "modeles": " | ".join(m["nom"] for m in ligne["modeles"]), "source": source,
            "remarque": ligne.get("note", ""),
        }
    return {
        "vue": vue_id, "entreprise": e["nom"], "assistant": e["assistant"], "statut": ligne["texte"],
        "moyenne": "", "mediane": "", "nombre_de_modeles": 0, "fourchette_min": "", "fourchette_max": "",
        "unite": unite, "type_valeur": "", "modeles": "", "source": source, "remarque": ligne["raison"],
    }


def ecrire_csv(chemin, lignes, colonnes):
    with open(chemin, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=colonnes)
        w.writeheader()
        for l in lignes:
            w.writerow(l)


if __name__ == "__main__":
    sys.exit(main())
