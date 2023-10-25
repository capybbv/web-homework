import { useState } from "react";
import "./styles.css";

function Square({ value, onSquareClick, isWinning }) {
  const style = isWinning ? { backgroundColor: "#ff0" } : null;

  return (
    <button className="square" onClick={onSquareClick} style={style}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, currentMove }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  let status;
  const winningStatus = calculateWinner(squares);
  if (winningStatus !== null) {
    status = "Winner: " + winningStatus.winner;
  } else if (currentMove === 9) {
    status = "Draw"
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const rows = 3;
  const cols = 3;

  const board = [];

  for (let row = 0; row < rows; ++row) {
    const tempRow = [];
    for (let col = 0; col < cols; ++col) {
      const index = row * rows + col;
      tempRow.push(
        <Square
          value={squares[index]}
          onSquareClick={() => handleClick(index)}
          isWinning={winningStatus?.line.includes(index) ? true : false}
        />
      );
    }

    board.push(<div className="board-row">{tempRow}</div>);
  }

  return (
    <>
      <div className="status">{status}</div>
      {board}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [isAscending, setIsAscending] = useState(true);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((step, move) => {
    let description;
    if (currentMove === move) {
      description = `You are at move #${move}`;
      return (
        <li key={move}>
          <label>{description}</label>
        </li>
      );
    }

    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  if (!isAscending) {
    moves.reverse();
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} currentMove={currentMove} />
      </div>
      <div className="game-info">
        <button onClick={() => setIsAscending(!isAscending)}>
          {isAscending ? "Sort deascending" : "Sort Ascending"}
        </button>
        <ol>{moves}</ol>
      </div>
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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  return null;
}
