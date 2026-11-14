from PIL import Image
from collections import deque
from pathlib import Path
import shutil

folder = Path("public/images/brainrots")
backup = folder / "backup-white-bg"
backup.mkdir(exist_ok=True)

files = [
    "bloodmoon-slap.png",
    "waverider.png",
    "rainbow-hammer.png",
    "bloodmoon-hammer.png",
]

for filename in files:
    path = folder / filename

    if not path.exists():
        print(f"НЕ НАЙДЕН: {filename}")
        continue

    shutil.copy2(path, backup / filename)

    image = Image.open(path).convert("RGBA")
    pixels = image.load()
    width, height = image.size

    visited = bytearray(width * height)
    queue = deque()

    def is_white(x, y):
        r, g, b, a = pixels[x, y]
        return a > 0 and r >= 240 and g >= 240 and b >= 240

    for x in range(width):
        if is_white(x, 0):
            queue.append((x, 0))
        if is_white(x, height - 1):
            queue.append((x, height - 1))

    for y in range(height):
        if is_white(0, y):
            queue.append((0, y))
        if is_white(width - 1, y):
            queue.append((width - 1, y))

    removed = 0

    while queue:
        x, y = queue.popleft()
        index = y * width + x

        if visited[index]:
            continue

        visited[index] = 1

        if not is_white(x, y):
            continue

        pixels[x, y] = (0, 0, 0, 0)
        removed += 1

        for nx, ny in ((x+1,y), (x-1,y), (x,y+1), (x,y-1)):
            if 0 <= nx < width and 0 <= ny < height:
                if not visited[ny * width + nx]:
                    queue.append((nx, ny))

    image.save(path)
    print(f"ГОТОВО: {filename} — удалено пикселей: {removed}")

print("\nОригиналы сохранены в:", backup)
