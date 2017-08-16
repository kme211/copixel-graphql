export default function getLocalCoords(
  pixelX,
  pixelY,
  sectionX,
  sectionY,
  sectionWidth,
  sectionHeight
) {
  return [pixelX - sectionX * sectionWidth, pixelY - sectionY * sectionHeight];
}

export function getLocalizedPixels(pixelSize, ...pixels) {
  let rows = {};
  const combinedPixels = pixels.reduce((a, b) => a.concat(b), []);

  combinedPixels.forEach(pixel => {
    const y = pixel.y;
    if (rows[y]) rows[y].push(pixel);
    else rows[y] = [pixel];
  });

  for (let key in rows) {
    rows[key].sort((p1, p2) => {
      if (p1.x > p2.x) return 1;
      if (p1.x < p2.x) return -1;
      else throw new Error("Can't have dupe x coordinate in a row");
    });
  }

  let localizedPixels = [];
  let localX = 0;
  let localY = 0;
  for (let y in rows) {
    const row = rows[y];
    for (let pixel of row) {
      const localizedPixel = {
        x: pixel.x,
        y: pixel.y,
        localX: localX * pixelSize,
        localY: localY * pixelSize,
        color: pixel.color
      };
      if (pixel.locked) localizedPixel.locked = true;
      localizedPixels.push(localizedPixel);

      localX++;
    }
    localX = 0;
    localY++;
  }
  return localizedPixels;
}
