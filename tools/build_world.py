"""Construit vendor/world-50m.js : sous-ensemble Europe + voisins du TopoJSON world-atlas countries-50m.
Usage : python3 -I build_world.py <countries-50m.json> <sortie.js>"""
import json, sys

src, dst = sys.argv[1], sys.argv[2]
with open(src, encoding="utf-8") as f:
    topo = json.load(f)
assert topo.get("type") == "Topology", "pas un TopoJSON"
geoms = topo["objects"]["countries"]["geometries"]
tf = topo.get("transform")
arcs = topo["arcs"]

def decode(a):
    if not tf:
        return [(p[0], p[1]) for p in a]
    x = y = 0
    out = []
    for p in a:
        x += p[0]; y += p[1]
        out.append((x * tf["scale"][0] + tf["translate"][0], y * tf["scale"][1] + tf["translate"][1]))
    return out

bbox = []
for a in arcs:
    pts = decode(a)
    xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
    bbox.append((min(xs), min(ys), max(xs), max(ys)))

FRAME = (-45.0, 20.0, 70.0, 85.0)  # lon min, lat min, lon max, lat max (large, la carte recadre)

def arc_ids(g):
    if g["type"] == "Polygon":
        return [i for ring in g["arcs"] for i in ring]
    if g["type"] == "MultiPolygon":
        return [i for poly in g["arcs"] for ring in poly for i in ring]
    return []

absid = lambda i: ~i if i < 0 else i
keep = []
for g in geoms:
    ids = [absid(i) for i in arc_ids(g)]
    if not ids:
        continue
    # garde le pays si au moins un de ses arcs touche le cadre (évite les pays à cheval sur l'antiméridien)
    if any(not (bbox[i][2] < FRAME[0] or bbox[i][0] > FRAME[2] or bbox[i][3] < FRAME[1] or bbox[i][1] > FRAME[3]) for i in ids):
        keep.append(g)

used = sorted({absid(i) for g in keep for i in arc_ids(g)})
remap = {old: new for new, old in enumerate(used)}
rm = lambda i: ~remap[~i] if i < 0 else remap[i]

def rewrite(g):
    g = dict(g)
    if g["type"] == "Polygon":
        g["arcs"] = [[rm(i) for i in ring] for ring in g["arcs"]]
    else:
        g["arcs"] = [[[rm(i) for i in ring] for ring in poly] for poly in g["arcs"]]
    return g

out = {"type": "Topology"}
if tf:
    out["transform"] = tf
out["objects"] = {"countries": {"type": "GeometryCollection", "geometries": [rewrite(g) for g in keep]}}
out["arcs"] = [arcs[i] for i in used]

js = ("/* Fond de carte : world-atlas countries-50m (licence ISC, Mike Bostock), données Natural Earth "
      "(domaine public). Sous-ensemble Europe et pays voisins, généré par tools/build_world.py. */\n"
      "window.WORLD_TOPO=" + json.dumps(out, separators=(",", ":"), ensure_ascii=False) + ";\n")
with open(dst, "w", encoding="utf-8") as f:
    f.write(js)

print(f"{len(geoms)} -> {len(keep)} pays ; {len(arcs)} -> {len(used)} arcs ; {len(js)/1024:.0f} Ko")
need = {8,276,20,40,56,112,70,100,191,208,724,233,246,250,300,348,372,352,380,428,438,440,442,807,470,498,492,499,578,528,616,620,203,642,826,674,688,703,705,752,756,804,51,31,196,268,398,643,792}
kept_ids = {int(g["id"]) for g in keep if str(g.get("id", "")).isdigit()}
print("pays de l'Excel absents :", sorted(need - kept_ids) or "aucun")
print("exemples d'id :", [g.get("id") for g in keep[:6]], "| transform :", bool(tf))
