# 01 · Auditoría del código del sitio

**Fecha:** 23-oct-2026 · **Alcance:** `Final_Version_Backup/` (index.html, styles.css, script.js, assets).
**Método:** mapa del código con `tools/arana/mapa.py`, lectura por rangos, y capturas de escritorio (1440 px) y móvil (390 px) con Chromium **antes y después** de cada cambio, revisando errores de consola e imágenes rotas. Las librerías del CDN se sirvieron localmente; las fuentes de Google, Vimeo y Maps no cargan en este entorno.

---

## Resumen

El sitio tenía **tres bugs visibles en producción** (medallas rotas, una sección sin cerrar que arrastraba el resto de la página, un formulario que fingía enviar mensajes) y no tenía **aviso de edad**, que es obligatorio para una marca de alcohol que vende en EE. UU. Todo eso quedó corregido en esta rama. Lo que queda es de fondo: contenido en modales, 80 % del texto sin traducir, CSS con 26 reglas duplicadas y 50 clases muertas, y afirmaciones de producto que el cliente debe confirmar.

---

## 1. Corregido en esta rama

| # | Problema | Impacto | Arreglo |
|---|---|---|---|
| 1 | Rutas `…Medal_MJoven.png` y `Encuentro_Nacional…` con mayúsculas distintas al archivo real | En cualquier hosting Linux (GitHub Pages, Netlify, etc.) las **2 medallas de "La Consagración" salían rotas** y su texto alternativo se encimaba en las tarjetas. En Windows/Mac no se nota porque no distinguen mayúsculas | Rutas corregidas |
| 2 | `<section id="reconocimientos">` se cerraba con un `</div>` | Edición especial, Historia, Contacto, footer, WhatsApp y popup quedaban **dentro** de la sección de premios: franja azul de 5 rem debajo del footer, `overflow:hidden` sobre media página y el menú marcaba "Reconocimientos" estando en Contacto | Cerrada con `</section>` |
| 3 | El formulario mostraba "¡Mensaje enviado!" sin enviar nada | **Cada mensaje de un distribuidor o cliente se perdía** | Ahora abre el correo del visitante con el mensaje ya escrito para `info@casavov.mx`. Falta un servicio de formularios (ver §3) |
| 4 | Sin aviso de edad | Incumple el código DISCUS (EE. UU., 21+) y las políticas de Meta/Google | El selector de país pide país + **fecha de nacimiento completa**; México 18+, EE. UU. 21+. Solo guarda "verificado" y el país, nunca la fecha. Probado con 4 casos |
| 5 | Footer sin las leyendas exactas de COFEPRIS | Riesgo regulatorio en México | "EVITE EL EXCESO. EL ABUSO EN EL CONSUMO DE ESTE PRODUCTO ES NOCIVO PARA LA SALUD." + "Please enjoy responsibly." Se conservó el lema de la marca |
| 6 | El mismo SVG del ala (7 KB) pegado 5 veces | 28 KB extra y un HTML imposible de leer | Un `<symbol>` + 5 `<use>`. index.html bajó de 91 KB a 69 KB (ya con el aviso de edad nuevo), sin cambio visual (verificado lado a lado) |
| 7 | Medalla PNG de 6000×3375 px (460 KB) mostrada a ~250 px | Peso inútil en móvil | Copia web de 640 px (74 KB); el original se conserva |
| 8 | Swiper (CSS + JS) cargado para un `.product-slider-main` que no existe | ~150 KB y un error `Swiper is not defined` si el CDN falla | Eliminado |
| 9 | Premios animados por 3 sistemas a la vez (AOS, GSAP sin el plugin ScrollTrigger y una clase CSS) | GSAP se ejecutaba al cargar, no al hacer scroll, y anulaba a los otros dos | Queda solo la animación CSS `.award-visible`; se borró además código que nunca se llamaba |
| 10 | Autoplay del carrusel cada 8 s que nunca se reiniciaba | Al hacer clic en "siguiente" podía saltar otra vez al instante; seguía corriendo con la pestaña oculta | Se reinicia al navegar y se pausa con la pestaña oculta o con *movimiento reducido* |
| 11 | Títulos de contacto en verde `#006847`, azul `#3C3B6E` y gris `#555` sobre fondo casi negro (≈1.5:1) + bandera emoji duplicando la bandera SVG | Ilegibles; patrón "genérico" | Dorado de marca (8:1 sobre carbón) y sin emoji |
| 12 | Menú móvil, cierres de modal y flechas eran `<div>`/`<span>` o `‹ ›` sin nombre | No se podían usar con teclado ni lector de pantalla | `<button>` con `aria-label`, `aria-expanded`, `role="dialog"`, cierre con Escape, foco visible, `lang` del documento al cambiar idioma |
| 13 | WhatsApp flotante tapaba las leyendas legales en móvil | Leyendas obligatorias ocultas | Espacio inferior en el footer móvil |
| 14 | Varios | — | `preconnect` a Google Fonts, `loading="lazy"` en imágenes bajo el pliegue, `name`/`aria-label`/`autocomplete` en el formulario, "© 2019–2026" |

Resultado medido: **0 errores de JavaScript** (antes 1), **0 imágenes rotas** (antes 2).

---

## 2. Pendiente: contenido y afirmaciones (necesita al cliente)

Estos no los cambié porque son decisiones de negocio o requieren un documento. Detalle y fuentes en [03 · Políticas](03-politicas-y-cumplimiento.md).

