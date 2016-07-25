[![Stories in Ready](https://badge.waffle.io/pietertolsma/NodeChat.png?label=ready&title=Ready)](https://waffle.io/pietertolsma/NodeChat)
[![Build Status](https://travis-ci.org/pietertolsma/NodeChat.svg?branch=master)](https://travis-ci.org/pietertolsma/NodeChat)
[![Coverage Status](https://coveralls.io/repos/github/pietertolsma/NodeChat/badge.svg)](https://coveralls.io/github/pietertolsma/NodeChat?branch=master)

# NodeChat
Custom IRC using NodeJS. Easily setup your own chatroom in a couple of simple steps!

The goal of NodeChat is to be a very configurable, yet easy to set up and clean chat application. It also serves as a playground to test out features of NodeJS!

![NodeChat Preview](/../screenshots/preview.png?raw=true "NodeChat v0.0.1")

## How to set up your own server

![NodeChat Preview](/../screenshots/console.png?raw=true "NodeChat v0.0.1")
- Download this entire repository. Make sure you have [NodeJS](https://nodejs.org/en/) installed on your machine.
- In the terminal/cmd, go into the project and type the following:  `node server.js`. The server should start.
- To start chatting away, go to `localhost:3003` (or another port if you changed it). To go public, you will need to port forward the port specified in `package.json`. When you've done this, send the following address to your friends: [YOUR PUBLIC IP]:[SPECIFIED PORT]. Click [here](http://www.whatsmyip.org/) to find out what your IP is.

  ### Configuration

  You can change the following parameters in `package.json`:
  - `chatTitle`: change the name of NodeChat (default). This will show up on the client page.
  - `port`: change what port this server listens to.
  - `maxChatHistory`: change the maximum amount of previous messages the server sends to a new user.
  - `maxUsernameLength`: change the maximum length of a username.

  ### Disclaimer

  Opening your ports up is a serious security hazard. Hackers can infiltrate your network via open ports, so please be wary of this! We take no responsibility for any damage.

  ### Dependencies
This project depends on the following modules (they are already included so you don't need to download them separately):
  - [Express v4.10.2](https://expressjs.com/)
  - [Socket.IO v1.4.8](http://socket.io/)

## Contributing

If you want to contribute, that's great! Please read our [contributing guidelines](https://github.com/pietertolsma/NodeChat/blob/master/CONTRIBUTING.md) before starting though!

## Credits
I want to give a big shoutout to [Socket.IO](http://socket.io/) for making this project possible!
