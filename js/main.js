
const canvas = document.getElementById('wordSearchCanvas');
const context = canvas.getContext('2d');

/** @const {!Array<number>} */
const LETTER_FREQUENCY = [
  8.498,  9.989,  12.191, 16.445, 27.607, 29.835, 31.85,   37.944, 45.49,
  45.643, 46.935, 50.96,  53.365, 60.114, 67.621, 69.550,  69.645, 77.232,
  83.559, 92.915, 95.673, 96.651, 99.211, 99.361, 101.355, 101.432
];

function redraw() {
  let height = canvas.getBoundingClientRect().height;
  let width = canvas.getBoundingClientRect().width;

  // console.log('Height is: ' + height + ' Width is: ' + width);
}

/** @record */
class GameBoard {
  constructor() {
    /** @type {number} */
    this.startPointX;
    /** @type {number} */
    this.startPointY;
    /** @type {number} */
    this.gameHeight;
    /** @type {number} */
    this.gameWidth;
    /** @type {number} */
    this.dimensionsOfSquare;
    /** @type {!Array<!Array<!Square>>} */
    this.board;
  }
}

/** @record */
class Square {
  constructor() {
    /** @type {number} */
    this.xCoord;
    /** @type {number} */
    this.yCoord;
    /** @type {string} */
    this.character;
  }
}


/**
 * Returns a word seach game board that is created based of the dimensions
 * of the allocated screen space with each letter being allocated it's
 * own square within the board.
 * @param {number} canvasHeight
 * @param {number} canvasWidth
 * @returns {!GameBoard}
 */
function createGameBoard(canvasHeight, canvasWidth) {
  let /** @type {!GameBoard} */ gameBoard = {
    startPointX: 0,
    startPointY: 0,
    gameHeight: 10,
    gameWidth: 10,
    dimensionsOfSquare: 0,
    board: []
  }

  let heightScaler = canvasHeight / gameBoard.gameHeight;
  let widthScaler = canvasWidth / gameBoard.gameWidth;

  gameBoard.dimensionsOfSquare =
      widthScaler > heightScaler ? heightScaler : widthScaler

  let middlePoint = canvasWidth / 2 -
      (gameBoard.dimensionsOfSquare * gameBoard.gameWidth / 2);

  gameBoard.startPointX = middlePoint;

  let currX = gameBoard.startPointX;
  let currY = gameBoard.startPointY;

  for (let i = 0; i < gameBoard.gameHeight; ++i) {
    let rowOfSquares = [];
    for (let j = 0; j < gameBoard.gameWidth; ++j) {
      let square = {xCoord: currX, yCoord: currY, character: '-'};

      rowOfSquares.push(square);

      currX += gameBoard.dimensionsOfSquare;
    }
    gameBoard.board.push(rowOfSquares);
    currX = gameBoard.startPointX;
    currY += gameBoard.dimensionsOfSquare;
  }

  return gameBoard;
}

/**
 * Converts ranNumber from a float to a character in the
 * english alphabet based on what interval it is within the charFrequency.
 * @param {number} ranNumber a random float between 0-101.432
 * @return {string}
 */
function getCharater(ranNumber) {
  let index = 0;

  for (let i = 0; i < 26; ++i) {
    if (ranNumber < LETTER_FREQUENCY[i]) {
      index = i;
      break;
    }
  }

  return String.fromCharCode(97 + index)
}

/**
 * Based on a weighted random distribution, it populates the wordSearchBoard
 * with random letters.
 * @param {!GameBoard}
 *     wordSearchBoard
 */
function randomizeCharacters(wordSearchBoard) {
  for (const row of wordSearchBoard.board) {
    for (const /** @const {!Square} */ square of row) {
      let randomNum = Math.random() * 101.432;
      square.character = getCharater(randomNum);
    }
  }
}

/**
 * Draws the game board onto the screen with the canvas api.
 * @param {!GameBoard} wordSearchBoard
 */
function drawGameBoard(wordSearchBoard) {
  context.textAlign = 'center'
  context.font = '30px Arial';
  for (const row of wordSearchBoard.board) {
    for (const /** @const {!Square} */ square of row) {
      context.fillStyle = 'white';
      context.fillRect(
          square.xCoord, square.yCoord, wordSearchBoard.dimensionsOfSquare,
          wordSearchBoard.dimensionsOfSquare);

      context.fillStyle = 'black';
      context.fillText(
          square.character,
          square.xCoord + wordSearchBoard.dimensionsOfSquare / 2,
          square.yCoord + wordSearchBoard.dimensionsOfSquare / 2 + 10);
    }
  }
}


function main() {
  window.addEventListener('resize', redraw);

  let height = canvas.getBoundingClientRect().height;
  let width = canvas.getBoundingClientRect().width;

  let /** @type {!GameBoard} */ wordSearchBoard =
      createGameBoard(height, width);
  randomizeCharacters(wordSearchBoard);

  console.log(wordSearchBoard);

  drawGameBoard(wordSearchBoard);
}

main();
