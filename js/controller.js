goog.module('wordsearch.controller');

const model = goog.require('wordsearch.model');
const view = goog.require('wordsearch.view');

class Controller {
  /** @param {!model.GameBoard} wordSearchBoard */
  /** @param {!view.View} myView */
  constructor(wordSearchBoard, myView) {
    /** @const {!model.GameBoard} */
    this.wordSearchBoard = wordSearchBoard;
    /** @const {!view.View} */
    this.myView = myView;
    /** @type {boolean} */
    this.drawLineFlag = false;
    /** @type {number} */
    this.startX = 0;
    /** @type {number} */
    this.startY = 0;
  }

  /**
   * Function to execute when user pressed down on mouse
   */
  onMouseDown() {
    const x = window.event.clientX;
    const y = window.event.clientY;

    if (this.wordSearchBoard.isOnBoard(new model.Point(x, y))) {
      this.drawLineFlag = true;

      const square = this.wordSearchBoard.findSquare(new model.Point(x, y));
      this.startX =
          square.xCoord + (this.wordSearchBoard.dimensionsOfSquare) / 2;
      this.startY =
          square.yCoord + (this.wordSearchBoard.dimensionsOfSquare) / 2;

      this.myView.drawSearchLine(
          this.startX, this.startY, this.startX, this.startY);

      console.log('Hit!');
    } else {
      console.log('Miss!');
    }
  }

  /**
   * Function to execute when user lifts off mouse
   */
  onMouseUp() {
    const x = window.event.clientX;
    const y = window.event.clientY;

    if (this.drawLineFlag) {  // TODO - Determine what to do when mouseDown
                              // occures off the board
      const square = this.wordSearchBoard.findSquare(new model.Point(x, y));
      const endX =
          square.xCoord + (this.wordSearchBoard.dimensionsOfSquare) / 2;
      const endY =
          square.yCoord + (this.wordSearchBoard.dimensionsOfSquare) / 2;

      console.log(this.wordSearchBoard.getSquaresFromLine(
          new model.Point(this.startX, this.startY),
          new model.Point(endX, endY)));

      this.drawLineFlag = false;

      this.myView.drawSearchLine(this.startX, this.startY, endX, endY);

      console.log(
          'Distance from start to end is: ',
          new model.Point(this.startX, this.startY)
              .distance(new model.Point(endX, endY)));
    }
  }

  /**
   * Function to execute when user moves mouse while being pressed
   */
  onMouseMove() {
    const x = window.event.clientX;
    const y = window.event.clientY;

    if (this.drawLineFlag) {
      this.myView.drawSearchLine(this.startX, this.startY, x, y);
    }
  }
}


function playGame() {
  const wordSearchBoard =
      model.createGameBoard(view.getViewHeight(), view.getViewWidth());

  console.log(wordSearchBoard);

  const myView = new view.View(wordSearchBoard);
  const controller = new Controller(wordSearchBoard, myView);


  window.addEventListener('mousedown', () => {
    controller.onMouseDown();
  });
  window.addEventListener('mousemove', () => {
    controller.onMouseMove();
  });
  window.addEventListener('mouseup', () => {
    controller.onMouseUp();
  });

  myView.init();
}

exports = {playGame};