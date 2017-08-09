/**
 * @param  {number} drawingWidth - width in sections of drawing
 * @param  {number} drawingHeight - height in sections of drawing
 * @param {number} containerHeight - height of the drawing container
 * @param {number} marginPx - margin of element inside container
 */
function getOptimalCellSize(drawingWidth, drawingHeight, container, marginPx) {
  const MAX_HEIGHT = container ? container.offsetHeight : 0;
  const MAX_INNER_WIDTH = 800; // This value comes from the max-width of the Inner component
  const margin = marginPx * 2;

  const optimalCellWidth = window.innerWidth >= MAX_INNER_WIDTH
    ? MAX_INNER_WIDTH / drawingWidth
    : window.innerWidth / drawingWidth;

  const optimalCellHeight = drawingHeight * optimalCellWidth > MAX_HEIGHT
    ? MAX_HEIGHT / drawingHeight
    : optimalCellWidth;

  const size = Math.min(
    optimalCellWidth - margin / drawingWidth,
    optimalCellHeight - margin / drawingHeight
  );
  return Math.max(0, size);
}

export default getOptimalCellSize;
