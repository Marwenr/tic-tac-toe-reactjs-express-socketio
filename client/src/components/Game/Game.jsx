import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import Board from "../Board/Board";
import { BsArrowRepeat } from "react-icons/bs";
import { BiLogOutCircle } from "react-icons/bi";

let socket;

const Game = ({ name, gameId, handleOut }) => {
  const [player, setPlayer] = useState({});
  const [game, setGame] = useState({});
  const [notification, setNotification] = useState("");
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    socket = new io("http://localhost:3009");
    const handleGame = gameId ? "joinGame" : "createGame";
    socket.emit(handleGame, { name, gameId });

    return () => {
      socket.disconnect();
      socket.off();
    };
  }, [name, gameId]);

  useEffect(() => {
    socket.on("notification", (data) => {
      const { message = "" } = data;
      setNotification(message);
    });

    if (notification === "The opponent left the game") {
      setTimeout(handleOut, 5000);
    }
  }, [notification, handleOut]);

  useEffect(() => {
    socket.on("playerCreated", (data) => {
      setPlayer(data.player);
    });

    socket.on("gameUpdated", (data) => {
      setGame(data.game);
    });

    socket.on("gameEnd", (data) => {
      const { winner } = data;
      setWinner(winner);
    });
  });

  const getOut = () => {
    handleOut();
  };

  const repeat = () => {
    socket.emit("repeat", {
      gameId: game.id,
    });
  };

  const boxClicked = (value) => {
    socket.emit("moveMade", {
      square: value,
      player,
      gameId: game.id,
    });
  };

  const getWinnerMessage = () => {
    return winner.player.id === player.id ? "You Win" : "You Loose";
  };

  const winnerMessage = winner ? getWinnerMessage() : "Draw game";

  return (
    <div>
      {game.status === "gameOver" && !(notification === "The opponent left the game") && (
        <div className="gameOver">{winnerMessage}</div>
      )}

      <div className="header board">
        <div className="box-style btn-rep" onClick={repeat}>
          <BsArrowRepeat />
        </div>
        <div className="box-style turn">
          {game.playerTurn === game.player1 ? "X" : "O"}
          <span className="turn-text">Turn</span>
        </div>
        <div className="box-style btn-rep ms-auto" onClick={getOut}>
          <BiLogOutCircle />
        </div>
      </div>

      <Board
        game={game}
        player={player}
        winner={winner}
        boxClicked={boxClicked}
      />

      <div className="footer board">
        <div className="footer-X box-style">
          {player && (
            <div className="player">
              <p>{game.namePlayer}</p>
              <p style={{ fontWeight: "bold" }}>{game.symbolPlayer}</p>
            </div>
          )}
        </div>
        <div className="box-style logo">X - O</div>
        <div className="footer-O box-style">
          {game.status !== "pending" && (
            <div className="player">
              <p>{game.namePlayer2}</p>
              <p style={{ fontWeight: "bold" }}>{game.symbolPlayer2}</p>
            </div>
          )}
        </div>
      </div>

      {notification === "Waiting for opponent ..." && (
        <div className="waiting">
          <div className="waiting-text">{notification}</div>
          <div>
            Game Id: <span className="id">{game.id}</span>
          </div>
        </div>
      )}

      {notification === "The opponent left the game" && (
        <div className="waiting">
          <div className="waiting-text">{notification}</div>
          <div className="waiting-text">Wait 5 seconds...</div>
        </div>
      )}
    </div>
  );
};

export default Game;
