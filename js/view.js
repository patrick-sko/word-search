goog.module('wordsearch.view');

const model = goog.require('wordsearch.model');
// const controller = goog.require('wordsearch.main');

const canvas = document.getElementById('wordSearchCanvas');
const context = canvas.getContext('2d');


function getViewHeight() {
  return canvas.getBoundingClientRect().height;
}

function getViewWidth() {
  return canvas.getBoundingClientRect().width;
}

class View {
  /** @param {!model.GameBoard} wordSearchBoard */
  constructor(wordSearchBoard) {
    /** @const {!model.GameBoard} */
    this.wordSearchBoard = wordSearchBoard;
    /** @type {boolean} */
    this.drawLineFlag = false;
    /** @type {number} */
    this.globalX = 0;
    /** @type {number} */
    this.globalY = 0;
  }


  /*
   * Draws the game board onto the screen with the canvas api.
   * @param {!model.GameBoard} wordSearchBoard
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

  drawSearchLine(startX, startY, endX, endY) {
    const angleRadians = Math.atan2(endY - startY, endX - startX);

    const dist =
        Math.sqrt(Math.pow(startX - endX, 2) + Math.pow(startY - endY, 2))
    endX = startX + dist;
    endY = startY;


    const radiusOfLine = 15;

    const midPoint = startX + ((endX - startX) / 2);

    context.save();
    context.globalAlpha = .5;
    context.fillStyle = 'orange';
    context.lineWidth = 5.0;
    context.translate(startX, startY);
    context.rotate(angleRadians);
    context.translate(-startX, -startY);


    context.beginPath();
    context.moveTo(midPoint, startY - radiusOfLine);


    context.arcTo(
        endX + radiusOfLine, endY - radiusOfLine, endX + radiusOfLine, endY,
        radiusOfLine);  // Curve 1

    context.arcTo(
        endX + radiusOfLine, endY + radiusOfLine, midPoint,
        startY + radiusOfLine, radiusOfLine);

    context.arcTo(
        startX - radiusOfLine, startY + radiusOfLine, startX - radiusOfLine,
        startY, radiusOfLine);

    context.arcTo(
        startX - radiusOfLine, startY - radiusOfLine, midPoint,
        startY - radiusOfLine, radiusOfLine);  // Curve 4

    // Used to complete the rounded edge rectangle
    context.lineTo(midPoint, startY - radiusOfLine);

    context.stroke();
    context.restore();
  }

  foo() {
    if (this.wordSearchBoard.isOnBoard(500, 40)) {
      console.log('THIS SHOULD PRINT');
    } else {
      console.log('THIS SHOULD NOT PRINT');
    }
  }
  /*
    onMouseDown() {
      var x = window.event.clientX;  // Get the horizontal coordinate
      var y = window.event.clientY;  // Get the vertical coordinate

      if (this.drawLineFlag === false) {
        console.log('THIS SHOULD PRINT');
      } else {
        console.log('THIS SHOULD NOT PRINT');
      }

      if (this.wordSearchBoard.isOnBoard(x, y)) {
        this.drawLineFlag = true;

        const square = this.wordSearchBoard.findSquare(x, y);
        this.globalX =
            square.xCoord + (this.wordSearchBoard.dimensionsOfSquare) / 2;
        this.globalY =
            square.yCoord + (this.wordSearchBoard.dimensionsOfSquare) / 2;

        context.strokeStyle = 'navy';
        context.lineWidth = 3.0;
        context.beginPath();
        context.moveTo(this.globalX, this.globalY)

        // square.colour = 'orange';

        console.log('Mouse down at: X coords: ' + x + ', Y coords: ' + y);
        context.clearRect(0, 0, canvas.width, canvas.height);

        this.drawGameBoard();

        console.log('Hit!');
      } else {
        console.log('Miss!');
      }
    }


    onMouseUp() {
      var x = window.event.clientX;  // Get the horizontal coordinate
      var y = window.event.clientY;  // Get the vertical coordinate



      if (this.drawLineFlag) {  // TODO - Determine what to do when mouseDown
                                // occures
                                // on
        // Board but mouseUp occures outside of board;
        const square = this.wordSearchBoard.findSquare(x, y);
        const endX =
            square.xCoord + (this.wordSearchBoard.dimensionsOfSquare) / 2;
        const endY =
            square.yCoord + (this.wordSearchBoard.dimensionsOfSquare) / 2;
        console.log(this.wordSearchBoard.getSquaresFromLine(
            this.globalX, this.globalY, endX, endY));

        this.drawLineFlag = false;
        context.clearRect(0, 0, canvas.width, canvas.height);

        this.drawGameBoard();
        this.drawSearchLine(this.globalX, this.globalY, endX, endY);

        console.log(
            'Distance from start to end is: ',
            model.distance(
                new model.Point(this.globalX, this.globalY),
                new model.Point(endX, endY)));
      }
    }

    onMouseMove() {
      var x = window.event.clientX;  // Get the horizontal coordinate
      var y = window.event.clientY;  // Get the vertical coordinate

      if (this.drawLineFlag) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        this.drawGameBoard();
        this.drawSearchLine(this.globalX, this.globalY, x, y)
      }
    }
    */

  init() {
    this.drawGameBoard();
    // this.foo();
  }
}



exports = {
  View,
  getViewHeight,
  getViewWidth
};