| Dónde | Qué dice | Problema |
|---|---|---|
| Premios, tarjeta 2025 | "Medalla de Plata · Spirits Selection 2025" con la foto de una botella y una cita | No hay medalla ni evidencia; la cita parece de la marca. **Confirmar o retirar** |
| Modal Reposado (`script.js`) | "Nuestro mezcal más premiado internacionalmente" | Los premios del propio sitio son del Joven |
| Natural (tarjeta y modal) | "Proceso ancestral", "100% Agave Cupreata Ancestral" | *Ancestral* es categoría NOM-070 (olla de barro); el modal dice "alambique de cobre" |
| Edición 50 Años | "Certificado: U.M.S.N.H", "44° Alc. Vol.", "Maduración: 8 a 9 años" | Una universidad no certifica la NOM; "°" → "%"; es edad del agave, no maduración |
| Mezcladas | Sitio: "Mezclada de Mango"; etiqueta: "Mezcalada de Mango Natural · Coctel"; recetas: "Mezcal de Mango" | Un coctel no es mezcal; usar el nombre de la etiqueta |
| Añejo / Premium | Tarjeta "18 meses" vs modal "más de un año"; "10 años" vs "más de 10 años" | Datos inconsistentes |
| Contacto | +52 443 123 4567, +1 713 555 1234, redes `/casavov` | Parecen números de ejemplo (555 es ficticio en EE. UU.) |
| Premios 2023 | Archivo "Encuentro Nacional del Mezcal", texto "Premio Nacional del Mezcal" | Usar el nombre del diploma |
| Inglés | "La Consagración" → "Consecration" | Traducción literal; propuesta: "The Recognition" |

---

## 3. Pendiente: código (priorizado)

### Alta
1. **Formulario real.** Conectar Formspree, Netlify Forms o similar (`fetch` en lugar de `mailto:`), con aviso de privacidad corto y un campo trampa anti-spam. Requiere los datos del responsable (ver 06).
2. **Traducción.** Solo ~40 textos tienen `data-en`; ~160 no (Mezcladas, premios, edición especial, historia, tarjetas de contacto). Para EE. UU. hace falta una versión en inglés completa, idealmente como página `/en/` y no con JavaScript (mejor SEO y sin parpadeo). El selector de idioma vive escondido dentro del formulario.
3. **SEO básico.** No hay favicon, `canonical`, `og:url`, datos estructurados (`Organization`, `Product`), `sitemap.xml` ni `robots.txt`. `og:image` apunta a un SVG relativo, que ninguna red social muestra: usar un JPG de 1200×630 con URL absoluta (necesita el dominio).
4. **Productos y recetas en modales.** No tienen URL, no se pueden compartir ni indexar. Cada expresión debería ser una página (plantilla en el documento 05).

### Media
5. **CSS acumulado:** 4,079 líneas, 26 selectores definidos 2+ veces fuera de `@media` (`.modal`, `.country-popup`, `.contact-card`, …) y 50 clases sin uso (`premium-section`, `puerto-hero`, `products-grid`, …). Hay bloques titulados "NUEVO DISEÑO ESTILO 400 CONEJOS" y comentarios "Add this code to your script.js": se fue pegando código sin quitar el anterior. Conviene reescribirlo sobre `design-system/tokens.css` en lugar de limpiarlo regla por regla.
6. **Rendimiento del scroll:** 5 listeners de `scroll`, dos sin limitar; el del hero crea un tween de GSAP **en cada evento**. Usar `gsap.quickTo`, `requestAnimationFrame` o animaciones CSS ligadas al scroll.
7. **Imágenes:** las botellas son PNG de paleta de 1200×1200 (~100 KB c/u) con la botella ocupando un 30 % del lienzo. Recortar, exportar AVIF/WebP con `srcset` y declarar `width`/`height`. Ver documento 04.
8. **Terceros sin consentimiento:** Vimeo en autoplay y Google Maps cargan cookies al abrir la página. Cargarlos al hacer clic (también mejora el LCP). El video en bucle necesita botón de pausa (WCAG 2.2.2).
9. **Contraste:** el dorado `#D4A574` sobre fondos claros da 2.2:1 (mínimo 4.5:1) en "La", "Los Sabores que", botones "Descubrir Más", etc.
10. **Móvil:** el nombre del producto ("NATURAL") se encima con las flechas del carrusel; los indicadores son `<span>` sin teclado.

### Baja
11. AOS 2.3.1 no se actualiza desde 2018; GSAP 3.12 está fijado a una versión vieja. Ninguno usa SRI (`integrity`).
12. `onclick` en línea y muchos `style=""` en el HTML impiden una política CSP y dificultan el mantenimiento.
13. Easter egg del código Konami con `alert()`: decidir si se queda.
14. El efecto "máquina de escribir" del lema vacía el texto al cargar (los lectores de pantalla y Google pueden leerlo vacío).
15. Partículas, burbujas y `--transition-bounce`: ver la guía anti-vibe-coding del documento 05.
16. La carpeta del sitio se llama `Final_Version_Backup`; para desplegar conviene renombrarla (`site/`) y añadir un README con cómo publicarlo.

---

## 4. Cómo reproducir la revisión

```bash
python3 tools/arana/mapa.py                 # mapa + bugs probables (marcados con !)
node --check Final_Version_Backup/script.js # sintaxis
```

La araña, corrida sobre la versión anterior (`git show 50b77f5`), marca exactamente los tres bugs del §1: la sección sin cerrar y las dos rutas rotas por mayúsculas.
