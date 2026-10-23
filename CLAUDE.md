# Casa VOV Inspiración · sitio web

Mezcal artesanal de agave cupreata, Etúcuaro (Madero, Michoacán). Sitio de una sola página, HTML/CSS/JS estático, en `Final_Version_Backup/`. Idioma de trabajo: español de México.

## Antes de leer código
Usa la skill `/arana` (`.claude/skills/arana/SKILL.md`): corre `python3 tools/arana/mapa.py` y lee solo los rangos de líneas que necesites. Los tres archivos del sitio son grandes.

## Mapa del repo
- `Final_Version_Backup/` — el sitio (index.html, styles.css, script.js, assets/).
- `design-system/` — tokens y tarjetas de vista previa, listos para `/design-sync`.
- `docs/` — auditoría, competencia, políticas, IA de imágenes, storytelling y pendientes del cliente.
- `tools/arana/` — mapa del código. `tools/upscale/` — upscale con Real-ESRGAN + verificación OCR del texto.

## Reglas que no se rompen
- **Texto de etiqueta**: ninguna IA lo redibuja. Real-ESRGAN cambió "45%" por "46%" en una prueba; toda imagen mejorada pasa por `tools/upscale/ocr_check.py` y revisión humana.
- **Afirmaciones de producto** (premios, "ancestral", "sin aditivos", certificaciones, % Alc. Vol.): no se agregan ni se cambian sin documento del cliente. Ver `docs/03-politicas-y-cumplimiento.md`.
- **Aviso de edad** con fecha de nacimiento (MX 18+, EE.UU. 21+) y leyendas COFEPRIS en el footer: no quitarlos.
- Las rutas de assets distinguen mayúsculas en el hosting: verifica con `mapa.py`.
- El dorado `#D4A574` solo va sobre fondo oscuro (2.2:1 sobre blanco).
