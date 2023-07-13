import { CELL_VALUE, GAME_STATUS, TURN } from './constants.js';
import {
  getCellElementAtIdx,
  getCellElementList,
  getCurrentTurnElement,
  getGameStatusElement,
  getReplayButtonElement,
} from './selectors.js';
import { checkGameStatus } from './utils copy.js';

console.log(checkGameStatus(['X', 'O', 'O', '', 'X', '', '', 'O', 'X']));
console.log(checkGameStatus(['X', 'O', 'O', '', 'X', '', '', 'O', '']));
console.log(checkGameStatus(['X', 'O', 'O', 'X', 'O', 'X', '0', 'O', 'X']));
console.log(checkGameStatus(['X', 'O', 'X', '0', 'X', 'X', '0', 'O', 'X']));

/**
 * Global variables
 */
let currentTurn = TURN.CROSS;
let gameStatus = GAME_STATUS.PLAYING;
let cellValues = new Array(9).fill('');

function toggleTurn() {
  currentTurn = currentTurn === TURN.CIRCLE ? TURN.CROSS : TURN.CIRCLE;

  const currentTurnElement = getCurrentTurnElement();
  currentTurnElement.classList.remove(TURN.CIRCLE, TURN.CROSS);
  currentTurnElement.classList.add(currentTurn);
}

function updateGameStatus(status) {
  const gameStatusElement = getGameStatusElement();
  if (gameStatusElement) gameStatusElement.textContent = status;
}

function showReplayButton() {
  const replayButton = getReplayButtonElement();

  if (replayButton) replayButton.classList.add('show');
}

function highlightWinCells(winPositions) {
  if (!Array.isArray(winPositions) || winPositions.length !== 3) {
    throw new Error('Invalid win positions');
  }
  for (const position of winPositions) {
    const cell = getCellElementAtIdx(position);
    cell.classList.add('win');
  }
}

function handleCellClick(cell, index) {
  const isClicked =
    cell.classList.contains(TURN.CROSS) || cell.classList.contains(TURN.CIRCLE);
  const isEndGame = gameStatus !== GAME_STATUS.PLAYING;

  if (isClicked || isEndGame) return;

  cell.classList.add(currentTurn);

  cellValues[index] =
    currentTurn === TURN.CIRCLE ? CELL_VALUE.CIRCLE : CELL_VALUE.CROSS;

  // toggle turn
  toggleTurn();

  // checkgame
  const game = checkGameStatus(cellValues);

  switch (game.status) {
    case GAME_STATUS.ENDED: {
      // update game status
      updateGameStatus(game.status);
      // show replay button
      showReplayButton();
      break;
    }

    case GAME_STATUS.O_WIN:
    case GAME_STATUS.X_WIN: {
      // update game status
      updateGameStatus(game.status);
      // show replay button
      showReplayButton();
      // hightlight cell values
      highlightWinCells(game.winPositions);
      break;
    }

    default:
      break;
  }

  console.log('click', cell, index);
}

function initCellElementList() {
  const cellElementList = getCellElementList();

  cellElementList.forEach((cell, index) => {
    cell.addEventListener('click', () => {
      handleCellClick(cell, index);
    });
  });
}

/**
 * TODOs
 *
 * 1. Bind click event for all cells
 * 2. On cell click, do the following:
 *    - Toggle current turn
 *    - Mark current turn to the selected cell
 *    - Check game state: win, ended or playing
 *    - If game is win, highlight win cells
 *    - Not allow to re-click the cell having value.
 *
 * 3. If game is win or ended --> show replay button.
 * 4. On replay button click --> reset game to play again.
 *
 */

(() => {
  initCellElementList();
})();
