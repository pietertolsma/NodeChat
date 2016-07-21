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
var chatBackLog = [];
var maxBackLogSize = 0; //Default

function getUsername (sessionId) {
  for (var i = 0; i < connectedClients.length; i++) {
    if (connectedClients[i].sessionId === sessionId) return connectedClients[i].name;
  }
}

function findUserIndex (sessionId) {
  for (var i = 0; i < connectedClients.length; i++) {
    if (connectedClients[i].sessionId === sessionId) return i;
  }
}

function startServer (data) {
  maxBackLogSize = data.maxChatHistory;
  //Include static files such as css and js
  app.use(express.static(__dirname + '/public'));

  //Creates the server (routing)
  app.get('/', function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
  });

  //Fires when a new client connects
  io.on('connection', function (socket) {
    connectedClients.push({sessionId : socket.id, name : "[Guest#" + connectedClients.length + "] ", admin : false});
    console.log('A user connected!');
    io.emit('chat history', chatBackLog.toString());
    io.emit('user change', connectedClients.length);

    //Fires when the a client sends a chat message
    socket.on('chat message', function (msg) {
      var fullMessage = getUsername(socket.id) + msg;
      if (chatBackLog.length >= maxBackLogSize) chatBackLog.splice(0, 1);
      chatBackLog.push(fullMessage);
      io.emit('chat message', fullMessage);
    });

    socket.on('username change', function (name) {
      connectedClients[findUserIndex(socket.id)].name = "[" + name + "] ";
      io.emit('chat message', getUsername(socket.id) + " has joined the channel.");
    });

    //Fires when a user disconnects
    socket.on('disconnect', function(){
      console.log("A user disconnected!");
      io.emit('chat message', getUsername(socket.id) + " has left the channel.");
      connectedClients.splice(findUserIndex(socket.id), 1);
      io.emit('user change', connectedClients.length);
    });
  });

  //Start listening for incoming data
  http.listen(data.port, function(){
    console.log(data.name + " " + data.version + " started on port " + data.port);
  });
}
