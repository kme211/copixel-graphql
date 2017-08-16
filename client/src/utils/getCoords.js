/**
 * 
 * @param {Number} blockSize 
 * @param {Event} syntheticEvent 
 * @return {Array}
 */
export default function getCoords(blockSize, syntheticEvent) {
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
