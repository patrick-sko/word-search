goog.module('wordsearch.main')

const model = goog.require('wordsearch.model');
const view = goog.require('wordsearch.view');
const controller = goog.require('wordsearch.controller');



function main() {
  controller.playGame();
}

main();
