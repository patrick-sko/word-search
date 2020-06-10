goog.module('wordsearch.main')

const model = goog.require('wordsearch.model');
const view = goog.require('wordsearch.view');



class Controller {
  /** @param {!model.GameBoard} */
  constructor(wordSearchBoard) {
    /** @const {!model.GameBoard} */
    this.wordSearchBoard = wordSearchBoard;
  }

  onMouseDown() {
    var x = window.event.clientX;
    var y = window.event.clientY;

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
}


function main() {
  // window.addEventListener('resize', redraw);

  const wordSearchBoard =
      model.createGameBoard(view.getViewHeight(), view.getViewWidth());

  model.randomizeCharacters(wordSearchBoard);

  console.log(wordSearchBoard);

  console.log(wordSearchBoard.isOnBoard(500, 400));

  const controller = new Controller();

  const initView = new view.View(wordSearchBoard);

  window.addEventListener('mousedown', controller.onMouseDown);
  window.addEventListener('mousemove', controller.onMouseMove);
  window.addEventListener('mouseup', controller.onMouseUp);

  initView.init();
}

// const wordSearchBoard =
//  model.createGameBoard(view.getViewHeight(), view.getViewWidth());



main();
