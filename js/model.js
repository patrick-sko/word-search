goog.module('wordsearch.model');

/** @const {!Array<number>} */
const LETTER_FREQUENCY = [
  8.498,  9.989,  12.191, 16.445, 27.607, 29.835, 31.85,   37.944, 45.49,
  45.643, 46.935, 50.96,  53.365, 60.114, 67.621, 69.550,  69.645, 77.232,
  83.559, 92.915, 95.673, 96.651, 99.211, 99.361, 101.355, 101.432
];

/** @const {!Array<String>} */
const WORDS = ['patrick'];

/**
 * A 2D point in euclidean space
 */
class Point {
  /**
   * @param {number} x
   * @param {number} y
   */
  constructor(x, y) {
    /** @const {number} */
    this.x = x;
    /** @const {number} */
    this.y = y;
  }

  /**
   * Returns the difference between two points
   * @param {!Point} pointB
   * @return {!Point}
   */
  subtract(pointB) {
    return new Point(this.x - pointB.x, this.y - pointB.y);
  }

  /**
   * Returns the dot product of two points
   * @param {!Point} pointB
   * @return {number}
   */
  dot(pointB) {
    return this.x * pointB.x + this.y * pointB.y;
  }

  /**
   * Returns the euclidean distance between two points
   * @param {!Point} PointB
   * @return {number}
   */
  distance(PointB) {
    return Math.sqrt(
        Math.pow(this.x - PointB.x, 2) + Math.pow(this.y - PointB.y, 2))
  }

  /**
   * Checks if two points are equal
   * @param {!Point} PointB
   * @return {boolean}
   */
  equals(PointB) {
    return this.x === PointB.x && this.y === PointB.y;
  }

  within(pointB, epsilon) {
    return Math.abs(this.x - pointB.x) <= epsilon &&
        Math.abs(this.y - pointB.y) <= epsilon;
  }
}

/**
 * Gets the project of targetPoint on the line specified between startPoint and
 * endPoint. Based from following algorithm:
 * https://en.wikibooks.org/wiki/Linear_Algebra/Orthogonal_Projection_Onto_a_Line
 * @param {!Point} startPoint
 * @param {!Point} endPoint
 * @param {!Point} targetPoint
 * @return {!Point}
 */
function getNearestPointOnLine(startPoint, endPoint, targetPoint) {
  let v = endPoint.subtract(startPoint);

  let u = targetPoint.subtract(startPoint);

  let s = u.dot(v) / v.dot(v);

  if (s < 0) {
    return endPoint;
  } else if (s > 1) {
    return startPoint;
  } else {
    let I = startPoint;
    let w = new Point(s * v.x, s * v.y);
    const result = new Point(I.x + w.x, I.y + w.y);
    return result;
  }
}

/**
 * The data that represents the game board. It has no knowledge of the view
 * or controller.
 */
class GameBoard {
  /**
   * @param {{startPointX: number, startPointY: number, gameHeight: number,
   *     gameWidth: number, dimensionsOfSquare: number}} gameDimensions
   * @param {!Array<!Array<!Square>>} board
   */
  constructor(gameDimensions, board) {
    /** @type {number} */
    this.startPointX = gameDimensions.startPointX;
    /** @type {number} */
    this.startPointY = gameDimensions.startPointY;
    /** @type {number} */
    this.gameHeight = gameDimensions.gameHeight;
    /** @type {number} */
    this.gameWidth = gameDimensions.gameWidth;
    /** @type {number} */
    this.dimensionsOfSquare = gameDimensions.dimensionsOfSquare;
    /** @type {!Array<!Array<!Square>>} */
    this.board = board;
  }

  /**
   * Returns the square that contains the coords x, y
   * @param {!Point} point
   * @return {?Square}
   */
  findSquare(point) {
    const yIndex =
        Math.floor((point.y - this.startPointY) / this.dimensionsOfSquare);
    const xIndex =
        Math.floor((point.x - this.startPointX) / this.dimensionsOfSquare);

    return this.board[yIndex][xIndex];  // TODO - handle case where
                                        // point is off the board
  }


  /**
   * Determines if the point lies within the game board
   * @param {!Point} point
   * @return {boolean}
   */
  isOnBoard(point) {
    const widthOfBoard =
        this.startPointX + this.gameWidth * this.dimensionsOfSquare;
    const heightOfBoard =
        this.startPointY + this.gameHeight * this.dimensionsOfSquare;

    return point.x < widthOfBoard && point.y < heightOfBoard &&
        point.x > this.startPointX && point.y > this.startPointY
  }

