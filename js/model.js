goog.module('wordsearch.model');

/** @const {!Array<number>} */
const LETTER_FREQUENCY = [
  8.498,  9.989,  12.191, 16.445, 27.607, 29.835, 31.85,   37.944, 45.49,
  45.643, 46.935, 50.96,  53.365, 60.114, 67.621, 69.550,  69.645, 77.232,
  83.559, 92.915, 95.673, 96.651, 99.211, 99.361, 101.355, 101.432
];

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
  const gameBoard = {
    startPointX: 0,
    startPointY: 0,
    gameHeight: 10,
    gameWidth: 10,
    dimensionsOfSquare: 0,
    board: []
  };

  const heightScaler = canvasHeight / gameBoard.gameHeight;
  const widthScaler = canvasWidth / gameBoard.gameWidth;

  gameBoard.dimensionsOfSquare =
      widthScaler > heightScaler ? heightScaler : widthScaler

  const middlePoint = canvasWidth / 2 -
      (gameBoard.dimensionsOfSquare * gameBoard.gameWidth / 2);

  gameBoard.startPointX = middlePoint;

  let currX = gameBoard.startPointX;
  let currY = gameBoard.startPointY;

  for (let i = 0; i < gameBoard.gameHeight; ++i) {
    const rowOfSquares = [];
    for (let j = 0; j < gameBoard.gameWidth; ++j) {
      const square = {xCoord: currX, yCoord: currY, character: '-'};

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
    for (const square of row) {
      const randomNum = Math.random() * 101.432;
      square.character = getCharater(randomNum);
    }
  }
}


exports = {
  createGameBoard,
  randomizeCharacters,
  GameBoard,
  Square
};