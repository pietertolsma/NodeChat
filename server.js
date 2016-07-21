//=============== Initialization ===============================================================

var fs = require('fs'); //Handles all the reading / writing files
var express = require('express'); //Makes things like routing easier
var app = express(); //Get express object, see express docs
var http = require('http').Server(app); //Used to listen for incoming requests
var io = require('socket.io')(http); //The secret sauce of this application, Socket.IO. Handles TCP connections

//Read from the config file 'package.json'
fs.readFile('package.json', 'utf8', function (err, data) {
  if (err) {
    console.error("Failed to read config.json!", err);
  }
  startServer(JSON.parse(data)); //Start the server when all data is read
});

var connectedClients = []; //This array will be filled up with data from connected users.
var chatBackLog = []; //This array will be filled with the most recent chat messages.
var maxBackLogSize = 0; //This is the max size of the chat history, when cap is reached oldest will be removed.

//================= Getters + Setters ==========================================================

function getUsername (sessionId) {
  for (var i = 0; i < connectedClients.length; i++) {
    if (connectedClients[i].sessionId === sessionId) return connectedClients[i].name;
  }
}

function getUserIndex (sessionId) {
  for (var i = 0; i < connectedClients.length; i++) {
    if (connectedClients[i].sessionId === sessionId) return i;
  }
}

//================ Main Server Method ============================================================

function startServer (data) {
  maxBackLogSize = data.maxChatHistory; //Set the maximum chat history
  app.use(express.static(__dirname + '/public')); //Makes sure that client has access to all public files

  //Create a server route on root ('/')
  app.get('/', function (req, res) {
    res.sendFile(__dirname + "/public/index.html"); //Send the homepage to client
  });

  //Fires when a new client connects
  io.on('connection', function (socket) {
    connectedClients.push({sessionId : socket.id, name : "[Guest#" + connectedClients.length + "] ", admin : false});
    console.log('A user connected!');
    io.emit('chat history', chatBackLog.toString());
    io.emit('user change', connectedClients.length);

    //Fires when a client sends a chat message
    socket.on('chat message', function (msg) {
      if (msg) {
        var fullMessage = getUsername(socket.id) + msg;
        if (chatBackLog.length >= maxBackLogSize) chatBackLog.splice(0, 1);
        chatBackLog.push(fullMessage);
        io.emit('chat message', fullMessage);
      }
    });

    //Fires when a user changes its username
    socket.on('username change', function (name) {
      if (name) {
        connectedClients[getUserIndex(socket.id)].name = "[" + name + "] ";
        io.emit('chat message', getUsername(socket.id) + " has joined the channel.");
      }
    });

    //Fires when a user disconnects
    socket.on('disconnect', function () {
      console.log("A user disconnected!");
      io.emit('chat message', getUsername(socket.id) + " has left the channel.");
      connectedClients.splice(getUserIndex(socket.id), 1);
      io.emit('user change', connectedClients.length);
    });
  });

  //Start listening for incoming data
  http.listen(data.port, function () {
    console.log(data.name + " " + data.version + " started on port " + data.port);
  });
}
