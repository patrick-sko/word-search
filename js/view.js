goog.module('wordsearch.view');

const model = goog.require('wordsearch.model');

const canvas = document.getElementById('wordSearchCanvas');
const context = canvas.getContext('2d');

/**
 * Returns the height of the view
 * @returns {number}
 */
function getViewHeight() {
  return canvas.getBoundingClientRect().height;
}

/**
 * Returns the width of the view
 * @returns {number}
 */
function getViewWidth() {
  return canvas.getBoundingClientRect().width;
}

/**
 * The view displays the wordSearchBoard with the canvas api. It does not
 * manipulate the data of the board.
 */
class View {
  /** @param {!model.GameBoard} wordSearchBoard */
  constructor(wordSearchBoard) {
    /** @const {!model.GameBoard} */
    this.wordSearchBoard = wordSearchBoard;
  }

  /*
   * Draws the game board onto the screen with the canvas api.
   */
  drawGameBoard() {
    context.textAlign = 'center';
    context.font = '30px Arial';
    for (const row of this.wordSearchBoard.board) {
      for (const square of row) {
        context.fillStyle = square.colour;
        context.fillRect(
            square.xCoord, square.yCoord,
            this.wordSearchBoard.dimensionsOfSquare,
            this.wordSearchBoard.dimensionsOfSquare);

        context.fillStyle = 'black';
        context.fillText(
            square.character,
            square.xCoord + this.wordSearchBoard.dimensionsOfSquare / 2,
            square.yCoord + this.wordSearchBoard.dimensionsOfSquare / 2 + 10);
      }
    }
  }

  /**
   * Draws a line to indicate the current selection within the game board
   * between the two points
   * @param {!model.Point} startPoint
   * @param {!model.Point} tempEndPoint
   */
  drawSearchLine(startPoint, tempEndPoint) {
    const angleRadians = Math.atan2(
        tempEndPoint.y - startPoint.y, tempEndPoint.x - startPoint.x);

    const dist = Math.sqrt(
        Math.pow(startPoint.x - tempEndPoint.x, 2) +
        Math.pow(startPoint.y - tempEndPoint.y, 2))

    // We re-adjust the endPoint so that both points lie on a horizantol line.
    // This makes the math of determining the midpoint easier, and allows us to
    // rotate the rectangle with respect to the real endpoint.
    const endPoint = new model.Point(startPoint.x + dist, startPoint.y);

    const radiusOfLine = 15;

    const midPoint = startPoint.x + ((endPoint.x - startPoint.x) / 2);

    context.clearRect(0, 0, canvas.width, canvas.height);

    // TODO - Consider the implications of re-drawing the gameboard everytime
    // the line is drawn. Determine performance if size is for example > 1000.
    // If impactful, determine a new way to draw to the screen more efficiently.
    this.drawGameBoard();

    context.save();

    // context.globalAlpha = .5;

    context.lineWidth = 5.0;
    context.translate(startPoint.x, startPoint.y);
    context.rotate(angleRadians);
    context.translate(-startPoint.x, -startPoint.y);


    context.beginPath();
    context.moveTo(midPoint, startPoint.y - radiusOfLine);


    context.arcTo(
        endPoint.x + radiusOfLine, endPoint.y - radiusOfLine,
        endPoint.x + radiusOfLine, endPoint.y, radiusOfLine);

    context.arcTo(
        endPoint.x + radiusOfLine, endPoint.y + radiusOfLine, midPoint,
        startPoint.y + radiusOfLine, radiusOfLine);

    context.arcTo(
        startPoint.x - radiusOfLine, startPoint.y + radiusOfLine,
        startPoint.x - radiusOfLine, startPoint.y, radiusOfLine);

    context.arcTo(
        startPoint.x - radiusOfLine, startPoint.y - radiusOfLine, midPoint,
        startPoint.y - radiusOfLine, radiusOfLine);

    // Used to complete the rounded edge rectangle
    context.lineTo(midPoint, startPoint.y - radiusOfLine);

    context.stroke();
    context.restore();
  }

  /**
   * Initiate the view and draw the game board
   */
  init() {
    this.drawGameBoard();
  }
}



exports = {
  View,
  getViewHeight,
  getViewWidth
};