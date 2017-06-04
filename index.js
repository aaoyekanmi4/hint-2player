var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
res.sendFile(__dirname + '/index.html');
});

var buttonState = {}
io.on('connection', function(socket){
var socket_ids = []


     Object.keys(io.sockets.sockets);
     Object.keys(io.sockets.sockets).forEach(function(id) {

    if (socket_ids.indexOf(id) < 0){
        socket_ids.push(id);
    }


});
     buttonState[socket.id] = "off";
     console.log(buttonState);
     console.log(socket_ids);

     io.emit('grabSocketId', socket_ids);





socket.on('nameChosen', function(msg){
  if (buttonState[socket.id] ==="off"){
  buttonState[socket.id] = "on";

    socket.broadcast.emit('nameChosen', msg, socket.id);
    io.to(socket.id).emit('alreadyPicked', msg, socket.id);
    console.log("1st time clicking button");
  }
  else {
    io.to(socket.id).emit('cantPickAgain', "You've already picked a character");
    console.log("2nd time clicking button");
  }
  });

socket.on('sendCards', function(player1cards, player2cards){
  if (player1cards !==[]){
  io.emit('sendCards', player1cards, player2cards);
}
})

});
http.listen(3000, function(){
  console.log('listening on *:3000');
});