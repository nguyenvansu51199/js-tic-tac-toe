import { CELL_VALUE, GAME_STATUS, TURN } from "./constants.js";
import {
  getCellElementAtIdx,
  getCellElementList,
  getCellLístElement,
  getCurrentTurnElement,
  getGameStatusElement,
  getReplayButtonElement,
} from "./selectors.js";
import { checkGameStatus } from "./utils.js";

console.log(checkGameStatus(["X", "O", "O", "", "X", "", "", "O", "X"]));
console.log(checkGameStatus(["X", "O", "O", "", "X", "", "", "O", ""]));
console.log(checkGameStatus(["X", "O", "O", "X", "O", "X", "0", "O", "X"]));
console.log(checkGameStatus(["X", "O", "X", "0", "X", "X", "0", "O", "X"]));

/**
 * Global variables
 */
let currentTurn = TURN.CROSS;
let gameStatus = GAME_STATUS.PLAYING;
let cellValues = new Array(9).fill("");

function toggleTurn() {
  // toggle turn
  currentTurn = currentTurn === TURN.CIRCLE ? TURN.CROSS : TURN.CIRCLE;

  // update turn on DOM element
  const currentTurnElement = getCurrentTurnElement();
  if (currentTurnElement) {
    currentTurnElement.classList.remove(TURN.CROSS, TURN.CIRCLE);
    currentTurnElement.classList.add(currentTurn);
  }
}

function updateGameStatus(newGameStatus) {
  gameStatus = newGameStatus;

  const gameStatusElement = getGameStatusElement();
  if (gameStatusElement) gameStatusElement.textContent = newGameStatus;
}

function showReplayButton() {
  const replayButton = getReplayButtonElement();
  if (replayButton) replayButton.classList.add("show");
}

function hideReplayButton() {
  const replayButton = getReplayButtonElement();
  if (replayButton) replayButton.classList.remove("show");
}

function highlightWinCells(winPositions) {
  if (!Array.isArray(winPositions) || winPositions.length !== 3) {
    throw new Error("Invalid win position");
  }

  for (const position of winPositions) {
    const cell = getCellElementAtIdx(position);
    if (cell) cell.classList.add("win");
  }
}

function handleCellClick(cell, index) {
  const isClicked =
    cell.classList.contains(TURN.CIRCLE) || cell.classList.contains(TURN.CROSS);
  const isEndGame = gameStatus !== GAME_STATUS.PLAYING;

  //  only allow click if game is playing or that cell is not clicked yet
  if (isClicked || isEndGame) return;

  // set selected cell
  cell.classList.add(currentTurn);

  // update cellValues
  cellValues[index] =
    currentTurn === TURN.CIRCLE ? CELL_VALUE.CIRCLE : CELL_VALUE.CROSS;

  // toggole turn
  toggleTurn();

  // check game status
  const game = checkGameStatus(cellValues);
  switch (game.status) {
    case GAME_STATUS.ENDED: {
      // update game status
      updateGameStatus(game.status);
      // show replay button
      showReplayButton();
      break;
    }
    case GAME_STATUS.X_WIN:
    case GAME_STATUS.O_WIN: {
      // update game status
      updateGameStatus(game.status);

      // show replay button
      showReplayButton();

      // hightlight win cells
      highlightWinCells(game.winPositions);
      break;
    }

    default:
    // playing
  }
  console.log("click", cell, index);
}

function initCellElementList() {
  const liList = getCellElementList();

  liList.forEach((cell, index) => {
    // cell.addEventListener('click', () => handleCellClick(cell, index));
    cell.dataset.idx = index;
  });

  // ----------
  const ulElement = getCellLístElement();
  if (ulElement) {
    ulElement.addEventListener("click", (event) => {
      if (event.target.tagName !== "LI") return;

      const index = Number.parseInt(event.target.dataset.idx);
      handleCellClick(event.target, index);
    });
  }
}

function resetGame() {
  console.log("click");

  // reset temp global vars
  currentTurn = TURN.CROSS;
  gameStatus = GAME_STATUS.PLAYING;
  cellValues = cellValues.map(() => "");
  // reset DOM element
  // reset game status
  updateGameStatus(GAME_STATUS.PLAYING);

  // reset current turn
  const currentTurnElement = getCurrentTurnElement();
  if (currentTurnElement) {
    currentTurnElement.classList.remove(TURN.CROSS, TURN.CIRCLE);
    currentTurnElement.classList.add(TURN.CROSS);
  }

  // reset game board
  const cellElementList = getCellElementList();
  for (const cellElement of cellElementList) {
    cellElement.className = "";
  }
  // hide replay button
  hideReplayButton();
}

function initReplayButton() {
  const replayButton = getReplayButtonElement();
  if (replayButton) {
    replayButton.addEventListener("click", resetGame);
  }
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
  // bind click event for all li
  initCellElementList();

  // bind click event for replay button
  initReplayButton();
})();
