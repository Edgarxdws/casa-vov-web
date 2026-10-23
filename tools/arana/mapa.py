#!/usr/bin/env python3
"""Araña: mapa compacto del sitio para leer solo lo necesario.

Uso:  python3 tools/arana/mapa.py [carpeta_del_sitio]   (por defecto: Final_Version_Backup)

Imprime, con números de línea:
  - index.html: secciones (id, rango de líneas, título), modales y líneas gigantes (SVG inline)
  - styles.css: bloques comentados, selectores definidos más de una vez y clases sin uso
  - script.js: funciones y listeners, y selectores que no existen en el HTML
  - assets: rutas rotas (sensibles a mayúsculas, como en el hosting) y archivos sin usar
"""
import os
import re
import sys
from collections import Counter, defaultdict
from html.parser import HTMLParser

ROOT = sys.argv[1] if len(sys.argv) > 1 else "Final_Version_Backup"


def read(name):
    with open(os.path.join(ROOT, name), encoding="utf-8") as fh:
        return fh.read()


html, css, js = read("index.html"), read("styles.css"), read("script.js")


# ---------- HTML ----------
class Sections(HTMLParser):
    def __init__(self):
        super().__init__()
        self.open, self.found, self.ids, self.classes = [], [], set(), Counter()
        self.want_title = None
        self.modals = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if a.get("id"):
            self.ids.add(a["id"])
        for c in (a.get("class") or "").split():
            self.classes[c] += 1
        if "modal" in (a.get("class") or "").split():
            self.modals.append((self.getpos()[0], a.get("id")))
        if tag in ("section", "footer", "nav"):
            self.open.append([tag, a.get("id") or a.get("class"), self.getpos()[0], None, len(self.open)])
        if tag in ("h1", "h2") and self.open and self.open[-1][3] is None:
            self.want_title = self.open[-1]

    def handle_data(self, data):
        if self.want_title is not None and data.strip():
            self.want_title[3] = (self.want_title[3] or "") + " " + " ".join(data.split())

    def handle_endtag(self, tag):
        if tag in ("h1", "h2"):
            self.want_title = None
        if tag in ("section", "footer", "nav"):
            for i in range(len(self.open) - 1, -1, -1):
                if self.open[i][0] == tag:
                    t, name, start, title, depth = self.open.pop(i)
                    self.found.append((start, self.getpos()[0], depth, t, name, (title or "").strip()))
                    break


p = Sections()
p.feed(html)
print(f"# Mapa de {ROOT}\n\n## index.html ({len(html.splitlines())} líneas, {len(html)//1024} KB)")
for start, end, depth, tag, name, title in sorted(p.found):
    print(f"{'  ' * depth}- L{start}-{end} <{tag}> {name}  {title[:60]}")
for line, name in p.modals:
    print(f"- L{line} modal #{name} (contenido dinámico desde script.js)")
for t in p.open:
    print(f"  ! <{t[0]} {t[1]}> abierta en L{t[2]} y nunca se cierra")
for i, line in enumerate(html.splitlines(), 1):
    if len(line) > 1500:
        print(f"  ! L{i}: línea de {len(line)//1024} KB (no leerla completa; usar cut -c1-200)")

# ---------- CSS ----------
print(f"\n## styles.css ({len(css.splitlines())} líneas)")
for i, line in enumerate(css.splitlines(), 1):
    m = re.match(r"\s*/\*\s*[-=]*\s*([A-ZÁÉÍÓÚÑ0-9][^*]{3,60}?)\s*[-=]*\s*\*/", line)
    if m and not line.startswith("    "):
        print(f"- L{i}: {m.group(1).strip()}")
top_level = re.findall(r"^([^\s@}/][^{]*?)\s*\{", css, re.M)
dups = [s for s, n in Counter(top_level).items() if n > 1]
print(f"\nSelectores definidos 2+ veces fuera de @media ({len(dups)}): " + ", ".join(sorted(dups)[:25]) + (" …" if len(dups) > 25 else ""))
css_classes = set(re.findall(r"\.([a-zA-Z][\w-]*)", re.sub(r"url\([^)]*\)|\d+\.\d+", "", css)))
used = set(p.classes) | set(re.findall(r"[\"'`.\s]([a-zA-Z][\w-]+)", js))
dead = sorted(c for c in css_classes if c not in used)
print(f"Clases en CSS que no aparecen en HTML ni JS ({len(dead)}): " + ", ".join(dead[:40]) + (" …" if len(dead) > 40 else ""))

# ---------- JS ----------
print(f"\n## script.js ({len(js.splitlines())} líneas)")
for i, line in enumerate(js.splitlines(), 1):
    m = re.match(r"\s{0,4}(?:function\s+(\w+)|const\s+(\w+)\s*=\s*(?:\([^)]*\)|\w+)\s*=>|// [-=]{2,}\s*(.+?)\s*[-=]*$|document\.addEventListener\('DOMContentLoaded')", line)
    if m:
        label = m.group(1) or m.group(2) or m.group(3) or "DOMContentLoaded"
        if set(label) <= set("=-"):
            continue
        print(f"- L{i}: {label}")
missing = defaultdict(list)
for i, line in enumerate(js.splitlines(), 1):
    for sel in re.findall(r"querySelector(?:All)?\('([.#][\w-]+)", line) + [f"#{x}" for x in re.findall(r"getElementById\('([\w-]+)'", line)]:
        name = sel[1:]
        if (sel[0] == "#" and name not in p.ids) or (sel[0] == "." and name not in p.classes):
            missing[sel].append(i)
if missing:
    print("Selectores del JS que no existen en el HTML (código muerto o creado dinámicamente):")
    for sel, lines in sorted(missing.items()):
        print(f"  - {sel}: L{', L'.join(map(str, lines))}")

# ---------- Assets ----------
print("\n## assets")
refs = set(re.findall(r"(assets/[^\"')\s]+)", html + css + js))
files = {os.path.relpath(os.path.join(d, f), ROOT) for d, _, fs in os.walk(os.path.join(ROOT, "assets")) for f in fs}
for r in sorted(refs - files):
    hint = next((f for f in files if f.lower() == r.lower()), None)
    print(f"  ! ROTA: {r}" + (f"  (existe como {hint}: difiere en mayúsculas)" if hint else ""))
for f in sorted(files - refs):
    print(f"  - sin usar: {f} ({os.path.getsize(os.path.join(ROOT, f))//1024} KB)")
big = sorted(((os.path.getsize(os.path.join(ROOT, f)), f) for f in files & refs), reverse=True)[:5]
print("  Más pesados en uso: " + ", ".join(f"{f.split('/')[-1]} {s//1024} KB" for s, f in big))
