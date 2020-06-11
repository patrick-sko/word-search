goog.module('wordsearch.controller');

const model = goog.require('wordsearch.model');
const view = goog.require('wordsearch.view');

/**
 * The controller bridges the gap between the model and view by handling input
 * passed from the view and make the appropriate calls to update the model. It
 * also makes call to updae the view when the model changes.
 */
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
    /** @type {!model.Point} */
    this.startPoint;
  }

  /**
   * Function to execute when user pressed down on mouse
   */
  onMouseDown(event) {
    const point = new model.Point(event.clientX, event.clientY);


    if (this.wordSearchBoard.isOnBoard(point)) {
      this.drawLineFlag = true;

      const square = this.wordSearchBoard.findSquare(point);

      this.startPoint = new model.Point(
          square.xCoord + (this.wordSearchBoard.dimensionsOfSquare) / 2,
          square.yCoord + (this.wordSearchBoard.dimensionsOfSquare) / 2);

      console.log('Hit!');
    } else {
      console.log('Miss!');
    }
  }

  /**
   * Function to execute when user lifts off mouse
   */
  onMouseUp(event) {
    const point = new model.Point(event.clientX, event.clientY)

    if (this.drawLineFlag) {  // TODO - Determine what to do when mouseDown
      // occures off the board
      this.drawLineFlag = false
      const square = this.wordSearchBoard.findSquare(point);

      const endPoint = new model.Point(
          square.xCoord + (this.wordSearchBoard.dimensionsOfSquare) / 2,
          square.yCoord + (this.wordSearchBoard.dimensionsOfSquare) / 2);

      if (endPoint.equals(this.startPoint)) {
        return;
      }


      const targetSquares =
          this.wordSearchBoard.getSquaresFromLine(this.startPoint, endPoint);

      for (const square of targetSquares) {
        square.colour = 'orange';
      }

      console.log(targetSquares);

      ;

      this.myView.drawSearchLine(this.startPoint, endPoint);

      console.log(
          'Distance from start to end is: ',
          this.startPoint.distance(endPoint));
    }
  }

  /**
   * Function to execute when user moves mouse while being pressed
   */
  onMouseMove(event) {
    const point = new model.Point(event.clientX, event.clientY)

    if (this.drawLineFlag) {
      this.myView.drawSearchLine(this.startPoint, point);
    }
  }
}


function playGame() {
  const wordSearchBoard =
      model.createGameBoard(view.getViewHeight(), view.getViewWidth());

  console.log(wordSearchBoard);

  const myView = new view.View(wordSearchBoard);
  const controller = new Controller(wordSearchBoard, myView);


  window.addEventListener('mousedown', (event) => {
    controller.onMouseDown(event);
  });
  window.addEventListener('mousemove', (event) => {
    controller.onMouseMove(event);
  });
  window.addEventListener('mouseup', (event) => {
    controller.onMouseUp(event);
  });

  myView.init();
}

exports = {playGame};