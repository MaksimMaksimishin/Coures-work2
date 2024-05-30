// DifficultySelector.js
import React from 'react';

function DifficultySelector({ onSelectDifficulty }) {
  const handleDifficultyChange = (e) => {
    const difficulty = parseInt(e.target.value);
    onSelectDifficulty(difficulty);
  };

  return (
    <div>
      <label htmlFor="difficulty">Select Difficulty:</label>
      <select id="difficulty" onChange={handleDifficultyChange}>
        <option value="1">Easy</option>
        <option value="2">Medium</option>
        <option value="3">Hard</option>
      </select>
    </div>
  );
}

export default DifficultySelector;
