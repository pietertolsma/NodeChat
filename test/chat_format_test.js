var chai = require('chai'),
    mocha = require('mocha'),
    should = chai.should();

var io = require('socket.io-client');
var ioOptions = {
      transports: ['websocket']
    , forceNew: true
    , reconnection: false};

var server = require("../server.js"), client1, client2;
var ioServer = server.getInstance();

describe("Chat Events", function(){
  beforeEach(function(done){
    if(!server.isServerListening()){
      server.startServer();
    }
    var host = server.getHost();
    client1 = io(host, ioOptions);
    client2 = io(host, ioOptions);
    done();
  });

  describe("Message Events", function () {
    it("Client should receive an echo when message is sent.", function (done) {
      client1.emit("echo", "Hello World");
      client1.on("echo", function(msg){
        msg.should.equal("Hello World");
        done();
      });
    });
    it("Server should broadcast chat message", function(done){
      client1.emit("chat message", "hi");
      client2.on("chat message", function(msg){
        msg.should.not.equal("");
        done();
      });
    });
  });

  describe("User Events", function () {
    describe("on username change", function () {
      it("should not accept empty usernames", function (done) {
        client1.emit("username change", "");
        client2.on("chat message", function (data) {
          throw Error("Fail, server did send a response.");
        });
        setTimeout(function () {
          done();
        }, 300);
      });
      it("should not accept usernames longer than 15 chars", function (done) {

      });
    });
  });

  afterEach(function(done){
    client1.disconnect();
    client2.disconnect();
    done();
  });
});
