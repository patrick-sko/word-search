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
   * @param {number} startX
   * @param {number} startY
   * @param {number} endX
   * @param {number} endY
   */
  drawSearchLine(startX, startY, endX, endY) {
    const angleRadians = Math.atan2(endY - startY, endX - startX);

    const dist =
        Math.sqrt(Math.pow(startX - endX, 2) + Math.pow(startY - endY, 2))

    endX = startX + dist;
    endY = startY;


    const radiusOfLine = 15;

    const midPoint = startX + ((endX - startX) / 2);

    context.clearRect(0, 0, canvas.width, canvas.height);

    this.drawGameBoard();

    context.save();

    // context.globalAlpha = .5;

    context.lineWidth = 5.0;
    context.translate(startX, startY);
    context.rotate(angleRadians);
    context.translate(-startX, -startY);


    context.beginPath();
    context.moveTo(midPoint, startY - radiusOfLine);


    context.arcTo(
        endX + radiusOfLine, endY - radiusOfLine, endX + radiusOfLine, endY,
        radiusOfLine);

    context.arcTo(
        endX + radiusOfLine, endY + radiusOfLine, midPoint,
        startY + radiusOfLine, radiusOfLine);

    context.arcTo(
        startX - radiusOfLine, startY + radiusOfLine, startX - radiusOfLine,
        startY, radiusOfLine);

    context.arcTo(
        startX - radiusOfLine, startY - radiusOfLine, midPoint,
        startY - radiusOfLine, radiusOfLine);

    // Used to complete the rounded edge rectangle
    context.lineTo(midPoint, startY - radiusOfLine);

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