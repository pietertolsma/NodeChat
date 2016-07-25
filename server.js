//=============== Initialization ===============================================================

var fs = require('fs'); //Handles all the reading / writing files
var express = require('express'); //Makes things like routing easier
var app = express(); //Get express object, see express docs
var http = require('http').Server( app); //Used to listen for incoming requests
var io = require('socket.io')( http); //The secret sauce of this application, Socket.IO. Handles TCP connections

var localData;

//Read from the config file 'package.json'
fs.readFile('package.json', 'utf8', function (err, data) {
  if (err) {
    console.error("Failed to read config.json!", err);
  }
  localData = JSON.parse(data);
  startServer(JSON.parse(data)); //Start the server when all data is read
});

var connectedClients = []; //This array will be filled up with data from connected users.
var chatBackLog = []; //This array will be filled with the most recent chat messages.
var maxBackLogSize = 0; //This is the max size of the chat history, when cap is reached oldest will be removed.
var port = "3000" //Default port
var isListening = false;

//================= Getters + Setters ==========================================================

var getUsername = function getUsername(sessionId) {
  for (var i = 0; i < connectedClients.length; i++) {
    if (connectedClients[i].sessionId === sessionId) return connectedClients[i].name;
  }
}

var getUserIndex = function getUsexIndex(sessionId) {
  for (var i = 0; i < connectedClients.length; i++) {
    if (connectedClients[i].sessionId === sessionId) return i;
  }
}

var getHost = function getHost () {
  return "http://localhost:" + port;
}

var getInstance = function getInstance () {
  return io;
}

var getMaxUsernameLength = function getMaxUsernameLength () {
  return localData.maxUsernameLength;
}

var isServerListening = function isServerListening () {
  return isListening;
}

//================ Main Server Method ============================================================

var startServer = function startServer (data) {
  if(!data) data = localData;
  maxBackLogSize = data.maxChatHistory; //Set the maximum chat history
  port = data.port;
  app.use(express.static(__dirname + '/public')); //Makes sure that client has access to all public files
  //Create a server route on root ('/')
  app.get('/', function (req, res) {
    res.sendFile(__dirname + "/public/index.html"); //Send the homepage to client
  });

  //Fires when a new client connects
  io.on('connection', function (socket) {
    connectedClients.push({sessionId : socket.id, name : "Guest#" + connectedClients.length + "", admin : false});
    console.log('A user connected!');
    io.emit('chat history', chatBackLog.toString());
    io.emit('user change', connectedClients);

    //Fires when a client sends a chat message
    socket.on('chat message', function (msg) {
      if (msg) {
        var fullMessage = "[" + getUsername(socket.id) + "] " + msg;
        if (chatBackLog.length >= maxBackLogSize) chatBackLog.splice(0, 1);
        chatBackLog.push(fullMessage);
        io.emit('chat message', fullMessage);
      }
    });

    //Used for testing
    socket.on('echo', function (msg) {
      socket.emit('echo', msg);
    });

    //Fires when a user changes its username
    socket.on('username change', function (name) {
      if (name && (name.length <= data.maxUsernameLength) && isUsernameTaken(name)) {
        connectedClients[getUserIndex( socket.id)].name = name;
        io.emit('chat message', getUsername(socket.id) + " has joined the channel.");
        io.emit('user change', connectedClients);
      }
    });

    //Fires when client requests configs
    socket.on('configuration request', function(msg){
      socket.emit('configuration request', JSON.stringify(data));
    });

    //Fires when a user disconnects
    socket.on('disconnect', function () {
      console.log("A user disconnected!");
      io.emit('chat message', getUsername( socket.id) + " has left the channel.");
      connectedClients.splice(getUserIndex(socket.id), 1);
      io.emit('user change', connectedClients);
    });
  });

  //Start listening for incoming data
  http.listen(data.port, function () {
    console.log(data.name + " " + data.version + " started on port " + port);
    isListening = true;
  });
}

//Close the server
function closeServer(){
  http.close();
  console.log("Server shutting down..");
  isListening = false;
  return true;
}

function isUsernameTaken(name){
  for (var i = 0; i < connectedClients.length; i++) {
    if (connectedClients[i].name.toLowerCase() == name.toLowerCase()) return true;
  }
  return false;
}

//================== Declare Exports =====================================
module.exports = {
  closeServer: closeServer,
  getUsername: getUsername,
  getUserIndex: getUserIndex,
  getHost: getHost,
  getInstance: getInstance,
  startServer: startServer,
  isServerListening: isServerListening,
  getMaxUsernameLength: getMaxUsernameLength
}
