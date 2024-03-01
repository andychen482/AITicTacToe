import { useState, useEffect } from "react";
import requestHandler from "./requestHandler";
import "./App.css";

function Square({ value, onSquareClick }) {
  const displayValue = value === 1 ? "X" : value === -1 ? "O" : "";
  return (
    <button className="square" onClick={onSquareClick}>
      {displayValue}
    </button>
  );
}

function Board({ squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i] !== 0) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = 1;
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner !== "Draw" && winner !== null) {
    status = "Winner: " + (winner === 1 ? "X" : "O");
  } else if (winner === "Draw") {
    status = "It's a draw!";
  } else {
    status = "Next player: X";
  }

  return (
    <>
      <div className="gameStatus">
        <div className="status">{status}</div>
      </div>
      <div className="board">
        {[0, 3, 6].map((rowStart) => (
          <div key={rowStart} className="board-row">
            {squares.slice(rowStart, rowStart + 3).map((square, i) => (
              <Square
                key={i + rowStart}
                value={square}
                onSquareClick={() => handleClick(i + rowStart)}
              />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([[0, 0, 0, 0, 0, 0, 0, 0, 0]]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  useEffect(() => {
    const makeAIMove = async () => {
      if (currentMove % 2 !== 0 && calculateWinner(currentSquares) === null) {
        const response = await requestHandler(currentSquares);
        const position = response.prediction;
        const nextSquares = [...currentSquares];
        nextSquares[position] = -1;
        handlePlay(nextSquares);
      }
    };
    makeAIMove();
  }, [currentMove, currentSquares]);

  function handlePlay(nextSquares) {
    const nextHistory = history.slice(0, currentMove + 1).concat([nextSquares]);
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function reset() {
    setHistory([[0, 0, 0, 0, 0, 0, 0, 0, 0]]);
    setCurrentMove(0);
  }

  return (
    <div className="game">
      <div className="title">AI Tic Tac Toe</div>
      <div className="game-board">
        <Board squares={currentSquares} onPlay={handlePlay} />
      </div>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (
      squares[a] !== 0 &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  if (squares.every((square) => square !== 0)) {
    return "Draw";
  }
  return null;
}
