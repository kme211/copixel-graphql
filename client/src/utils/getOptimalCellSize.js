/**
 * @param  {number} drawingWidth - width in sections of drawing
 * @param  {number} drawingHeight - height in sections of drawing
 */
function getOptimalCellSize(drawingWidth, drawingHeight) {
  const MAX_HEIGHT = window.innerHeight * 0.45; // Height of the grid should not exceed 45% of window height
  const MAX_INNER_WIDTH = 800; // This value comes from the max-width of the Inner component
  const optimalCellWidth =
    window.innerWidth >= MAX_INNER_WIDTH
      ? MAX_INNER_WIDTH / drawingWidth
      : window.innerWidth / drawingWidth;
  const optimalCellHeight =
    drawingHeight * optimalCellWidth > MAX_HEIGHT
      ? MAX_HEIGHT / drawingHeight
      : optimalCellWidth;
  return Math.min(optimalCellWidth, optimalCellHeight);
}

export default getOptimalCellSize;
