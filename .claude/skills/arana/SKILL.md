---
name: arana
description: Ahorra contexto en el sitio de Casa VOV. Úsala ANTES de leer o editar index.html, styles.css o script.js (son de 1,000–4,000 líneas) y al empezar cualquier tarea en este repo; también cuando el usuario escriba /arana. Mapea el sitio con números de línea para leer solo los rangos necesarios y delegar la investigación pesada.
---

# /arana — leer poco, entender todo

El sitio es una sola página estática en `Final_Version_Backup/` con archivos grandes: `index.html` (~1,000 líneas, con un SVG de 6 KB en una sola línea), `styles.css` (~4,000 líneas, con reglas duplicadas) y `script.js` (~1,250 líneas). Leerlos completos gasta contexto sin necesidad.

## 1. Mapear primero (siempre)

```bash
python3 tools/arana/mapa.py            # o: python3 tools/arana/mapa.py <otra_carpeta>
```

Devuelve en ~160 líneas:
- secciones del HTML con su **rango de líneas** y título, modales y líneas gigantes;
- bloques comentados del CSS, **selectores definidos 2+ veces** y clases sin uso;
- funciones y listeners del JS, y **selectores que no existen** en el HTML;
- **rutas de assets rotas** (sensibles a mayúsculas, como en el hosting) y archivos sin usar.

Si algo marcado con `!` aparece, es un bug probable: revísalo antes de seguir.

## 2. Leer por rangos, nunca archivos completos

- Usa `Read` con `offset`/`limit` tomados del mapa, o `sed -n 'A,Bp'`.
- En `index.html` corta las líneas largas: `sed -n 'A,Bp' index.html | cut -c1-200`.
- Para encontrar algo: `Grep` con `-n` y contexto corto (`-C 3`), no lecturas exploratorias.
- En `styles.css` una clase puede estar definida varias veces: busca **todas** las definiciones (`grep -n "\.clase\b"`) antes de editar; la última gana.

## 3. Editar de forma verificable

- Para cambios mecánicos o repetidos usa un script de Python con reemplazos exactos y `assert s.count(old) == 1` (falla en vez de editar en el lugar equivocado).
- Después de tocar JS: `node --check Final_Version_Backup/script.js`.
- Para ver el resultado sin red: Playwright con Chromium (`/opt/pw-browsers/chromium`) y las librerías del CDN servidas desde `npm install aos gsap @vimeo/player` con `page.route`. Revisa errores de consola e imágenes rotas.
- Vuelve a correr `mapa.py`: no debe aparecer ningún `!` nuevo.

## 4. Delegar lo pesado

- Investigación web (competencia, normas, herramientas): un subagente por tema, en paralelo, que **escriba su informe en `docs/`** y devuelva solo un resumen corto. Indica en el brief que en este entorno solo funciona `WebSearch` (WebFetch y curl a sitios externos fallan).
- Tú te quedas con las conclusiones; no pegues informes completos en el contexto.

## 5. Memoria del proyecto

- `docs/` es la memoria: auditoría (01), competencia (02), políticas (03), IA de imágenes (04), storytelling y diseño (05), pendientes del cliente (06). Léelos por sección (`grep -n "^#"`), no completos.
- Si descubres algo que la próxima sesión debe saber (una regla, una decisión del cliente), añádelo en una línea a `CLAUDE.md`.
