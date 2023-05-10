import React, { useState } from "react";

const CreateGame = ({ handleGame }) => {
  const [name, setName] = useState("");
  const [gameId, setGameId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    handleGame(name, gameId)
  }

  return (
    <div className="box-style start-card">
      <h4 className="title">Create New Game</h4>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="input"
          placeholder="Put your name"
          onChange={(e) => setName(e.target.value)}
          required
        />

        <button
          type="submit"
          className="startBtn footer-X"
        >
          Create Game
        </button>
      </form>
    </div>
  );
};

export default CreateGame;
