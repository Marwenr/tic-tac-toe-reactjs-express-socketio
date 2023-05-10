import React from "react";
import Box from "../Box/Box";

const Board = ({ game, player, boxClicked, winner }) => {
  const { playBoard = [], status = "pending" } = game;

  const enabled = status === "fulfilled";
  const canPlay = player.id === game.playerTurn;

  const { winningCombination = [] } = winner || {};

  const playBoardFnc = playBoard.map((it, index) => {
    const isWinnerSquare = winningCombination.includes(index);
    return (
      <Box
        key={index}
        item={it}
        index={index}
        onClick={() => boxClicked(index)}
        enabled={enabled}
        canPlay={canPlay}
        isWinnerSquare={isWinnerSquare}
      />
    );
  });

  return <div className="board">{playBoardFnc}</div>;
};

export default Board;
