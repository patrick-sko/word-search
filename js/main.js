goog.module('wordsearch.main')

const model = goog.require('wordsearch.model');

const canvas = document.getElementById('wordSearchCanvas');
const context = canvas.getContext('2d');

function redraw() {
  const height = canvas.getBoundingClientRect().height;
  const width = canvas.getBoundingClientRect().width;

  // console.log('Height is: ' + height + ' Width is: ' + width);
}


/**
 * Draws the game board onto the screen with the canvas api.
 * @param {!model.GameBoard} wordSearchBoard
 */
function drawGameBoard(wordSearchBoard) {
  context.textAlign = 'center'
  context.font = '30px Arial';
  for (const row of wordSearchBoard.board) {
    for (const square of row) {
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

  const height = canvas.getBoundingClientRect().height;
  const width = canvas.getBoundingClientRect().width;

  const wordSearchBoard = model.createGameBoard(height, width);
  model.randomizeCharacters(wordSearchBoard);

  console.log(wordSearchBoard);

  drawGameBoard(wordSearchBoard);
}

main();
