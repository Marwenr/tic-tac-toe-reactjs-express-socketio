import "./App.css";
import CreateGame from "./components/CreateGame/CreateGame";
import JoinGame from "./components/JoinGame/JoinGame";
import Game from "./components/Game/Game";
import { useState } from "react";

function App() {
  const [startGame, setStartGame] = useState(false);
  const [gameId, setGameId] = useState("");
  const [name, setName] = useState("");

  const handleGame = (name, gameId) => {
    setName(name);
    setGameId(gameId);
    setStartGame(true);
  };

  const handleOut = () => {
    setStartGame(false)
  }

  return (
    <div className="app">
      <div className="container">
        {!startGame && (
          <div>
            <CreateGame handleGame={handleGame} />
            <JoinGame handleGame={handleGame} />
          </div>
        )}
        {startGame && <Game name={name} gameId={gameId} handleOut={handleOut} />}
      </div>
    </div>
  );
}

export default App;
