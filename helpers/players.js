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

module.exports = {
  playerJoin,
  playerLeave,
  getRoomPlayers,
  getCurrentPlayer,
};
