from pathlib import Path
from fontTools.ttLib import TTFont

root = Path(__file__).resolve().parent.parent / "public" / "fonts"
for name in ("instrument-sans", "caveat"):
    source = root / f"{name}.ttf"
    destination = root / f"{name}.woff2"
    font = TTFont(source, recalcTimestamp=False)
    font.flavor = "woff2"
    font.save(destination)
    compressed = TTFont(destination)
    assert font.getGlyphOrder() == compressed.getGlyphOrder()
    assert font.getBestCmap() == compressed.getBestCmap()
    assert font["hmtx"].metrics == compressed["hmtx"].metrics
    assert [(axis.axisTag, axis.minValue, axis.defaultValue, axis.maxValue)
            for axis in font["fvar"].axes] == [
        (axis.axisTag, axis.minValue, axis.defaultValue, axis.maxValue)
        for axis in compressed["fvar"].axes]
    print(f"{name}: {source.stat().st_size:,} â†’ {destination.stat().st_size:,} bytes")
