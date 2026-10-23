# Design system de Casa VOV (v0.1)

Base para el rediseño propuesto en [`docs/05-storytelling-y-diseno-2026.md`](../docs/05-storytelling-y-diseno-2026.md). **Todavía no está aplicado al sitio**: el sitio actual sigue usando sus propias variables en `Final_Version_Backup/styles.css`.

| Archivo | Contenido |
|---|---|
| `tokens.css` | Colores (tierra + expresiones con variante "tinta" que cumple 4.5:1), tipografía fluida, espacio, radio y movimiento. Contrastes medidos. |
| `preview/colores.html` | Paleta con el uso permitido de cada color |
| `preview/tipografia.html` | Escala tipográfica con Fraunces + Instrument Sans + IBM Plex Mono (opción B, libre) |
| `preview/enlaces-y-acciones.html` | Acciones como enlaces con intención (sin botones de píldora) sobre papel y carbón |
| `preview/ficha-expresion.html` | Ficha de producto con el ala en el color de la expresión y los datos que exige la NOM-070 |

Cada vista previa empieza con `<!-- @dsCard group="…" -->`, que es como el panel de Design System de Claude agrupa las tarjetas.

## Sincronizar con `/design-sync`

La skill `/design-sync` no estaba disponible en la sesión en que se creó esta carpeta, así que no se subió nada. Para hacerlo:

1. Abre Claude Code en este repo con tu sesión de claude.ai.
2. Escribe `/design-sync` y elige (o crea) un proyecto de tipo *design system*.
3. Indica `design-system/` como carpeta local. La skill compara archivo por archivo y te muestra el plan antes de subir.

Aviso del propio servicio: *Claude Design* como sitio independiente (claude.ai/design) cierra el **14 de diciembre de 2026**; la función sigue dentro de Claude.

## Decisiones pendientes

- **Tipografía final**: opción A (Canela + Graphik, de pago, autoría mexicana) u opción B (libre, ya cargada aquí). Ver §5 del documento 05.
- **Textura**: el token `--grain-opacity` espera fotos reales de cantera o bagazo, que aún no existen.
