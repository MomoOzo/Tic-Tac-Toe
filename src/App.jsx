import { useState } from "react";
import Player from "./components/Player";
import GameBoard from "./components/GameBoard";
import Log from "./components/Log.jsx";
import GameOver from "./components/GameOver";
import { WINNING_COMBINATIONS } from "../winning-combination";

const PLAYERS = {
  X: "Player 1",
  O: "Player 2",
};

const INITIAL_GAME_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

// Helper constent TO CALCULATE WINNING COMBINATIONS

// const WINNING_COMBINATIONS = [
//   [
//     { row: 0, col: 0 },
//     { row: 0, col: 1 },
//     { row: 0, col: 2 },
//   ],
// ]; So this would be in the winning combination js file

// the function below is a helper function

function deriveActivePlayer(gameTurns) {
  let currentPlayer = "X";

  if (gameTurns.length > 0 && gameTurns[0].player === "X") {
    currentPlayer = "O";
  }

  return currentPlayer;
}

//  this helper function is better than the previous code below
function deriveGameBoard(gameTurns) {
  let gameBoard = [...INITIAL_GAME_BOARD.map((array) => [...array])];

  for (const turn of gameTurns) {
    const { square, player } = turn;
    const { row, col } = square;

    gameBoard[row][col] = player;
  }

  return gameBoard;
}

function deriveWinner(gameBoard, players) {
  let winner;

  for (const combination of WINNING_COMBINATIONS) {
    const firstSquareSymbol =
      gameBoard[combination[0].row][combination[0].column];
    const secondSquareSymbol =
      gameBoard[combination[1].row][combination[1].column];
    const thirdSquareSymbol =
      gameBoard[combination[2].row][combination[2].column];

    if (
      firstSquareSymbol &&
      firstSquareSymbol === secondSquareSymbol &&
      firstSquareSymbol === thirdSquareSymbol
    ) {
      winner = players[firstSquareSymbol];
    }
  }

  return winner;
}

function App() {
  // inisted of lifting up the state in the player compnenets and
  // that wrong because it used there we will create a new state below|
  // to print the name of the winning player
  const [players, setPlayers] = useState(PLAYERS);
  //   {
  //   X: "Player 1",
  //   O: "Player 2",
  // }

  const [gameTurns, setGameTurns] = useState([]);

  // const [hasWinner, setHas Winner] = useState(false);
  // so in the line up we should not use useState for check if one of the player won or not
  // and insted we could use the handleSelectSquare function
  // cause when each player chose a square the main component function reexecute

  // const [activePlayer, setActivePlayer] = useState("X");
  const activePlayer = deriveActivePlayer(gameTurns);
  // let currentPlayer = "X";
  // if (gameTurns.length > 0 && gameTurns[0].player === "X") {
  //   currentPlayer = "O";
  // }

  const gameBoard = deriveGameBoard(gameTurns);

  // let gameBoard = [...initialGameBoard.map((array) => [...array])];

  // for (const turn of gameTurns) {
  //   const { square, player } = turn;
  //   const { row, col } = square;

  //   // the line below will cause a bug when we try to
  //   // manage the rematch button
  //   // and that is because when we add the line below or when it run
  //   // its add the combination to the original arr and that
  //   // because arr like object in JS are reference values

  //   // the solution is simple is that we just create a copy in the initialGameBoard
  //   // in the let gameBoard = initialGameBoard
  //   gameBoard[row][col] = player;
  // }

  // instead of the below code we could achieve that with a function

  const winner = deriveWinner(gameBoard, players);
  // let winner;

  // for (const combination of WINNING_COMBINATIONS) {
  //   const firstSquareSymbol =
  //     gameBoard[combination[0].row][combination[0].column];
  //   const secondSquareSymbol =
  //     gameBoard[combination[1].row][combination[1].column];
  //   const thirdSquareSymbol =
  //     gameBoard[combination[2].row][combination[2].column];

  //   if (
  //     firstSquareSymbol &&
  //     firstSquareSymbol === secondSquareSymbol &&
  //     firstSquareSymbol === thirdSquareSymbol
  //   ) {
  //     winner = players[firstSquareSymbol];
  //   }
  // }

  const hasDraw = gameTurns.length === 9 && !winner;

  function handleSelectSquare(rowIndex, colIndex) {
    // setActivePlayer((curActivePlayer) => (curActivePlayer === "X" ? "O" : "X"));
    setGameTurns((prevTurns) => {
      const currentPlayer = deriveActivePlayer(prevTurns);
      // let currentPlayer = "X";
      // if (prevTurns.length > 0 && prevTurns[0].player === "X") {
      //   currentPlayer = "O";
      // }
      const updatedTurns = [
        { square: { row: rowIndex, col: colIndex }, player: currentPlayer },
        ...prevTurns,
      ];
      return updatedTurns;
    });
  }

  function handleRestart() {
    setGameTurns([]);
  }
  // manage winning player name
  function handlePlayerNameChange(symbol, newName) {
    setPlayers((prevPlayers) => {
      return {
        ...prevPlayers,
        [symbol]: newName,
      };
    });
  }

  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player
            initialName={
              // "Player 1"
              PLAYERS.X
            }
            symbol="X"
            isActive={activePlayer === "X"}
            onChangeName={handlePlayerNameChange}
          />
          <Player
            initialName={
              // "Player 2"
              PLAYERS.O
            }
            symbol="O"
            isActive={activePlayer === "O"}
            onChangeName={handlePlayerNameChange}
          />
        </ol>
        {(winner || hasDraw) && (
          <GameOver winner={winner} onRestart={handleRestart} />
        )}
        <GameBoard onSelectSquare={handleSelectSquare} board={gameBoard} />
      </div>
      <Log turns={gameTurns} />
    </main>
  );
}

export default App;
