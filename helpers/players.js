const _ = require('lodash');

const players = [];

const defaultPlayer = {
  room: '',
  character: '',
  id: '',
  isTurn: false,
  inRoom: false,
  cards: [],
  trackedTurn: [],
  x: '',
  y: '',
  color: '',
};

const playerJoin = (id, room) => {
  const newPlayer = { ..._.cloneDeep(defaultPlayer), room, id };
  players.push(newPlayer);
  return newPlayer;
};

const getCurrentPlayer = (id) => {
  return players.find((player) => player.id === id);
};

const getRoomPlayers = (room) => {
  return players.filter((player) => player.room === room);
};

const playerLeave = (id) => {
  const index = players.findIndex((user) => user.id === id);
  if (index > -1) {
    return players.splice(index, 1)[0];
  }
};

// const assignPlayerPositions = (players) => {
//   const playersCopy = _.cloneDeep(players)
//   return playersCopy.map((player, index) => {
//     if (index === 0) {
//       player.x = 321;
//       player.y = 711;
//     } else if (index === 1) {
//       player.x = 55.5;
//       player.y = 543;
//     }
//     return player;
//   });
// };

module.exports = {
  playerJoin,
  playerLeave,
  getRoomPlayers,
  getCurrentPlayer,
};
