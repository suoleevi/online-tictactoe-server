const validateInput = (input) => {
  if (input < 0 || input > 8) return false;
  return true;
};

class GameBoard {
  gameboard;

  constructor() {
    this.gameboard = ["", "", "", "", "", "", "", "", ""];
  }

  setBox(id, socketId) {
    this.gameboard[id] = socketId;
  }

  getBox(id) {
    return this.gameboard[id];
  }
}

const checkIfWin = (gameboard) => {
  const board = [];
  for (i = 0; i < 9; i++) board.push(gameboard.getBox(i));

  // Checking rows and columns
  for (i = 0; i < 3; i++) {
    let row = [board[i * 3], board[i * 3 + 1], board[i * 3 + 2]];
    if (
      row.every((value) => {
        return value === row[0] && value !== "";
      })
    ) {
      return true;
    }

    let column = [board[i], board[i + 3], board[i + 6]];
    if (
      column.every((value) => {
        return value === column[0] && value !== "";
      })
    ) {
      return true;
    }
  }

  // Checking diagonals
  let diag1 = [board[0], board[4], board[8]];
  let diag2 = [board[6], board[4], board[2]];
  if (
    diag1.every((value) => {
      return value === diag1[0] && value !== "";
    })
  ) {
    return true;
  }
  if (
    diag2.every((value) => {
      return value === diag2[0] && value !== "";
    })
  ) {
    return true;
  }
  return false;
};

const checkIfTie = function (gameboard) {
  const board = [];
  for (i = 0; i < 9; i++) board.push(gameboard.getBox(i));
  if (board.indexOf("") === -1) {
    return true;
  }
};

module.exports = { validateInput, checkIfWin, checkIfTie, GameBoard };
