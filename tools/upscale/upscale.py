"""Real-ESRGAN x4plus en CPU con ncnn (sin GPU). Recorta la botella por su alfa, escala RGB con la red
y el alfa con Lanczos. Uso: python upscale.py <models_dir> <in.png> <out.png>"""
import sys, time
import numpy as np, ncnn
from PIL import Image

models, src, dst = sys.argv[1:4]
TILE, PAD, SCALE = 192, 12, 4

net = ncnn.Net()
net.opt.use_vulkan_compute = False
net.opt.num_threads = 4
net.load_param(f"{models}/realesrgan-x4plus.param")
net.load_model(f"{models}/realesrgan-x4plus.bin")

im = Image.open(src).convert("RGBA")
x0, y0, x1, y1 = im.getchannel("A").point(lambda a: 255 if a > 8 else 0).getbbox()
m = 16
box = (max(0, x0 - m), max(0, y0 - m), min(im.width, x1 + m), min(im.height, y1 + m))
crop = im.crop(box)
rgb = np.asarray(crop.convert("RGB"), dtype=np.float32) / 255.0  # H W C
H, W, _ = rgb.shape
out = np.zeros((H * SCALE, W * SCALE, 3), dtype=np.float32)
t = time.time()
for ty in range(0, H, TILE):
    for tx in range(0, W, TILE):
        ax, ay = max(tx - PAD, 0), max(ty - PAD, 0)
        bx, by = min(tx + TILE + PAD, W), min(ty + TILE + PAD, H)
        tile = np.ascontiguousarray(rgb[ay:by, ax:bx].transpose(2, 0, 1))
        ex = net.create_extractor()
        ex.input("data", ncnn.Mat(tile))
        _, o = ex.extract("output")
        o = np.array(o).transpose(1, 2, 0)
        cx, cy = (tx - ax) * SCALE, (ty - ay) * SCALE
        cw, ch = (min(tx + TILE, W) - tx) * SCALE, (min(ty + TILE, H) - ty) * SCALE
        out[ty * SCALE:ty * SCALE + ch, tx * SCALE:tx * SCALE + cw] = o[cy:cy + ch, cx:cx + cw]
rgb_up = Image.fromarray((np.clip(out, 0, 1) * 255 + 0.5).astype(np.uint8))
alpha_up = crop.getchannel("A").resize(rgb_up.size, Image.LANCZOS)
rgb_up.putalpha(alpha_up)
rgb_up.save(dst, optimize=True)
print(f"{src}: crop {W}x{H} -> {rgb_up.size[0]}x{rgb_up.size[1]} en {time.time()-t:.0f}s")
