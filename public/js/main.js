
var socket = io();
var data = JSON.parse('{"maxUsernameLength": 0}');
socket.emit("configuration request", "");

$(document).ready(function () {
  $('#setUsername').modal('show');
  setTimeout(function () {
    $("#setUsernameInput").focus();
  }, 500);
});

//Send message when enter or button is pressed
$("#input").keypress(function (e) {
  if(e.which == 13) sendMessage($("#input").val());
});
$("#inputButton").on('click', function () {
  sendMessage($("#input").val());
});

//TODO: Message validation
function sendMessage (msg) {
  if(msg){
    socket.emit('chat message', msg);
    $('#input').val('');
    return true;
  }else{
    return false;
  }
}

//Change username when button or enter is pressed
$("#setUsernameButton").on('click', function () {changeUsername()});
$("#setUsernameInput").keypress(function (e) {
  if (e.which == 13) changeUsername();
});

function changeUsername () {
  var newName = $("#setUsernameInput").val();
  if (newName && newName.length <= data.maxUsernameLength) {
    socket.emit('username change', newName);
    $("#setUsername").modal('hide');
    $("#input").focus();
  } else if (!newName) {
    $("#empty-warning").text("Your username cannot be empty..");
    $("#empty-warning").show();
  } else {
    $("#empty-warning").text("Your username cannot be longer than " + data.maxUsernameLength + " characters.");
    $("#empty-warning").show();
  }
}

//========== Socket Listeners =====================================

//Fires when client receives chat message
socket.on("chat message", function (msg) {
  $('#chat').append($("<li>").text(msg));
  var chat = $("#chat");
  chat.animate({scrollTop: chat.prop("scrollHeight") - chat.height()}, 100);
});

//Fires when a username changes
socket.on("user change", function (count) {
  $("#user-count").text(count);
});

//Fires when the server sends this client the chat history
socket.on("chat history", function (messages) {
  var msgArray = messages.split(',');
  for (var i = 0; i < msgArray.length; i++) {
    $('#chat').append($("<li>").text(msgArray[i]));
  }
  var chat = $("#chat");
  chat.animate({scrollTop: chat.prop("scrollHeight") - chat.height()}, 100);
});

//Fires when the client receives the configuration file from the server
socket.on("configuration request", function (info) {
  data = JSON.parse(info);
});
