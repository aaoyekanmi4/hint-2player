




          //Fisher Yates shuffle
          function shuffle (array) {
            var i = 0
              , j = 0
              , temp = null

            for (i = array.length - 1; i > 0; i -= 1) {
              j = Math.floor(Math.random() * (i + 1))
              temp = array[i]
              array[i] = array[j]
              array[j] = temp
            }
          }



          function dealCards (array, player1Cards, player2Cards) {
            for (var i = 0; i < array.length; i++) {

              player1Cards.push(array[i]);
              i += 1
              player2Cards.push(array[i]);
            }


          }





var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
res.sendFile(__dirname + '/index.html');
});




var buttonState = {};
var socket_ids = [];
var turnState = {};
var characterList = [];
var users = [];



io.on('connection', function(socket){


     socket_ids.push(socket.id)

  socket.on('disconnect', function(){


      var socketIndex = socket_ids.indexOf(socket.id)

socket_ids.splice(socketIndex, 1);



console.log(socket_ids)
  });
     turnState[socket.id] = false;
     buttonState[socket.id] = "off";
     console.log(buttonState);
     console.log(turnState);
     console.log(socket_ids);


if (socket_ids.length === 2) {
  var player1Cards = [];
var player2Cards = [];
var locations = ["Hall", "Study", "Dining Room", "Ballroom", "Billiard", "Conservatory", "Lounge", "Kitchen", "Library"]

          var weapons = ["Knife", "Candlestick", "Wrench", "Revolver", "Lead pipe", "Rope" ];

          var suspects = ["Col. Mustard", "Prof. Plum", "Ms. Scarlet", "Mr. Green", "Mrs. Peacock", "Mrs. Black"];

  shuffle(locations);
          shuffle(suspects);
          shuffle(weapons);



          var who = suspects.pop();
          var how = weapons.pop();
          var where = locations.pop();

          var allCards = [];

          Array.prototype.push.apply(allCards, locations)
          Array.prototype.push.apply(allCards, suspects);
          Array.prototype.push.apply(allCards, weapons);
          shuffle(allCards);
          dealCards(allCards, player1Cards, player2Cards);

  player1x = 537.5;
  player1y = 312.5;

  player2x = 512.5;
  player2y = 312.5;

    io.to(socket_ids[0]).emit('grabSocketId', socket_ids[0], player1Cards, player1x, player1y);
    io.to(socket_ids[1]).emit('grabSocketId', socket_ids[1], player2Cards,player2x, player2y);



}

socket.on('opponentInfo', function(id, x, y, color, character){
  socket.broadcast.emit('opponentInfo', id, x, y, color, character)

})




socket.on('playerMoved', function(x, y){

  io.emit('playerMoved', x, y, socket.id);

})

socket.on('trackRoll', function(movesLeft, rollAmount){
  io.emit('showMovesLeft', movesLeft, rollAmount);
})



socket.on('startGame', function(character){
  characterList.push(character);
  console.log(characterList)
  if (characterList.length === 2){
    turnState[socket_ids[0]] = true;
    turnState[socket_ids[1]] = false;

    io.to(socket_ids[0]).emit('startTurn', turnState[socket_ids[0]]);
    io.to(socket_ids[1]).emit('notTurn', turnState[socket_ids[1]]);
    io.emit('startGame')
    characterList = []

  }
});


socket.on('nameChosen', function(msg){
  if (buttonState[socket.id] ==="off"){
  buttonState[socket.id] = "on";

    socket.broadcast.emit('opponentPicked', msg, socket.id);
    io.to(socket.id).emit('selectCharacter', msg, socket.id);

  }
  });



socket.on('changeTurn', function(){
  turnState[socket_ids[0]] = (!turnState[socket_ids[0]]);
    turnState[socket_ids[1]] = (!turnState[socket_ids[1]]);
    for (var i = 0; i < socket_ids.length; i++) {
      if (turnState[socket_ids[i]] ===true){
        io.to(socket_ids[i]).emit('startTurn', turnState[socket_ids[i]]);
      }
      else{
        io.to(socket_ids[i]).emit('notTurn', turnState[socket_ids[i]]);
      }
    }



})

socket.on('insideRoom', function(character){
  socket.broadcast.emit('insideRoom', character);
})

socket.on('madeSuggestion', function(suspect, weapon, place, id){
  socket.broadcast.emit('madeSuggestion', suspect, weapon, place, id);

})


socket.on('showCard', function(card, id){

  io.to(id).emit('showCard', card);
});

socket.on('noCards', function(id){
  io.to(id).emit('noCards', "Player has no cards to show.")
})

socket.on('accuse', function(suspect, weapon, place, id){

  if (suspect === who && weapon === how && place === where){

     console.log("right");
    io.to(id).emit('accused', "That's correct! You win!");
    socket.broadcast.emit('accused',"The other player got the right answer. It was " + who + " in the " + where + " with the " + how +". You lose.");


  }
  else{
    console.log("wrong");
    msg1 = "That was incorrect. You Lose. The correct answer was " + who + " in the " + where + " with the " + how +"."
    console.log(msg1);
io.to(id).emit('accused', msg1);
msg2 = "The other player made an incorrect accusation. You win! The correct answer was " + who + " in the " + where + " with the " + how +".";
socket.broadcast.emit('accused', msg2);
  }
})
});
 http.listen(process.env.PORT || 5000, function(){
   console.log('listening on port 5000')
 })

