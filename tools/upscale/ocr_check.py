"""Compara el texto legible (OCR) de una etiqueta original contra la versión mejorada con IA.
Uso: python ocr_check.py <original.png> <mejorada.png>
Sale con código 1 si aparece o desaparece alguna palabra: revisar a mano antes de publicar."""
import sys, re
from PIL import Image
import numpy as np
from rapidocr_onnxruntime import RapidOCR

ocr = RapidOCR()

def words(path, upscale_to=None):
    im = Image.open(path).convert("RGBA")
    bg = Image.new("RGB", im.size, "white"); bg.paste(im, mask=im.getchannel("A"))
    if upscale_to:  # el original se amplía con Lanczos para que el OCR lo lea a la misma escala
        bg = bg.resize(upscale_to, Image.LANCZOS)
    result, _ = ocr(np.asarray(bg))
    text = " ".join(r[1] for r in (result or []))
    return set(re.findall(r"[\wÁÉÍÓÚÑáéíóúñ%.,]+", text.upper()))

orig, new = sys.argv[1:3]
new_size = Image.open(new).size
a, b = words(orig, new_size), words(new)
lost, added = sorted(a - b), sorted(b - a)
print("Solo en el original :", lost)
print("Solo en la mejorada :", added)
sys.exit(1 if lost or added else 0)
