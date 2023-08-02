const app = require('express')();
const express = require('express');
const path = require('path');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const {
  playerJoin,
  getRoomPlayers,
  assignPlayerPositions,
  getCurrentPlayer,
} = require('./helpers/players');
const { shuffle, dealCards } = require('./helpers/cardHandling');
const { suspects, weapons, locations } = require('./data/cards');

app.use(express.static(path.join(__dirname, 'public')));

var buttonState = {};
var socket_ids = [];
var turnState = {};
var characterList = [];
var roomno = 1;

io.on('connection', function (socket) {
  socket_ids.push(socket.id);
  turnState[socket.id] = false;
  buttonState[socket.id] = 'off';

  socket.on('disconnect', function () {
    var socketIndex = socket_ids.indexOf(socket.id);

    socket_ids.splice(socketIndex, 1);
  });
  // increase room number when more than 2 clients join
  if (
    io.nsps['/'].adapter.rooms[`room-${roomno}`] &&
    io.nsps['/'].adapter.rooms[`room-${roomno}`].length > 1
  )
    roomno++;

  socket.on('joinRoom', () => {
    const currentPlayer = playerJoin(socket.id, `room-${roomno}`);
    socket.join(`room-${roomno}`);

    //Send this event to everyone in the room.
    io.sockets
      .in(currentPlayer.room)
      .emit('connectToRoom', 'You are in room no. ' + roomno);

    const playersInRoom = getRoomPlayers(currentPlayer.room);

    if (playersInRoom.length === 2) {
      const players = assignPlayerPositions(playersInRoom);
      const locationsCopy = [...locations];
      const suspectsCopy = [...suspects];
      const weaponsCopy = [...weapons];
      shuffle(locationsCopy);
      shuffle(suspectsCopy);
      shuffle(weaponsCopy);

      var who = suspectsCopy.pop();
      var how = weaponsCopy.pop();
      var where = locationsCopy.pop();

      var allCards = [...locationsCopy, ...suspectsCopy, ...weaponsCopy];

      shuffle(allCards);
      const dealtPlayers = dealCards(allCards, players);

      io.to(currentPlayer.room).emit('cardsChosen', who, where, how);

      for (let player of dealtPlayers) {
        io.to(player.id).emit(
          'grabSocketId',
          player.id,
          player.cards,
          player.x,
          player.y
        );
      }
    }
  });

  socket.on('opponentInfo', function (id, x, y, color, character) {
    const player = getCurrentPlayer(socket.id);
    socket.broadcast
      .to(player.room)
      .emit('opponentInfo', id, x, y, color, character);
  });

  socket.on('playerMoved', function (x, y) {
    const player = getCurrentPlayer(socket.id);
    io.to(player.room).emit('playerMoved', x, y, socket.id);
  });

  socket.on('trackRoll', function (movesLeft, rollAmount) {
    const player = getCurrentPlayer(socket.id);
    io.to(player.room).emit('showMovesLeft', movesLeft, rollAmount);
  });

  socket.on('startGame', function (character) {
    const player = getCurrentPlayer(socket.id);
    const playersInRoom = getRoomPlayers(player.room);
    const player1Id = playersInRoom[0].id;
    const player2Id = playersInRoom[1].id;
    characterList.push(character);
    if (characterList.length === 2) {
      turnState[player1Id] = true;
      turnState[player2Id] = false;
      io.to(player1Id).emit('startTurn', turnState[player1Id]);
      io.to(player2Id).emit('notTurn', turnState[player2Id]);
      io.to(player.room).emit('startGame');
      characterList = [];
    }
  });

  socket.on('nameChosen', function (msg) {
    const player = getCurrentPlayer(socket.id);
    if (buttonState[socket.id] === 'off') {
      buttonState[socket.id] = 'on';
      socket.broadcast.to(player.room).emit('opponentPicked', msg, socket.id);
      io.to(socket.id).emit('selectCharacter', msg, socket.id);
    }
  });

  socket.on('changeTurn', function () {
    const player = getCurrentPlayer(socket.id);
    const playersInRoom = getRoomPlayers(player.room);
    const player1Id = playersInRoom[0].id;
    const player2Id = playersInRoom[1].id;
    turnState[player1Id] = !turnState[player1Id];
    turnState[player2Id] = !turnState[player2Id];
    for (var i = 0; i < socket_ids.length; i++) {
      if (turnState[socket_ids[i]] === true) {
        io.to(socket_ids[i]).emit('startTurn', turnState[socket_ids[i]]);
      } else {
        io.to(socket_ids[i]).emit('notTurn', turnState[socket_ids[i]]);
      }
    }
  });

  socket.on('insideRoom', function (character) {
    const player = getCurrentPlayer(socket.id);
    socket.broadcast.to(player.room).emit('insideRoom', character);
  });

  socket.on('madeSuggestion', function (suspect, weapon, place, id) {
    const player = getCurrentPlayer(socket.id);
    socket.broadcast
      .to(player.room)
      .emit('madeSuggestion', suspect, weapon, place, id);
  });

  socket.on('showCard', function (card, id) {
    io.to(id).emit('showCard', card);
  });

  socket.on('noCards', function (id) {
    io.to(id).emit('noCards', 'Player has no cards to show.');
  });

  socket.on(
    'accuse',
    function (
      suspect,
      weapon,
      place,
      culprit,
      murderWeapon,
      murderLocation,
      id
    ) {
      const player = getCurrentPlayer(socket.id);
      if (
        suspect === culprit &&
        weapon === murderWeapon &&
        place === murderLocation
      ) {
        io.to(id).emit('accusationMade', "That's correct! You win!");
        socket.broadcast
          .to(player.room)
          .emit(
            'accusationMade',
            'The other player got the right answer. It was ' +
              culprit +
              ' in the ' +
              murderLocation +
              ' with the ' +
              murderWeapon +
              '. You lose.'
          );
      } else {
        msg1 =
          'That was incorrect. You Lose. The correct answer was ' +
          culprit +
          ' in the ' +
          murderLocation +
          ' with the ' +
          murderWeapon +
          '.';
        io.to(id).emit('accusationMade', msg1);
        msg2 =
          'The other player made an incorrect accusation. You win! The correct answer was ' +
          culprit +
          ' in the ' +
          murderLocation +
          ' with the ' +
          murderWeapon +
          '.';
        socket.broadcast.to(player.room).emit('accusationMade', msg2);
      }
    }
  );
});

http.listen(process.env.PORT || 5500, function () {
  console.log('listening on port 5500');
});
