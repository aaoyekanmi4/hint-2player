
var library = {name: "Library", x:0,y:0,width:300,height:150};

          var study = {name:"Study", x:350,y:0,width:250,height:150};
          var hall= {name:"Hall", x:700,y:0,width:125,height:200};
          var lounge = {name:"Lounge", x:875,y:0,width:225,height:175};
          var diningRoom = {name:"Dining Room", x:875,y:250,width:225,height:125};
          var kitchen = {name: "Kitchen", x:625,y:450,width:250,height:150};
          var ballroom = {name:"Ballroom", x:275,y:375,width:225,height:225};
          var conservatory = {name: "Conservatory", x:0,y:300,width:225,height:225};
          var billiard = {name: "Billiard Room", x:925,y:425,width:175,height:175};

          var placesArray =[library, study, hall, lounge, diningRoom, kitchen, ballroom, conservatory, billiard];

          var places = [];

          placesArray.forEach( function(place) {
            places.push(place.name);
          });

          var weapons = ["Knife", "Candlestick", "Wrench", "Revolver", "Lead pipe", "Rope" ];

          var suspects = ["Col. Mustard", "Prof. Plum", "Ms. Scarlet", "Mr. Green", "Mrs. Peacock", "Mrs. Black"];

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
          var player1Cards = [];
          var player2Cards = [];


          function dealCards (array) {
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
   shuffle(places);
          shuffle(suspects);
          shuffle(weapons);



          var who = suspects.pop();
          var how = weapons.pop();
          var where = places.pop();

          var allCards = places;

          Array.prototype.push.apply(allCards, suspects);
          Array.prototype.push.apply(allCards, weapons);
          shuffle(allCards);
          dealCards(allCards);


io.on('connection', function(socket){

     Object.keys(io.sockets.sockets);
     Object.keys(io.sockets.sockets).forEach(function(id) {

    if (socket_ids.indexOf(id) < 0){
        socket_ids.push(id);
    }


});
     turnState[socket.id] = false;
     buttonState[socket.id] = "off";
     console.log(buttonState);
     console.log(turnState);
     console.log(socket_ids);

     io.emit('grabSocketId', socket_ids);


io.emit('addCards', player1Cards, player2Cards);

  io.to(socket_ids[0]).emit('sendCards', player1Cards);
  io.to(socket_ids[1]).emit('sendCards', player2Cards);

socket.on('playerMoved', function(x, y){
  io.emit('playerMoved', x, y);
  console.log(y)
})

socket.on('changeTurn', function(turnValue, id){
  turnState[id] = turnValue;
  console.log(turnState);
})

socket.on('nameChosen', function(msg){
  if (buttonState[socket.id] ==="off"){
  buttonState[socket.id] = "on";

    socket.broadcast.emit('nameChosen', msg, socket.id);
    io.to(socket.id).emit('alreadyPicked', msg, socket.id);

  }
  else  {
    io.to(socket.id).emit('cantPickAgain', "You've already picked a character");

  }
  });




});
http.listen(3000, function(){
  console.log('listening on *:3000');
});