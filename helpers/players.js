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
  console.log(newPlayer)
  return newPlayer
}

module.exports = {playerJoin}