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

const getCurrentPlayer = (id) => {
  return players.find(player => player.id === id)
}

const getRoomPlayers = (room) => {
  return players.filter(player => player.room === room)
}

const  playerLeave = (id) => {
  const index = players.findIndex((user) => user.id === id)
  if (index > -1) {
    return players.splice(index, 1)[0]
  }
}

const assignPlayerPositions = (players) => {
  const playersCopy = [...players]
  return playersCopy.map((player, index) => {
    if (index === 0) {
      player.x = 537.5
      player.y = 312.5
    }
    else if (index === 1) {
       player.x = 512.5;
       player.y = 312.5;
    }
    return player
  })
 }

module.exports = {
  playerJoin,
  playerLeave,
  getRoomPlayers,
  assignPlayerPositions,
  getCurrentPlayer
}