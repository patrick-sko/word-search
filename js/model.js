goog.module('wordsearch.model');

/** @const {!Array<number>} */
const LETTER_FREQUENCY = [
  8.498,  9.989,  12.191, 16.445, 27.607, 29.835, 31.85,   37.944, 45.49,
  45.643, 46.935, 50.96,  53.365, 60.114, 67.621, 69.550,  69.645, 77.232,
  83.559, 92.915, 95.673, 96.651, 99.211, 99.361, 101.355, 101.432
];

/** @const {!Array<String>} */
const WORDS = ['patrick'];

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

function subtract(a, b) {
  return new Point(a.x - b.x, a.y - b.y);
}

function dot(a, b) {
  return a.x * b.x + a.y + b.y;
}

function distance(PointA, PointB) {
  return Math.sqrt(
      Math.pow(PointA.x - PointB.x, 2) + Math.pow(PointA.y - PointB.y, 2))
}

function getNearestPointOnLine(startPoint, endPoint, targetPoint) {
  let P0 = new Point(startPoint.x, startPoint.y);
  let P1 = new Point(endPoint.x, endPoint.y);
  let M = new Point(targetPoint.x, targetPoint.y);

  let v = subtract(P1, P0);

  let u = subtract(M, P0);

  let s = dot(u, v) / dot(v, v);

  if (s < 0) {
    return P0;
  } else if (s > 1) {
    return P1;
  } else {
    let I = P0;
    let w = new Point(s * v.x, s * v.y);
    P0 = new Point(I.x + w.x, I.y + w.y);
    return P0;
  }
}

class GameBoard {
  constructor(a, b, c, d, e, f) {
    /** @type {number} */
    this.startPointX = a;
    /** @type {number} */
    this.startPointY = b;
    /** @type {number} */
    this.gameHeight = c;
    /** @type {number} */
    this.gameWidth = d;
    /** @type {number} */
    this.dimensionsOfSquare = e;
    /** @type {!Array<!Array<!Square>>} */
    this.board = f;
  }

  findSquare(x, y) {
    for (const row of this.board) {
      for (const square of row) {
        let widthOfSquare = square.xCoord + this.dimensionsOfSquare;
        let heightOfSquare = square.yCoord + this.dimensionsOfSquare;
        if (x < widthOfSquare && y < heightOfSquare && x > square.xCoord &&
            y > square.yCoord) {
          return square;
        }
      }
    }
    return null;  // Maybe change to throw error
  }

  isOnBoard(x, y) {
    const widthOfBoard =
        this.startPointX + this.gameWidth * this.dimensionsOfSquare;
    const heightOfBoard =
        this.startPointY + this.gameHeight * this.dimensionsOfSquare;

    if (x < widthOfBoard && y < heightOfBoard && x > this.startPointX &&
        y > this.startPointY) {
      return true;
    } else {
      return false;
    }
  }

  getSquaresFromLine(startX, startY, endX, endY) {
    let result = [];


    const startPoint = new Point(startX, startY);
    const endPoint = new Point(endX, endY);

    for (const row of this.board) {
      for (const square of row) {
        let temp = new Point(
            square.xCoord + this.dimensionsOfSquare / 2,
            square.yCoord + this.dimensionsOfSquare / 2);
        const closest = getNearestPointOnLine(startPoint, endPoint, temp);
        if (distance(temp, closest) < 2) {
          result.push(square);
        }
      }
    }

    return result;
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
    this.colour;
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
  const gameBoard = new GameBoard(0, 0, 10, 10, 0, []);

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
      const square =
          {xCoord: currX, yCoord: currY, colour: 'white', character: '-'};

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
  Square,
  Point,
  distance
};