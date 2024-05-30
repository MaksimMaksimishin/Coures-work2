import React, { useState, useEffect } from 'react';
import Data from './Data';
import Card from './Card';
import DifficultySelector from './DifficultySelector';

function GameBoard() {
  const [cardsArray, setCardsArray] = useState([]);
  const [moves, setMoves] = useState(0);
  const [firstCard, setFirstCard] = useState(null);
  const [secondCard, setSecondCard] = useState(null);
  const [stopFlip, setStopFlip] = useState(false);
  const [won, setWon] = useState(false);
  const [difficulty, setDifficulty] = useState(1); // Default difficulty is easy
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    startNewGame();
  }, [difficulty]);

  useEffect(() => {
    let timer;
    if (timerActive) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timerActive]);

  const startNewGame = () => {
    let numberOfPairs = 6;
    if (difficulty === 2) numberOfPairs = 8;
    else if (difficulty === 3) numberOfPairs = 12;

    const shuffledData = Data.sort(() => 0.5 - Math.random()).slice(0, numberOfPairs);
    const doubledData = [...shuffledData, ...shuffledData].sort(() => 0.5 - Math.random());

    setCardsArray(doubledData.map((item, index) => ({ ...item, id: index })));
    setMoves(0);
    setFirstCard(null);
    setSecondCard(null);
    setWon(false);
    setTime(0);
    setTimerActive(true);
    setStopFlip(false);
  };

  const handleSelectedCards = (item) => {
    if (stopFlip) return;
    if (firstCard !== null && firstCard.id !== item.id) {
      setSecondCard(item);
    } else {
      setFirstCard(item);
    }
  };

  useEffect(() => {
    if (firstCard && secondCard) {
      setStopFlip(true);
      if (firstCard.name === secondCard.name) {
        setCardsArray((prevArray) => {
          return prevArray.map((unit) => {
            if (unit.name === firstCard.name) {
              return { ...unit, matched: true };
            } else {
              return unit;
            }
          });
        });

        setTimeout(() => {
          if (cardsArray.filter((card) => !card.matched).length === 2) {
            setWon(true);
            setTimerActive(false);
          }
          removeSelection();
        }, 1000);
      } else {
        setTimeout(() => {
          removeSelection();
        }, 1000);
      }
    }
  }, [firstCard, secondCard]);

  const removeSelection = () => {
    setFirstCard(null);
    setSecondCard(null);
    setStopFlip(false);
    setMoves((prevValue) => prevValue + 1);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Memory Game</h1>
        <DifficultySelector onSelectDifficulty={setDifficulty} />
      </div>
      <div className="board">
        {cardsArray.map((item) => (
          <Card
            item={item}
            key={item.id}
            handleSelectedCards={handleSelectedCards}
            toggled={item === firstCard || item === secondCard || item.matched === true}
            stopflip={stopFlip}
          />
        ))}
      </div>
      {won ? (
        <div className="comments">
          🎉 You Won in {moves} moves and {time} seconds! 🎉
        </div>
      ) : (
        <div className="comments">Moves: {moves} | Time: {time} seconds</div>
      )}
      <button className="button" onClick={startNewGame}>
        New Game
      </button>
    </div>
  );
}

export default GameBoard;
