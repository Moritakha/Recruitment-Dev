/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { FaChessQueen, FaThumbsUp, FaHandPaper } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './QueensAttack.css'; // Archivo CSS personalizado
import axios from 'axios';

const QueensAttack = () => {
  const [n, setN] = useState(0);
  const [k, setK] = useState(0);
  const [rq, setRq] = useState(0);
  const [cq, setCq] = useState(0);
  const [obstacles, setObstacles] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [inputValue, setInputValue] = useState('');

  const parseInput = () => {
    const lines = inputValue.trim().split('\n');
    if (lines.length < 2) {
      setError('Entrada inválida, debe haber al menos 2 líneas.');
      return;
    }

    const [firstLine, secondLine, ...obstacleLines] = lines;
    const [boardSize, obstacleCount] = firstLine.split(' ').map(Number);
    const [queenRow, queenCol] = secondLine.split(' ').map(Number);

    if (isNaN(boardSize) || boardSize < 1 || boardSize > 8) {
      setError('The board size must be between 1 and 8');
      return;
    }

    if (isNaN(obstacleCount) || obstacleCount < 0 || obstacleCount > boardSize * boardSize) {
      setError(`The number of obstacles must be between 0 and ${boardSize * boardSize}.`);
      return;
    }

    const parsedObstacles = obstacleLines.map(line => line.split(' ').map(Number));
    if (obstacleCount > 0 && parsedObstacles.length !== obstacleCount) {
      setError(`If obstacles are specified, there must be exactlye ${obstacleCount} positions.`);
      return;
    }

    if (isNaN(queenRow) || queenRow < 1 || queenRow > boardSize || isNaN(queenCol) || queenCol < 1 || queenCol > boardSize) {
      setError('The queens positions must be within the size of the board.');
      return;
    }

    setN(boardSize);
    setK(obstacleCount);
    setRq(queenRow);
    setCq(queenCol);
    setObstacles(parsedObstacles);
    setError(null);

    handleCalculate(boardSize, obstacleCount, queenRow, queenCol, parsedObstacles);
  };

  const handleCalculate = (boardSize, obstacleCount, queenRow, queenCol, parsedObstacles) => {
    const data = {
      n: boardSize,
      k: obstacleCount,
      rq: queenRow,
      cq: queenCol,
      obstacles: parsedObstacles
    };

    console.log("Datos enviados al backend:", data);

    axios.post('http://localhost:8000/api/queens-attack', data)
      .then(response => {
        console.log(response.data);
        setResult(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
        setError('Error');
      });
  };

  const isAttackable = (row, col) => {

    if (row === rq || col === cq || Math.abs(rq - row) === Math.abs(cq - col)) {
      const isBlocked = obstacles.some(([obRow, obCol]) => {

        if (obRow === row && obCol === col) {
          return true;
        }

        if (row === rq) {
          return (obRow === row && (obCol > Math.min(cq, col) && obCol < Math.max(cq, col)));
        } else if (col === cq) {
          return (obCol === col && (obRow > Math.min(rq, row) && obRow < Math.max(rq, row)));
        } else if (Math.abs(rq - row) === Math.abs(cq - col)) {
          const rowDiff = row - rq;
          const colDiff = col - cq;
          return (Math.abs(obRow - rq) === Math.abs(obCol - cq) &&
            ((rowDiff > 0 && colDiff > 0 && obRow > rq && obCol > cq) ||
              (rowDiff > 0 && colDiff < 0 && obRow > rq && obCol < cq) ||
              (rowDiff < 0 && colDiff > 0 && obRow < rq && obCol > cq) ||
              (rowDiff < 0 && colDiff < 0 && obRow < rq && obCol < cq)));
        }
        return false;
      });

      return !isBlocked;
    }
    return false;
  };

  const renderBoard = () => {
    if (n === 0) return null;
    return (
      <div className="board-container">
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${n}, 50px)` }}>
          {Array.from({ length: n }, (_, rowIndex) =>
            Array.from({ length: n }, (_, colIndex) => {
              const actualRow = n - rowIndex;
              const actualCol = colIndex + 1;
              const isObstacle = obstacles.some(([obstacleRow, obstacleCol]) => obstacleRow === actualRow && obstacleCol === actualCol);
              const isQueen = rq === actualRow && cq === actualCol;
              const canMove = isAttackable(actualRow, actualCol);

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className="square"
                  style={{
                    backgroundColor: (rowIndex + colIndex) % 2 === 0 ? 'lightgray' : 'white',
                  }}
                >
                  {isObstacle && <FaHandPaper size={24} color="red" />}
                  {isQueen && <FaChessQueen size={32} color="black" />}
                  {!isQueen && canMove && !isObstacle && <FaThumbsUp size={24} color="green" />}
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container text-center bg-dark text-light py-4 queens-container">
      <h1>Problem 1</h1>
      <textarea
        className="form-control my-3"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter input in format (Example):
4 1 = n k => n is the board size and k is the number of obstacles
4 4 = rq cq => rq is the row position of the queen and cq is the column position of the queen
3 3 = or oc => or is the row position of the obstacle and cq is the column position of the obstacle
"
        rows={6}
        cols={30}
      />
      <button className="btn btn-primary" onClick={parseInput}>Parse Input and Calculate</button>
      {error && <p className="text-danger mt-3">{error}</p>}
      {result !== null && <h2 className="mt-3">Result: {result.attackable_squares}</h2>}

      {renderBoard()}
    </div>
  );
};

export default QueensAttack;