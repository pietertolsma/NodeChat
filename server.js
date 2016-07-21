var fs = require('fs');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

fs.readFile('package.json', 'utf8', function(err, data){
  if(err) {
    console.error("Failed to read config.json!", err);
  }
  startServer(JSON.parse(data));
});

var connectedClients = [];

function getUsername(sessionId){
  for(var i = 0; i < connectedClients.length; i++){
    if(connectedClients[i].sessionId === sessionId){
      return connectedClients[i].name;
    }
  }
}


function startServer(data){
  app.get('/', function(req, res){
    res.sendFile(__dirname + "/client/index.html");
  });

  io.on('connection', function(socket){
    connectedClients.push({sessionId : socket.id, name : "<Guest#" + connectedClients.length + "> ", admin : false});
    console.log('A user connected!');
    io.emit('chat message', getUsername(socket.id) + " has joined the channel.");
    socket.on('chat message', function(msg){
      io.emit('chat message', getUsername(socket.id) + msg);
    });
    socket.on('disconnect', function(){
      console.log("A user disconnected!");
      io.emit('chat message', getUsername(socket.id) + " has left the channel.");
      for(var i = 0; i < connectedClients.length; i++){
        if(connectedClients[i].sessionId === socket.id){
          connectedClients.splice(i, 1);
        }
      }
    });
  });

  http.listen(data.port, function(){
    console.log(data.name + " " + data.version + " started on port " + data.port);
  });
}
