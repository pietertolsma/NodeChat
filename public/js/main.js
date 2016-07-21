var socket = io();
$(document).ready(function () {
  $('#setUsername').modal('show');
  setTimeout(function () {
    $("#setUsernameInput").focus();
  }, 500);
});
$("#input").keypress(function (e) {
  if(e.which == 13) sendMessage($("#input").val());
});
$("#inputButton").on('click', function () {
  sendMessage($("#input").val());
});

function sumThis(a, b){
  return a+b;
}

function sendMessage (msg) {
  if(msg){
    socket.emit('chat message', msg);
    $('#input').val('');
    return true;
  }else{
    return false;
  }
}

$("#setUsernameButton").on('click', function () {changeUsername()});
$("#setUsernameInput").keypress(function (e) {
  if (e.which == 13) changeUsername();
});

function changeUsername () {
  var newName = $("#setUsernameInput").val();
  if (newName) {
    socket.emit('username change', newName);
    $("#setUsername").modal('hide');
    $("#input").focus();
  } else {
    $("#empty-warning").show();
  }
}
socket.on("chat message", function (msg) {
  $('#chat').append($("<li>").text(msg));
  var chat = $("#chat");
  chat.animate({scrollTop: chat.prop("scrollHeight") - chat.height()}, 100);
});

socket.on("user change", function (count) {
  $("#user-count").text(count);
});

socket.on("chat history", function (messages) {
  var msgArray = messages.split(',');
  for (var i = 0; i < msgArray.length; i++) {
    $('#chat').append($("<li>").text(msgArray[i]));
  }
  var chat = $("#chat");
  chat.animate({scrollTop: chat.prop("scrollHeight") - chat.height()}, 100);
});
