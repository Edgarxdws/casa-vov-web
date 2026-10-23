# Upscale + verificación de texto (open-source, sin GPU)

Dos scripts para mejorar las fotos de botella **sin publicar nunca una etiqueta alterada**.

| Script | Qué hace |
|---|---|
| `upscale.py` | Recorta la botella por su transparencia y la amplía ×4 con [Real-ESRGAN](https://github.com/xinntao/Real-ESRGAN) (`realesrgan-x4plus`) en CPU usando [ncnn](https://github.com/Tencent/ncnn). El alfa se escala con Lanczos. |
| `ocr_check.py` | Lee con OCR el texto del original y de la versión mejorada y lista las palabras que cambiaron. Termina con error (código 1) si hay diferencias. |

> En la prueba con `bottle_joven.png`, Real-ESRGAN cambió "45%" por "46%" y "ARTESANAL" por "ASTEOANAL". Ver [docs/04-ia-imagenes.md §4.7](../../docs/04-ia-imagenes.md). Usa el resultado para el vidrio y la tapa, y **pega encima la etiqueta original o el vector**.

## Instalación (una vez)

```bash
python3 -m venv .venv
.venv/bin/pip install ncnn numpy pillow rapidocr_onnxruntime
# Modelos de Real-ESRGAN (46 MB): vienen dentro del zip de la release oficial
curl -L -o realesrgan.zip https://github.com/xinntao/Real-ESRGAN/releases/download/v0.2.5.0/realesrgan-ncnn-vulkan-20220424-ubuntu.zip
unzip realesrgan.zip -d realesrgan   # los modelos quedan en realesrgan/models
```

Los zips de Windows y macOS de la misma release traen además el programa `realesrgan-ncnn-vulkan`, que usa la GPU y es mucho más rápido. Si prefieres una app con interfaz, [Upscayl](https://github.com/upscayl/upscayl) usa los mismos modelos.

## Uso

```bash
# 1) Ampliar (≈2–3 min por botella en CPU de 4 núcleos)
.venv/bin/python upscale.py realesrgan/models ../../Final_Version_Backup/assets/bottles/main/bottle_joven.png joven_x4.png

# 2) Verificar el texto: recorta la MISMA zona de la etiqueta en el original y en la ampliada
.venv/bin/python ocr_check.py etiqueta_original.png etiqueta_x4.png
# Solo en el original : [...]   <- palabras que se perdieron
# Solo en la mejorada : [...]   <- palabras que aparecieron (p. ej. "46%")
```

Si `ocr_check.py` termina con error, la imagen **no se publica** tal cual: se compone la etiqueta original encima y se vuelve a revisar a mano al 300 %.

Para la web no se sube el ×4: se exporta a 2× del tamaño en pantalla en AVIF/WebP (ver §4.5 del documento).
