const express = require('express');
const app = express();
const port = 3000;
const router = require('../Server/routes');
const cors = require('cors');
const UserController = require('./controllers/UserController');

// const http = require("http").Server(app);
// const io = require("socket.io")(http);
const { Server } = require('socket.io');
const { createServer } = require('http');

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

// io.on('connection', (socket) => {
//   // console.log("connect")
//   // console.log(socket.id, "<<< socket Id")
//   // socket.emit

// });

const socketsStatus = {};

io.on('connection', function (socket) {
  console.log('connect', socket.id);
  const socketId = socket.id;
  socketsStatus[socket.id] = {};
  console.log(socketsStatus);

  socket.on('init', async (data) => {
    // console.log(socket.id, data);
    await UserController.loginUserSocket(socket.id, data);
  });

  socket.on('voice', function (data) {
    var newData = data.split(';');
    newData[0] = 'data:audio/ogg;';
    newData = newData[0] + newData[1];
    // console.log(socketsStatus, '<<<<< ini socket');

    // socket.broadcast.emit('send', newData);

    for (const id in socketsStatus) {
      if (id != socketId && !socketsStatus[id].mute && socketsStatus[id].online) socket.broadcast.to(id).emit('send', newData);
    }
  });

  socket.on('userInformation', function (data) {
    socketsStatus[socketId] = data;

    io.sockets.emit('usersUpdate', socketsStatus);
  });

  socket.on('disconnect', function () {
    console.log('disconnect');
    delete socketsStatus[socketId];
  });
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(router);

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
