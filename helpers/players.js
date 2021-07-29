const players = []

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
  const newPlayer = {...defaultPlayer, room, id}
  players.push(newPlayer)
  return newPlayer
}

const getRoomPlayers = (room) => {
  return players.filter(player => player.room === room)
}

module.exports = {
  playerJoin,
  getRoomPlayers
}