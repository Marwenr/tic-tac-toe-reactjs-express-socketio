const games = [];

const createGame = (id, player1, player2) => {
  const game = {
    id,
    player1,
    player2,
    playerTurn: player1,
    playBoard: Array(9).fill(null),
    status: "pending",
    winner: null,
  };
  games.push(game);
  return game;
};

const getGame = (id) => games.find((game) => game.id === id);

const updateGame = (game) => {
  const index = games.findIndex((gameIt) => gameIt.id === game.id);
  if (index !== -1) {
    games[index] = game;
  }
};

module.exports = { createGame, updateGame, getGame };