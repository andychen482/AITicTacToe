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

function Board({ squares, onPlay, isAIThinking }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i] !== 0 || isAIThinking) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = 1;
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (isAIThinking) {
    status = "AI is thinking...";
  } else if (winner !== "Draw" && winner !== null) {
    status = winner === 1 ? "You win!" : "You lose!";
  } else if (winner === "Draw") {
    status = "It's a draw!";
  } else {
    status = "Your turn";
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
  const [isAIThinking, setISAIThinking] = useState(false);

  useEffect(() => {
    const makeAIMove = async () => {
      if (currentMove % 2 !== 0 && calculateWinner(currentSquares) === null) {
        setISAIThinking(true);
        const response = await requestHandler(currentSquares);
        const position = response.prediction;
        const nextSquares = [...currentSquares];
        nextSquares[position] = -1;
        handlePlay(nextSquares);
        setISAIThinking(false);
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
    setISAIThinking(false);
  }

  return (
    <>
      <div className="title">AI Tic Tac Toe</div>
      <div className="game">
        <div className="game-board">
          <Board
            squares={currentSquares}
            onPlay={handlePlay}
            isAIThinking={isAIThinking}
          />
        </div>
        <button onClick={reset} className="resetButton">
          Reset
        </button>
        <div className="footer">Made by Andy, Misha, Beto, and Maxie</div>
      </div>
    </>
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
