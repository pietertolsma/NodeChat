var chai = require('chai'),
    mocha = require('mocha'),
    should = chai.should();

var io = require('socket.io-client');
const Browser = require('zombie');
Browser.localhost('localhost', 3003);
var ioOptions = {
      transports: ['websocket']
    , forceNew: true
    , reconnection: false};

var server = require("../server.js"), client1, client2;

describe("Client-side", function () {
  const browser = new Browser();
  describe("username verification", function () {
    before(function (done) {
      browser.visit('/', done);
    });
    it("should not allow for an empty name", function () {
      browser.fill('#setUsernameInput', "")
      browser.pressButton('#setUsernameButton');
      browser.assert.text(".verification-warning", "Your username cannot be empty..");
    });
    it("should not accept usernames longer than specified in package.json", function () {
      var maxLength = server.getMaxUsernameLength();
      var username = "a".repeat(maxLength + 1);
      browser.fill('#setUsernameInput', username)
      browser.pressButton('#setUsernameButton');
      browser.assert.text(".verification-warning", "Your username cannot be longer than " + maxLength + " characters.");
    });
  });
});

describe("Server-side", function () {
  beforeEach(function (done) {
    setTimeout(function () {
      var host = server.getHost();
      client1 = io(host, ioOptions);
      done();
    }, 100);
  });

  describe("Message Events", function () {
    it("should receive an echo when message is sent.", function (done) {
      client1.emit("echo", "Hello World");
      client1.on("echo", function(msg){
        msg.should.equal("Hello World");
        done();
      });
    });
    it("should receive chat message when sent", function(done){
      client1.emit("chat message", "hi");
      client1.on("chat message", function(msg){
        msg.should.not.equal("");
        done();
      });
    });

    it("should not accept messages larger than the threshold");
  });

  describe("User Events", function () {
    describe("username verification", function () {
      it("should not accept empty usernames", function (done) {
        client1.emit("user change", "");
        client1.on("error", function (data) {
          done();
        });
      });
      it("should not accept usernames longer than specified in package.json", function (done) {
        var username = "a".repeat(server.getMaxUsernameLength() + 1);
        client1.emit("user change", username);
        client1.on("error", function (data) {
          done();
        });
      });
      it("should not accept a username that is already taken");
      it("should not accept spamming");
    });
  });

  afterEach(function(done){
    client1.disconnect();
    done();
  });
});
