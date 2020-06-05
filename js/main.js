
const canvas = document.getElementById('wordSearchCanvas');
const context = canvas.getContext('2d');


function redraw(){

  var height = canvas.getBoundingClientRect().height;
  var width = canvas.getBoundingClientRect().width;

  //console.log('Height is: ' + height + ' Width is: ' + width);
}

/**
 * Returns a word seach game board that is created based of the dimensions
 * of the allocated screen space with each letter being allocated it's
 * own square within the board.
 * @param {number} canvasHeight 
 * @param {number} canvasWidth 
 * @returns {Object}
 */
function createGameBoard(canvasHeight, canvasWidth){
  var gameBoard = {
    startPointX: 0,
    startPointY: 0,
    gameHeight: 10,
    gameWidth: 10,
    board: []
  }

  var heightScaler = canvasHeight / gameBoard.gameHeight;
  var widthScaler = canvasWidth / gameBoard.gameWidth;

  if (widthScaler > heightScaler) {
    widthScaler = heightScaler;
  } else {
    heightScaler = widthScaler;
  }

  var middlePoint = canvasWidth / 2 - (widthScaler * gameBoard.gameWidth/2);
  gameBoard.startPointX = middlePoint;

  currX = gameBoard.startPointX;
  currY = gameBoard.startPointY;

  for(var i = 0 ; i < gameBoard.gameHeight ; ++i){
    var rowOfSquares = [];
    for(var j = 0 ; j < gameBoard.gameWidth ; ++j){

      var square = {
        xCoord: currX,
        yCoord: currY,
        width: widthScaler,
        height: heightScaler,
        character: '-'
      };

      rowOfSquares.push(square);

      currX += widthScaler;
      
    } 
    gameBoard.board.push(rowOfSquares);
    currX = gameBoard.startPointX;
    currY += heightScaler;
  }

  return gameBoard;
}

/**
 * Converts ranNumber from a float to a character in the
 * english alphabet based on what interval it is within the charFrequency. 
 * @param {array} charFrequency an array of floats where element at index i 
 *    less element index i - 1 is the frequency that the i'th letter occurs in 
 *    the english language
 * @param {number} ranNumber a random float between 0-101.432 
 * @return {String} 
 */
function getCharater(charFrequency, ranNumber){
  var index = 0;

  for(var i = 0 ; i < 26 ; ++i){
    if (ranNumber < charFrequency[i]){
      index = i;
      break;
    }
  }

  return String.fromCharCode(97 + index)
}

/**
 * Based on a weighted random distribution, it populates the wordSearchBoard
 * with random letters.
 * @param {object} wordSearchBoard 
 */
function randomizeCharacters(wordSearchBoard) {

  /** @const {number} */ 
  const frequency = [8.498, 9.989, 12.191, 16.445, 27.607, 29.835, 31.85, 37.944,
      45.49,45.643, 46.935, 50.96, 53.365, 60.114, 67.621, 69.550, 69.645, 
      77.232, 83.559, 92.915, 95.673, 96.651, 99.211, 99.361, 101.355, 101.432]

  for(var i = 0 ; i < wordSearchBoard.gameHeight ; ++i){
      for(var j = 0 ; j < wordSearchBoard.gameWidth ; ++j) {
          var randomNum = Math.random()*101.432;
  
          wordSearchBoard.board[i][j].character = 
            getCharater(frequency, randomNum);
      }
  }

}

/**
 * Draws the game board onto the screen with the canvas api.
 * @param {object} wordSearchBoard 
 */
function drawGameBoard(wordSearchBoard) {

  context.textAlign = 'center'
  context.font = '30px Arial';
  for(var i = 0 ; i < wordSearchBoard.gameHeight ; ++i){
    for(var j = 0 ; j < wordSearchBoard.gameWidth ; ++j){
      var square = wordSearchBoard.board[i][j];

      context.fillStyle = 'white';
      context.fillRect(square.xCoord, square.yCoord, square.width, 
          square.height);

      context.fillStyle = 'black';
      context.fillText(square.character, square.xCoord + square.width/2 , 
          square.yCoord + square.height/2+10);
    }
  }

}


function main(){

  window.addEventListener('resize', redraw);

  var height = canvas.getBoundingClientRect().height;
  var width = canvas.getBoundingClientRect().width;
    
  wordSearchBoard = createGameBoard(height, width);
  randomizeCharacters(wordSearchBoard);

  console.log(wordSearchBoard);

  drawGameBoard(wordSearchBoard);
}

main();
