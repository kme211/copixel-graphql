/**
 * Returns an array of pixels with their coordinates and default color
 * @param {Object} options 
 * @param {Number} options.blockSizePx
 * @param {Number} options.sectionX
 * @param {Number} options.sectionY
 * @param {Number} options.widthPx
 * @param {Number} options.heightPx
 * @param {String} options.color
 * @return {Array}
 */
export function generatePixels({
  blockSizePx,
  sectionX,
  sectionY,
  widthPx,
  heightPx,
  color
}) {
  let pixels = [];
  const startX = sectionX * widthPx;
  const startY = sectionY * heightPx;
  for (let x = startX; x < widthPx + startX; x += blockSizePx) {
    for (let y = startY; y < heightPx + startY; y += blockSizePx) {
      pixels.push({ x, y, color });
    }
  }
  return pixels;
}

/**
 * Returns an object of sorted rows where the key is the y coordinate
 * @param {Array} pixelArr 
 * @return {Object}
 */
function getSortedRows(pixelArr) {
  const rows = {};
  pixelArr.forEach(pixel => {
    const y = pixel.y;
    if (rows[y]) rows[y].push(pixel);
    else rows[y] = [pixel];
  });
  for (let key in rows) {
    rows[key].sort((p1, p2) => {
      if (p1.x > p2.x) return 1;
      if (p1.x < p2.x) return -1;
      else
        throw new Error(
          `Can't have dupe x coordinate in a row: p1.y: ${p1.y}, p2.y: ${p2.y} | p1.x: ${p1.x} | p2.x ${p2.x}`
        );
    });
  }
  return rows;
}

/**
 * Returns an array of pixels with local coordinates
 * @param {Number} pixelSize 
 * @param {Array} pixels 
 * @return {Array}
 */
export function getLocalizedPixels(pixelSize, ...pixels) {
  console.log("getLocalizedPixels", pixels);
  const combinedPixels = pixels.reduce((a, b) => a.concat(b), []);
  let rows = getSortedRows(combinedPixels);

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

/**
 * Converts an object of pixels to an array of pixels
 * @param {Object} pixelsObj 
 * @param {Function} filter 
 * @return {Array}
 */
export function pixelsToArray(pixelsObj, filter, map) {
  return Object.keys(pixelsObj).map(pos => Object.assign({}, pixelsObj[pos]));
}

/**
 * Converts an array of pixels to an object of pixels
 * @param {Array} pixelsArr 
 * @param {Function} keygen - A function that takes the pixel and return the key 
 * @return {Object}
 */
export function pixelsToObject(pixelsArr, keygen) {
  let obj = {};
  for (let px of pixelsArr) {
    obj[keygen(px)] = Object.assign({}, px);
  }
  return obj;
}

/**
 * Returns a single array of neighbor pixels with a locked property that is set to true
 * @param {Array} neighbors 
 * @return {Array}
 */
export function getNeighborPixels(neighbors) {
  return neighbors
    .map(n => n.pixels.map(p => Object.assign({}, p, { locked: true })))
    .reduce((a, b) => a.concat(b), []);
}

/**
 * Returns the x and y in array of the pixel that corresponds with the mouse event
 * @param {Number} blockSize 
 * @param {SyntheticEvent} syntheticEvent 
 * @return {Array}
 */
export function getPixelCoords(blockSize, syntheticEvent) {
  const e = syntheticEvent.nativeEvent;
  let { offsetX, offsetY } = e;

  if (!offsetX && e.touches) {
    const touch = e.touches[0];
    const target = e.target;
    offsetX = touch.clientX - target.offsetParent.offsetLeft;
    offsetY = touch.clientY - target.offsetParent.offsetTop;
  }

  return [
    Math.floor(offsetX / blockSize) * blockSize,
    Math.floor(offsetY / blockSize) * blockSize
  ];
}
