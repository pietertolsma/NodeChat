# NodeChat
Custom IRC using NodeJS. I built this to gain experience with NodeJS. It was an amazing way to learn about TCP connections between the client and server using NodeJS.
## How to use this IRC
- Download this entire repository. Make sure you have [NodeJS](https://nodejs.org/en/) installed on your machine.
- In the terminal/cmd, go into the project and type the following:  `node server.js`. The server should start.
- The default port is 3003. If you want to change this, edit the following line in package.json: `"port": 3003`.
- To start chatting away, go to `localhost:3003` (or another port if you changed it). You can also port forward your router
to let people who are not on your network join the channel, but keep in mind that this does make you vulnerable for hackers.

  ## Dependencies
This project depends on the following modules (they are already included so you don't need to download them separately):
- [Express v4.10.2](https://expressjs.com/)
- [Socket.IO v1.4.8](http://socket.io/)
  ## Disclaimer
I take zero responsibility for any repercussions this code could have. At the moment of writing I am not a professional developer, so please don't take this code as your only example for your own sake :).

## Credits
I want to give a big shoutout to [Socket.IO](http://socket.io/) for making [this awesome tutorial](http://socket.io/get-started/chat/)!
