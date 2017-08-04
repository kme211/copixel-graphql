export default function getLocalCoords(pixelX, pixelY, sectionX, sectionY, sectionSize) {
  return [
    pixelX - sectionX * sectionSize,
    pixelY - sectionY * sectionSize
  ];
}
