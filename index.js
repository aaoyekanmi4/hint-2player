var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const { playerJoin, getRoomPlayers, assignPlayerPositions }
  = require('./helpers/players')
const { shuffle, dealCards } = require('./helpers/dealCards')
const { suspects, weapons, locations } = require('./helpers/cards');

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

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
  // increase room number of more than 2 clients join
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
      const players =  assignPlayerPositions(playersInRoom)

      shuffle(locations);
      shuffle(suspects);
      shuffle(weapons);

      var who = suspects.pop();
      var how = weapons.pop();
      var where = locations.pop();

      var allCards = [...locations, ...suspects, ...weapons];
 
      shuffle(allCards);
      const dealtPlayers = dealCards(allCards, players[0], players[1]);
     
      io.emit('cardsChosen', who, where, how);
  
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
  })

  socket.on('opponentInfo', function (id, x, y, color, character) {
    socket.broadcast.emit('opponentInfo', id, x, y, color, character);
  });

  socket.on('playerMoved', function (x, y) {
    io.emit('playerMoved', x, y, socket.id);
  });

  socket.on('trackRoll', function (movesLeft, rollAmount) {
    io.emit('showMovesLeft', movesLeft, rollAmount);
  });

  socket.on('startGame', function (character) {
    characterList.push(character);
    if (characterList.length === 2) {
      turnState[socket_ids[0]] = true;
      turnState[socket_ids[1]] = false;
      io.to(socket_ids[0]).emit('startTurn', turnState[socket_ids[0]]);
      io.to(socket_ids[1]).emit('notTurn', turnState[socket_ids[1]]);
      io.emit('startGame');
      characterList = [];
    }
  });

  socket.on('nameChosen', function (msg) {
    if (buttonState[socket.id] === 'off') {
      buttonState[socket.id] = 'on';
      socket.broadcast.emit('opponentPicked', msg, socket.id);
      io.to(socket.id).emit('selectCharacter', msg, socket.id);
    }
  });

  socket.on('changeTurn', function () {
    turnState[socket_ids[0]] = !turnState[socket_ids[0]];
    turnState[socket_ids[1]] = !turnState[socket_ids[1]];
    for (var i = 0; i < socket_ids.length; i++) {
      if (turnState[socket_ids[i]] === true) {
        io.to(socket_ids[i]).emit('startTurn', turnState[socket_ids[i]]);
      } else {
        io.to(socket_ids[i]).emit('notTurn', turnState[socket_ids[i]]);
      }
    }
  });

  socket.on('insideRoom', function (character) {
    socket.broadcast.emit('insideRoom', character);
  });

  socket.on('madeSuggestion', function (suspect, weapon, place, id) {
    socket.broadcast.emit('madeSuggestion', suspect, weapon, place, id);
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
      if (
        suspect === culprit &&
        weapon === murderWeapon &&
        place === murderLocation
      ) {
        io.to(id).emit('accused', "That's correct! You win!");
        socket.broadcast.emit(
          'accused',
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
        io.to(id).emit('accused', msg1);
        msg2 =
          'The other player made an incorrect accusation. You win! The correct answer was ' +
          culprit +
          ' in the ' +
          murderLocation +
          ' with the ' +
          murderWeapon +
          '.';
        socket.broadcast.emit('accused', msg2);
      }
    }
  );
});

http.listen(process.env.PORT || 5000, function () {
  console.log('listening on port 5000');
});
