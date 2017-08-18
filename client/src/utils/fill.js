export default function fill(pixels, position, newColor, blockSize) {
  const newPixels = Object.assign({}, pixels);
  const oldColor = pixels[position].color;
  const [x, y] = position.split(",").map(parseFloat);

  function grow(x, y) {
    const pos = `${x},${y}`;
    if (
      newPixels[pos] &&
      !newPixels[pos].locked &&
      newPixels[pos].color === oldColor &&
      newPixels[pos].color !== newColor
    ) {
      newPixels[pos] = Object.assign({}, newPixels[pos], { color: newColor });
      grow(x, y - blockSize);
      grow(x + blockSize, y);
      grow(x, y + blockSize);
      grow(x - blockSize, y);
    }
  }

  grow(x, y);
  return newPixels;
}
