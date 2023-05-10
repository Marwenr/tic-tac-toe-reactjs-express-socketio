import React, { useState } from "react";

const JoinGame = ({ handleGame }) => {
  const [name, setName] = useState("");
  const [gameId, setGameId] = useState("");
  return (
    <div className="box-style start-card">
      <h4 className="title">Join Game</h4>
      <form onSubmit={() => handleGame(name, gameId)}>
        <input
          type="text"
          className="input"
          placeholder="Put your name"
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="text"
          className="input"
          placeholder="Put Game Id"
          onChange={(e) => setGameId(e.target.value)}
          required
        />

        <button
          className="startBtn footer-O"
          type="submit"
        >
          Join Game
        </button>
      </form>
    </div>
  );
};

export default JoinGame;
