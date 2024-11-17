"use client";

import React, { useState, useEffect } from "react";

interface GridCell {
  letter: string;
  used: boolean;
  highlight: "none" | "blue" | "yellow";
}

const generateBoard = (themeWords: string[]): GridCell[][] => {
  const size = 4;
  const board: GridCell[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => ({
      letter: "",
      used: false,
      highlight: "none",
    }))
  );

  // Place theme words on the board
  themeWords.forEach((word, index) => {
    const startRow = index; // Example: Start each word in a new row
    for (let i = 0; i < word.length; i++) {
      board[startRow][i] = {
        letter: word[i],
        used: false,
        highlight: "none",
      };
    }
  });

  // Fill remaining cells with random letters
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  board.forEach((row, rowIndex) =>
    row.forEach((cell, colIndex) => {
      if (cell.letter === "") {
        cell.letter = letters[Math.floor(Math.random() * letters.length)];
      }
    })
  );

  return board;
};

const SudWordGame: React.FC = () => {
  const themeWords = ["BANANA", "APPLE", "FRUIT", "LIME"]; // Example words
  const spangram = "FRUIT LIME"; // Example spangram

  const [board, setBoard] = useState<GridCell[][]>(() => generateBoard(themeWords));
  const [selectedCells, setSelectedCells] = useState<{ row: number; col: number }[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);

  const handleMouseDown = (row: number, col: number) => {
    const cell = board[row][col];
    if (!cell.used) {
      setIsSelecting(true);
      setSelectedCells([{ row, col }]);
    }
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (isSelecting) {
      const cell = board[row][col];
      if (!cell.used) {
        setSelectedCells((prev) => [...prev, { row, col }]);
      }
    }
  };

  const handleMouseUp = () => {
    if (selectedCells.length > 0) {
      const word = selectedCells.map(({ row, col }) => board[row][col].letter).join("");

      if (themeWords.includes(word)) {
        // Highlight theme words in blue
        setBoard((prevBoard) =>
          prevBoard.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const isSelected = selectedCells.some(
                (selected) => selected.row === rowIndex && selected.col === colIndex
              );
              return isSelected
                ? { ...cell, used: true, highlight: "blue" }
                : cell;
            })
          )
        );
      } else if (word === spangram.replace(" ", "")) {
        // Highlight spangram in yellow
        setBoard((prevBoard) =>
          prevBoard.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const isSelected = selectedCells.some(
                (selected) => selected.row === rowIndex && selected.col === colIndex
              );
              return isSelected
                ? { ...cell, used: true, highlight: "yellow" }
                : cell;
            })
          )
        );
      } else {
        // Track non-theme words
        setFoundWords((prev) => [...prev, word]);
      }

      setSelectedCells([]);
    }
    setIsSelecting(false);
  };

  return (
    <div className="flex gap-8">
      {/* Board */}
      <div
        className="grid grid-cols-4 gap-1 p-4 bg-gray-100 select-none"
        onMouseUp={handleMouseUp}
        onMouseLeave={() => setIsSelecting(false)}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
              onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
              className={`w-12 h-12 flex items-center justify-center border text-lg font-bold shadow-sm ${
                cell.highlight === "blue"
                  ? "bg-blue-300 text-white"
                  : cell.highlight === "yellow"
                  ? "bg-yellow-300 text-white"
                  : "bg-white text-gray-800"
              }`}
            >
              {cell.letter}
            </div>
          ))
        )}
      </div>

      {/* Words Found */}
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold">Words:</h2>
        <ul className="list-disc pl-4">
          {foundWords.map((word, index) => (
            <li key={index} className="text-lg text-gray-800">
              {word}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SudWordGame;
