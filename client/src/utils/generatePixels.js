export default function generatePixels({
  blockSizePx,
  sectionX,
  sectionY,
  widthPx,
  heightPx,
  color
}) {
  let pixels = {};
  const startX = sectionX * widthPx;
  const startY = sectionY * heightPx;
  for (let x = startX; x < widthPx + startX; x += blockSizePx) {
    for (let y = startY; y < heightPx + startY; y += blockSizePx) {
      pixels[`${x},${y}`] = color;
    }
  }
  return pixels;
}
