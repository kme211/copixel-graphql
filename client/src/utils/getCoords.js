export default function getCoords(sectionX, sectionY, blockSize, sectionSize, syntheticEvent) {
  const e = syntheticEvent.nativeEvent;
  let { offsetX, offsetY } = e;

  if (!offsetX && e.touches) {
    const touch = e.touches[0];
    const target = e.target;
    offsetX = touch.clientX - target.offsetParent.offsetLeft;
    offsetY = touch.clientY - target.offsetParent.offsetTop;
  }

  return [
    Math.floor(offsetX / blockSize) * blockSize +
      sectionX * sectionSize,
    Math.floor(offsetY / blockSize) * blockSize +
      sectionY * sectionSize
  ];
}