const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const cors = require("cors");
const PORT = process.env.PORT || 3009;
const generateId = () => {
  return "Game-" + Math.random().toString(16).slice(10);
};

app.use(cors());

const { createGame, getGame, updateGame } = require("./games");
const { createPlayer, getPlayer, removePlayer } = require("./players");

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const checkWinner = (board) => {
  for (let i = 0; i < winningCombinations.length; i++) {
    const [a, b, c] = winningCombinations[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return {
        winningCombination: [a, b, c],
      };
    }
  }
  return null;
};

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected ${socket.id}`);

  socket.on("disconnect", () => {
    const player = getPlayer(socket.id);
    if (player) {
      removePlayer(player.id);
    }
    socket.broadcast.emit("notification", {
      message: `The opponent left the game`,
    });
  });

  socket.on("createGame", (data) => {
    const name = data.name;
    const gameId = generateId();

    const player = createPlayer(socket.id, name, gameId, "X");
    const game = createGame(gameId, player.id, null);
    game.namePlayer = player.name;
    game.symbolPlayer = player.symbol;

    socket.join(gameId);
    socket.emit("playerCreated", { player });
    socket.emit("gameUpdated", { game });

    socket.emit("notification", {
      message: `The game has been created. Game id: ${gameId}. Send this to your friend to join you`,
    });
    socket.emit("notification", {
      message: "Waiting for opponent ...",
    });
  });

  socket.on("joinGame", (data) => {
    const game = getGame(data.gameId);

    if (!game) {
      socket.emit("notification", {
        message: "Invalid game id",
      });
      return;
    }
    if (game.player2) {
      socket.emit("notification", {
        message: "Game is full",
      });
      return;
    }
    const player = createPlayer(socket.id, data.name, game.id, "O");

    game.player2 = player.id;
    game.namePlayer2 = player.name;
    game.symbolPlayer2 = player.symbol;
    game.status = "fulfilled";
    updateGame(game);

    socket.join(data.gameId);
    socket.emit("playerCreated", { player });
    socket.emit("gameUpdated", { game });

    socket.broadcast.emit("gameUpdated", { game });
    socket.broadcast.emit("notification", {
      message: `${data.name} has joined the game.`,
    });
  });

  socket.on("repeat", (data) => {
    const { gameId } = data;
    // Get the game
    const game = getGame(gameId);
    const { playBoard = [], player1 } = game;

    game.playerTurn = player1;
    game.playBoard = Array(9).fill(null);
    game.status = "fulfilled";
    game.winner = null;
    updateGame(game);

    io.in(gameId).emit("gameUpdated", { game });
  });

  socket.on("moveMade", (data) => {
    const { player, square, gameId } = data;

    const game = getGame(gameId);

    const { playBoard = [], playerTurn, player1, player2 } = game;
    playBoard[square] = player.symbol;

    const nextTurnId = playerTurn === player1 ? player2 : player1;

    game.playerTurn = nextTurnId;
    game.playBoard = playBoard;
    updateGame(game);

    io.in(gameId).emit("gameUpdated", { game });

    const hasWon = checkWinner(playBoard);
    if (hasWon) {
      const winner = { ...hasWon, player };
      game.status = "gameOver";
      updateGame(game);
      io.in(gameId).emit("gameUpdated", { game });
      io.in(gameId).emit("gameEnd", { winner });
      return;
    }

    const emptySquareIndex = playBoard.findIndex((item) => item === null);
    if (emptySquareIndex === -1) {
      game.status = "gameOver";
      updateGame(game);
      io.in(gameId).emit("gameUpdated", { game });
      io.in(gameId).emit("gameEnd", { winner: null });
      return;
    }
  });
});

server.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
