var chai = require('chai'),
    mocha = require('mocha'),
    should = chai.should();

var io = require('socket.io-client');
var ioOptions = {
      transports: ['websocket']
    , forceNew: true
    , reconnection: false};

var server, client1, client2;

describe("Chat Events", function(){
  beforeEach(function(done){
    server = require("../server.js")
    client1 = io('http://localhost:3003', ioOptions);
    client2 = io('http://localhost:3003', ioOptions);
    done();
  });

  describe("Message Events", function(){
    it("Server should broadcast chat message", function(done){
      client1.emit("chat message", "");
      client2.on("chat message", function(msg){
        msg.should.not.equal("");
        done();
      });
    });
  });

  describe("User Events", function(){
    it("Server should not accept empty usernames", function(done){
      client1.emit("username change", "");
      client2.on("chat message", function(data){
        throw Error("Fail, server did send a response.");
      });
      setTimeout(function(){
        done();
      }, 300);
    });
  });

  afterEach(function(done){
    client1.disconnect();
    client2.disconnect();
    done();
  });

});