  /**
   * Gets all the squares that lie within a distance of 2 pixels from the line
   * created by the parameters to the center of each square
   * @param {!Point} startPoint
   * @param {!Point} endPoint
   * @return {!Array<!Square>}
   */
  getSquaresFromLine(startPoint, endPoint) {
    const result = [];

    let distanceBetweenChar = this.dimensionsOfSquare;

    let horizantalScaler = null;
    let verticalScaler = null;

    if (isLineDiagonal(startPoint, endPoint)) {
      distanceBetweenChar = Math.sqrt(Math.pow(this.dimensionsOfSquare, 2) * 2);
      horizantalScaler = distanceBetweenChar / Math.sqrt(2);
      verticalScaler = horizantalScaler;
    } else if (isLineVertical(startPoint, endPoint)) {
      horizantalScaler = 0;
      verticalScaler = distanceBetweenChar;
    } else {
      horizantalScaler = distanceBetweenChar;
      verticalScaler = 0;
    }


    if (startPoint.y > endPoint.y) {
      verticalScaler *= -1;
    }

    if (startPoint.x > endPoint.x) {
      horizantalScaler *= -1;
    }

    const startSquare = this.findSquare(startPoint);
    startPoint = new Point(
        startSquare.xCoord + this.dimensionsOfSquare / 2,
        startSquare.yCoord + this.dimensionsOfSquare / 2);

    const endSquare = this.findSquare(endPoint);
    endPoint = new Point(
        endSquare.xCoord + this.dimensionsOfSquare / 2,
        endSquare.yCoord + this.dimensionsOfSquare / 2);


    const expectedNumberOfLetters =
        (startPoint.distance(endPoint) / distanceBetweenChar + 1);

    console.log('Expected # of letters: ', expectedNumberOfLetters)

    if (Math.abs(
            expectedNumberOfLetters - Math.round(expectedNumberOfLetters)) >
        0.001) {
      return result;  // Early exit. Expected letters should be near exact if
                      // diagonol line is consistent with distanceBetweenChar.
    }

    let expectedPoint = new Point(startPoint.x, startPoint.y);

    for (let i = 0; i < Math.round(expectedNumberOfLetters); ++i) {
      const square = this.findSquare(expectedPoint);
      result.push(square);

      expectedPoint = new Point(
          expectedPoint.x + horizantalScaler, expectedPoint.y + verticalScaler);
    }

    return result;

    /*
    for (const row of this.board) {
      for (const square of row) {
        let center = new Point(
            square.xCoord + this.dimensionsOfSquare / 2,
            square.yCoord + this.dimensionsOfSquare / 2);
        const closest = getNearestPointOnLine(startPoint, endPoint, center);
        if (center.distance(closest) < 2) {
          result.push(square);
        }
      }
    }

    return result;*/
  }
}

function isLineDiagonal(pointA, pointB) {
  return (pointA.x !== pointB.x && pointA.y !== pointB.y);
}

function isLineVertical(pointA, pointB) {
  return (Math.abs(pointA.x - pointB.x) < 0.01 && (pointA.y !== pointB.y));
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
 * @return {!GameBoard}
 */
function createGameBoard(canvasHeight, canvasWidth) {
  const gameDimensions = {
    startPointX: 0,
    startPointY: 0,
    gameHeight: 10,
    gameWidth: 10,
    dimensionsOfSquare: 0
  };

  const gameBoard = new GameBoard(gameDimensions, []);

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

  populateWithRandomChars(gameBoard);

  return gameBoard;
}

/**
 * Converts ranNumber from a float to a character in the
 * english alphabet based on what interval it is within the charFrequency.
 * @param {number} ranNumber a random float between 0-101.432
 * @return {string}
 */
function getRandomizedCharater(ranNumber) {
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
function populateWithRandomChars(wordSearchBoard) {
  for (const row of wordSearchBoard.board) {
    for (const square of row) {
      const randomNum = Math.random() * 101.432;
      square.character = getRandomizedCharater(randomNum);
    }
  }
}


exports = {
  createGameBoard,
  GameBoard,
  Square,
  Point
};