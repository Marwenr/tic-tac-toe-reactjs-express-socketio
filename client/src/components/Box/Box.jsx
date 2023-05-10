import React from "react";

const Box = ({ item, index, onClick, enabled, canPlay, isWinnerSquare }) => {
  const canClick = !item && enabled && canPlay ? "" : "cursor-none";
  const winningClass = isWinnerSquare && !enabled ? "win" : "";
  const colorXO = item === "X" ? "boxX" : "boxO";

  return (
    <div
      className={`box box-style ${winningClass} ${colorXO} ${canClick}`}
      onClick={onClick}
    >
      {item}
    </div>
  );
};

export default Box;
