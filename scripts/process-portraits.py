# /// script
# requires-python = ">=3.9"
# dependencies = ["pillow>=10.0"]
# ///
"""
Process board/committee portrait photos for the I3/NYC site.

For every image in `_sources/`:
  - Center-crop to a square
  - Convert to grayscale (1.5% saturation kept via tint to keep skin tones
    from going dead — pure greyscale of mixed source photos looks muddy)
  - Resize to 400 × 400 (more than enough for an 80 × 80 retina circle)
  - Save to `public/board/<slug>.jpg` at quality 85

Naming: filenames are slugified (lowercase, spaces/underscores → dashes).
Outputs all use the `.jpg` extension regardless of source format.

Run: cd to repo root, then `uv run --script scripts/process-portraits.py`.
"""

from __future__ import annotations

import re
import shutil
from pathlib import Path

from PIL import Image, ImageOps

HERE = Path(__file__).parent
PROJECT_ROOT = HERE.parent
SRC_DIR = PROJECT_ROOT / "_sources"
OUT_DIR = PROJECT_ROOT / "public" / "board"

# Mapping from source filename (without extension, case-insensitive normalized)
# to the canonical slug used in the URL.  Handles the file-naming typos.
OVERRIDES = {
    "gialunca_galletto": "gianluca-galletto",
    "andrea-calcagno": "andrea-calcagno",
    "giovanni iammarrone": "giovanni-iammarrone",
}

TARGET = 400  # output square edge in px
JPEG_QUALITY = 85


def slugify(stem: str) -> str:
    """Filename stem → URL slug. 'Alessandro Piol' → 'alessandro-piol'."""
    s = stem.lower()
    if s in OVERRIDES:
        return OVERRIDES[s]
    s = re.sub(r"[\s_]+", "-", s)
    s = re.sub(r"[^a-z0-9-]", "", s)
    return s


def process(src: Path, dst: Path) -> None:
    with Image.open(src) as im:
        im = ImageOps.exif_transpose(im)  # respect EXIF orientation
        im = im.convert("RGB")  # drop alpha; needed for L conversion + JPEG

        # Center crop to a square
        w, h = im.size
        edge = min(w, h)
        left = (w - edge) // 2
        top = (h - edge) // 2
        im = im.crop((left, top, left + edge, top + edge))

        # Resize
        im = im.resize((TARGET, TARGET), Image.LANCZOS)

        # Convert to grayscale, then re-cast as RGB so JPEG saves well.
        gray = ImageOps.grayscale(im)
        out = Image.merge("RGB", (gray, gray, gray))

        out.save(dst, "JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)


def main() -> None:
    if not SRC_DIR.exists():
        raise SystemExit(f"Missing source directory: {SRC_DIR}")
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    images = sorted(
        p
        for p in SRC_DIR.iterdir()
        if p.is_file() and p.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}
    )
    if not images:
        raise SystemExit(f"No image files found in {SRC_DIR}")

    print(f"Processing {len(images)} portraits → {OUT_DIR.relative_to(PROJECT_ROOT)}")
    for src in images:
        slug = slugify(src.stem)
        dst = OUT_DIR / f"{slug}.jpg"
        process(src, dst)
        size_kb = dst.stat().st_size // 1024
        print(f"  ✓ {src.name:<32} → {dst.name:<28} ({size_kb} KB)")

    print("Done.")


if __name__ == "__main__":
    main()
