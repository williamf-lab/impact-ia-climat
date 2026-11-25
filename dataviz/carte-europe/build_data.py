#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build_data.py : convertit l'Excel du groupe (usage des IA par pays, StatCounter)
en deux fichiers pour la carte de l'Europe :

  - data-usage.js                    window.DATA_USAGE_IA = {...}
                                     (chargé par la page avec une balise <script>,
                                     marche aussi en ouvrant le site en local)
  - usage-ia-pays-octobre-2026.csv   le même contenu en CSV (UTF-8, séparateur
                                     virgule, décimales avec un point) pour le
                                     groupe et pour data.gouv.fr

Usage (depuis n'importe quel dossier) :
    python3 dataviz/carte-europe/build_data.py
    python3 dataviz/carte-europe/build_data.py chemin/vers/un-autre-fichier.xlsx

Le fichier Excel original n'est jamais modifié. Le script s'arrête avec un
message clair si une cellule est vide ou illisible, si un pays est inconnu ou
si la somme d'un pays dépasse 100 %.

Pour un nouveau mois : remplacer l'Excel (mêmes colonnes), changer PERIODE,
PERIODE_ISO et CSV_NOM ci-dessous, vérifier CORRECTIONS, relancer le script.
"""

import csv
import datetime
import json
import sys
import unicodedata
from decimal import Decimal, InvalidOperation, ROUND_HALF_UP
from pathlib import Path

try:
    import openpyxl
except ImportError:  # pragma: no cover
    sys.exit("Il faut la bibliothèque openpyxl : python3 -m pip install openpyxl")

ICI = Path(__file__).resolve().parent
RACINE = ICI.parent.parent
EXCEL_PAR_DEFAUT = RACINE / "data" / "TREC_1_donnee_IA_pays.xlsx"
FEUILLE = "Feuil1"

PERIODE = "octobre 2026"
PERIODE_ISO = "2026-10"
CSV_NOM = "usage-ia-pays-octobre-2026.csv"
SOURCE = "StatCounter Global Stats, octobre 2026"
SOURCE_URL = "https://gs.statcounter.com/ai-chatbot-market-share/"
MESURE = ("Part des visites envoyées vers des sites web par chaque IA "
          "conversationnelle (clics de référence), en %")

# Les 5 IA du fichier, dans l'ordre validé des couleurs (barres de répartition) :
# Gemini, Claude, ChatGPT, Perplexity, Copilot. Couleurs : css/tokens.css.
IAS = [
    {"id": "gemini", "label": "Gemini", "entreprise": "Google", "cssVar": "--ia-gemini"},
    {"id": "claude", "label": "Claude", "entreprise": "Anthropic", "cssVar": "--ia-claude"},
    {"id": "chatgpt", "label": "ChatGPT", "entreprise": "OpenAI", "cssVar": "--ia-chatgpt"},
    {"id": "perplexity", "label": "Perplexity", "entreprise": "Perplexity AI", "cssVar": "--ia-perplexity"},
    {"id": "copilot", "label": "Copilot", "entreprise": "Microsoft", "cssVar": "--ia-copilot"},
]
AUTRE = {
    "id": "autre",
    "label": "Autre IA",
    "cssVar": "--autre",
    "definition": "100 % moins la somme des cinq IA du fichier (arrondi à 0,01 ; jamais négatif)",
}
# Ordre des colonnes du CSV : celui de l'Excel (alphabétique).
ORDRE_CSV = ["chatgpt", "claude", "copilot", "gemini", "perplexity"]

# Pays de l'Excel -> nom affiché (accents corrects), ISO 3166-1 alpha-2, alpha-3, numérique.
# Clé = nom de l'Excel sans accents, en minuscules (voir cle()).
# Le code numérique est celui du fond de carte world-atlas (Natural Earth).
PAYS = {
    "albanie": ("Albanie", "AL", "ALB", 8),
    "allemagne": ("Allemagne", "DE", "DEU", 276),
    "andorre": ("Andorre", "AD", "AND", 20),
    "autriche": ("Autriche", "AT", "AUT", 40),
    "belgique": ("Belgique", "BE", "BEL", 56),
    "bielorussie": ("Biélorussie", "BY", "BLR", 112),
    "bosnie-herzegovine": ("Bosnie-Herzégovine", "BA", "BIH", 70),
    "bulgarie": ("Bulgarie", "BG", "BGR", 100),
    "croatie": ("Croatie", "HR", "HRV", 191),
    "danemark": ("Danemark", "DK", "DNK", 208),
    "espagne": ("Espagne", "ES", "ESP", 724),
    "estonie": ("Estonie", "EE", "EST", 233),
    "finlande": ("Finlande", "FI", "FIN", 246),
    "france": ("France", "FR", "FRA", 250),
    "grece": ("Grèce", "GR", "GRC", 300),
    "hongrie": ("Hongrie", "HU", "HUN", 348),
    "irlande": ("Irlande", "IE", "IRL", 372),
    "islande": ("Islande", "IS", "ISL", 352),
    "italie": ("Italie", "IT", "ITA", 380),
    "lettonie": ("Lettonie", "LV", "LVA", 428),
    "liechtenstein": ("Liechtenstein", "LI", "LIE", 438),
    "lituanie": ("Lituanie", "LT", "LTU", 440),
    "luxembourg": ("Luxembourg", "LU", "LUX", 442),
    "macedoine du nord": ("Macédoine du Nord", "MK", "MKD", 807),
    "malte": ("Malte", "MT", "MLT", 470),
    "moldavie": ("Moldavie", "MD", "MDA", 498),
    "monaco": ("Monaco", "MC", "MCO", 492),
    "montenegro": ("Monténégro", "ME", "MNE", 499),
    "norvege": ("Norvège", "NO", "NOR", 578),
    "pays-bas": ("Pays-Bas", "NL", "NLD", 528),
    "pologne": ("Pologne", "PL", "POL", 616),
    "portugal": ("Portugal", "PT", "PRT", 620),
    "republique tcheque": ("Tchéquie", "CZ", "CZE", 203),
    "tchequie": ("Tchéquie", "CZ", "CZE", 203),
    "roumanie": ("Roumanie", "RO", "ROU", 642),
    "royaume-uni": ("Royaume-Uni", "GB", "GBR", 826),
    "saint-marin": ("Saint-Marin", "SM", "SMR", 674),
    "serbie": ("Serbie", "RS", "SRB", 688),
    "slovaquie": ("Slovaquie", "SK", "SVK", 703),
    "slovenie": ("Slovénie", "SI", "SVN", 705),
    "suede": ("Suède", "SE", "SWE", 752),
    "suisse": ("Suisse", "CH", "CHE", 756),
    "ukraine": ("Ukraine", "UA", "UKR", 804),
    "armenie": ("Arménie", "AM", "ARM", 51),
    "azerbaidjan": ("Azerbaïdjan", "AZ", "AZE", 31),
    "chypre": ("Chypre", "CY", "CYP", 196),
    "georgie": ("Géorgie", "GE", "GEO", 268),
    "kazakhstan": ("Kazakhstan", "KZ", "KAZ", 398),
    "russie": ("Russie", "RU", "RUS", 643),
    "turquie": ("Turquie", "TR", "TUR", 792),
}

# Micro-États dont la répartition repose sur très peu de visites mesurées :
# affichés, avec une mention dans l'info-bulle et le tableau.
ATYPIQUES = {"MCO", "SMR", "LIE", "AND"}

# ---------------------------------------------------------------------------
# CORRECTIONS appliquées aux données de la carte (l'Excel n'est pas modifié).
#
# Belgique, ChatGPT : l'Excel contient 49.9, ce qui donne une somme de 102,99 %.
# Le relevé StatCounter Global Stats d'octobre 2026 pour la Belgique donne 46,9 %
# (relevé du 25/11/2026). On retient 46,9.
# La correction n'est appliquée que si l'Excel contient toujours 49.9 : si le
# groupe corrige l'Excel, le script le signale et ne touche plus à la valeur.
# ---------------------------------------------------------------------------
CORRECTIONS = [
    {
        "iso3": "BEL",
        "ia": "chatgpt",
        "valeurFichier": Decimal("49.9"),
        "valeurRetenue": Decimal("46.9"),
        "source": "relevé StatCounter Global Stats d'octobre 2026 (vérifié le 25/11/2026)",
        "raison": "Avec 49,9\u202f% la somme des cinq IA atteignait 102,99\u202f%.",
    },
]

CENTIEME = Decimal("0.01")
CENT = Decimal("100")
TOLERANCE_SOMME = Decimal("0.05")  # écart toléré, dû aux arrondis de la source


def cle(texte):
    """Nom sans accents, en minuscules, espaces normalisés (pour comparer)."""
    t = unicodedata.normalize("NFD", str(texte))
    t = "".join(c for c in t if unicodedata.category(c) != "Mn")
    return " ".join(t.lower().replace(" ", " ").split())


def lire_nombre(valeur, ou):
    """Convertit une cellule (nombre ou texte « 43.33 », « 43,33 », « 43,33 % ») en Decimal."""
    if valeur is None or (isinstance(valeur, str) and not valeur.strip()):
        raise SystemExit(
            f"Cellule vide : {ou}. Complétez l'Excel (mettez 0 si StatCounter indique 0)."
        )
    if isinstance(valeur, bool):
        raise SystemExit(f"Valeur inattendue (vrai/faux) : {ou}.")
    if isinstance(valeur, (int, float)):
        d = Decimal(str(valeur))
    else:
        texte = (str(valeur).strip().replace(" ", "").replace(" ", "")
                 .replace(" ", "").replace("%", "").replace(",", ".").strip("'"))
        try:
            d = Decimal(texte)
        except InvalidOperation:
            raise SystemExit(f"Nombre illisible : {ou} contient {valeur!r}.")
    if d < 0 or d > CENT:
        raise SystemExit(f"Valeur hors de 0-100 : {ou} = {valeur!r}.")
    return d.quantize(CENTIEME, rounding=ROUND_HALF_UP)


def nombre_json(d):
    """Decimal -> int ou float propre pour le JSON (43.33, 0.01, 80)."""
    d = d.quantize(CENTIEME, rounding=ROUND_HALF_UP).normalize()
    if d == d.to_integral_value():
        return int(d)
    return float(d)


def fr(d):
    """Decimal -> texte français pour les messages (43,33)."""
    return f"{d:.2f}".replace(".", ",")


def fr_court(d):
    """Decimal -> texte français sans zéros inutiles (49,9 ; 80)."""
    return str(nombre_json(d)).replace(".", ",")


def lire_excel(chemin):
    wb = openpyxl.load_workbook(chemin, data_only=True, read_only=True)
    if FEUILLE in wb.sheetnames:
        ws = wb[FEUILLE]
    else:
        ws = wb.worksheets[0]
        print(f"Attention : feuille « {FEUILLE} » absente, lecture de « {ws.title} ».")
    lignes = list(ws.iter_rows(values_only=True))
    if not lignes:
        raise SystemExit("La feuille est vide.")

    # Ligne d'en-tête : repère les colonnes des 5 IA par leur nom (ordre libre).
    entete = lignes[0]
    colonnes = {}
    for j, titre in enumerate(entete):
        if titre is None:
            continue
        k = cle(titre)
        for ia in IAS:
            if k == ia["id"]:
                colonnes[ia["id"]] = j
    manquantes = [ia["label"] for ia in IAS if ia["id"] not in colonnes]
    if manquantes:
        raise SystemExit("Colonnes introuvables dans la ligne 1 : " + ", ".join(manquantes))

    pays = []
    for i, ligne in enumerate(lignes[1:], start=2):
        nom_source = ligne[0] if ligne else None
        if nom_source is None or not str(nom_source).strip():
            continue
        nom_source = str(nom_source).strip()
        k = cle(nom_source)
        if k not in PAYS:
            raise SystemExit(
                f"Pays inconnu ligne {i} : « {nom_source} ». "
                "Ajoutez-le au tableau PAYS de build_data.py (nom, codes ISO)."
            )
        valeurs = {}
        for ia in IAS:
            j = colonnes[ia["id"]]
            lettre = openpyxl.utils.get_column_letter(j + 1)
            ou = f"{ws.title}!{lettre}{i} ({nom_source}, {ia['label']})"
            valeurs[ia["id"]] = lire_nombre(ligne[j] if j < len(ligne) else None, ou)
        pays.append((i, nom_source, valeurs))
    return pays


def construire(chemin_excel):
    lignes = lire_excel(chemin_excel)
    vus = set()
    pays = []
    corrections_appliquees = []
    alertes = []

    for i, nom_source, valeurs in lignes:
        nom, iso2, iso3, num = PAYS[cle(nom_source)]
        if iso3 in vus:
            raise SystemExit(f"Pays en double ligne {i} : {nom}.")
        vus.add(iso3)

        note = None
        for c in CORRECTIONS:
            if c["iso3"] != iso3:
                continue
            actuel = valeurs[c["ia"]]
            if actuel == c["valeurFichier"]:
                valeurs[c["ia"]] = c["valeurRetenue"]
                label = next(x["label"] for x in IAS if x["id"] == c["ia"])
                note = (f"{label}\u00a0: {fr_court(c['valeurFichier'])}\u202f% dans le fichier du groupe, "
                        f"corrigé en {fr_court(c['valeurRetenue'])}\u202f% d'après le {c['source']}.")
                corrections_appliquees.append({
                    "pays": nom,
                    "iso3": iso3,
                    "ia": c["ia"],
                    "valeurFichier": nombre_json(c["valeurFichier"]),
                    "valeurRetenue": nombre_json(c["valeurRetenue"]),
                    "source": c["source"],
                    "raison": c["raison"],
                })
            else:
                alertes.append(
                    f"Correction {nom} / {c['ia']} non appliquée : l'Excel contient "
                    f"{fr(actuel)} et non {fr(c['valeurFichier'])} (fichier déjà corrigé ?)."
                )

        somme5 = sum(valeurs.values(), Decimal(0))
        if somme5 - CENT > TOLERANCE_SOMME:
            raise SystemExit(
                f"{nom} : la somme des cinq IA vaut {fr(somme5)} %, plus de 100 %. "
                "Vérifiez l'Excel (ou ajoutez une correction sourcée dans CORRECTIONS)."
            )
        autre = max(Decimal(0), CENT - somme5).quantize(CENTIEME, rounding=ROUND_HALF_UP)
        total = somme5 + autre
        if abs(total - CENT) > TOLERANCE_SOMME:
            raise SystemExit(f"{nom} : somme avec Autre IA = {fr(total)} % (attendu 100).")
        if total != CENT:
            alertes.append(
                f"{nom} : somme des cinq IA = {fr(somme5)} % (dépasse 100 de "
                f"{fr(somme5 - CENT)}, arrondis de la source) ; Autre IA = 0."
            )

        maxi = max(valeurs.values())
        ex_aequo = [ia["id"] for ia in IAS if valeurs[ia["id"]] == maxi]
        # En cas d'égalité, la couleur suit le premier dans l'ordre validé ;
        # la liste exAequo permet d'écrire « à égalité » dans l'info-bulle.
        en_tete = ex_aequo[0]

        parts = {ia: nombre_json(valeurs[ia]) for ia in ORDRE_CSV}
        parts["autre"] = nombre_json(autre)

        p = {
            "nom": nom,
            "iso2": iso2,
            "iso3": iso3,
            "num": num,
            "parts": parts,
            "enTete": en_tete,
            "atypique": iso3 in ATYPIQUES,
        }
        if len(ex_aequo) > 1:
            p["exAequo"] = ex_aequo
        if nom_source != nom:
            p["nomSource"] = nom_source
        if note:
            p["note"] = note
        p["_somme5"] = somme5
        p["_autre"] = autre
        pays.append(p)

    pays.sort(key=lambda p: cle(p["nom"]))
    return pays, corrections_appliquees, alertes


def ecrire_js(pays, corrections, chemin):
    donnees = {
        "source": SOURCE,
        "sourceUrl": SOURCE_URL,
        "periode": PERIODE,
        "mesure": MESURE,
        "genereLe": datetime.date.today().isoformat(),
        "ias": IAS,
        "autre": AUTRE,
        "corrections": corrections,
        "pays": [{k: v for k, v in p.items() if not k.startswith("_")} for p in pays],
    }
    entete = (
        "/* Données de la carte « IA la plus utilisée par pays » — fichier GÉNÉRÉ par\n"
        "   build_data.py à partir du fichier Excel du groupe (non publié) : ne pas modifier\n"
        "   à la main (remplacer l'Excel puis relancer le script).\n"
        f"   Source : {SOURCE}. */\n"
    )
    texte = entete + "window.DATA_USAGE_IA = " + json.dumps(donnees, ensure_ascii=False, indent=2) + ";\n"
    chemin.write_text(texte, encoding="utf-8")


def ecrire_csv(pays, chemin):
    labels = {ia["id"]: ia["label"] for ia in IAS}
    entreprises = {ia["id"]: ia["entreprise"] for ia in IAS}
    with chemin.open("w", encoding="utf-8", newline="") as f:
        w = csv.writer(f, delimiter=",", quoting=csv.QUOTE_MINIMAL, lineterminator="\n")
        w.writerow(["pays", "code_iso2", "code_iso3", "code_iso_num"] + ORDRE_CSV
                   + ["autre_ia", "ia_en_tete", "entreprise_en_tete", "repartition_atypique",
                      "periode", "source", "note"])
        for p in pays:
            parts = p["parts"]
            w.writerow(
                [p["nom"], p["iso2"], p["iso3"], p["num"]]
                + [f"{Decimal(str(parts[ia])):.2f}" for ia in ORDRE_CSV]
                + [f"{p['_autre']:.2f}",
                   labels[p["enTete"]] + (" (ex aequo)" if "exAequo" in p else ""),
                   entreprises[p["enTete"]],
                   "true" if p["atypique"] else "false",
                   PERIODE_ISO,
                   SOURCE.split(",")[0],
                   p.get("note", "")]
            )


def main():
    chemin_excel = Path(sys.argv[1]) if len(sys.argv) > 1 else EXCEL_PAR_DEFAUT
    if not chemin_excel.exists():
        raise SystemExit(f"Fichier Excel introuvable : {chemin_excel}\n"
                         "Il n'est pas publié avec le site : placez-le dans data/ sur votre ordinateur, "
                         "ou donnez son chemin : python3 dataviz/carte-europe/build_data.py chemin/du/fichier.xlsx")
    pays, corrections, alertes = construire(chemin_excel)

    ecrire_js(pays, corrections, ICI / "data-usage.js")
    ecrire_csv(pays, ICI / CSV_NOM)

    # Rapport de contrôle
    labels = {ia["id"]: ia["label"] for ia in IAS}
    print(f"{len(pays)} pays lus dans {chemin_excel.name}")
    print("Contrôle des sommes (5 IA + Autre IA) :")
    for p in pays:
        total = p["_somme5"] + p["_autre"]
        etat = "ok" if total == CENT else f"= {fr(total)} (arrondi de la source)"
        print(f"  {p['nom']:<20} 5 IA {fr(p['_somme5']):>7}  Autre {fr(p['_autre']):>5}  total {etat}")
    comptes = {}
    for p in pays:
        comptes[p["enTete"]] = comptes.get(p["enTete"], 0) + 1
    print("IA en tête :", ", ".join(
        f"{labels[k]} {n} pays" for k, n in sorted(comptes.items(), key=lambda kv: -kv[1])))
    egalites = [p["nom"] for p in pays if "exAequo" in p]
    print("Égalités en tête :", ", ".join(egalites) if egalites else "aucune")
    for c in corrections:
        print(f"Correction appliquée : {c['pays']} {labels[c['ia']]} "
              f"{c['valeurFichier']} -> {c['valeurRetenue']} ({c['source']})")
    for a in alertes:
        print("Note :", a)
    print(f"Écrit : {ICI / 'data-usage.js'}")
    print(f"Écrit : {ICI / CSV_NOM}")


if __name__ == "__main__":
    main()
