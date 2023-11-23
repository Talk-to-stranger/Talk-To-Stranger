const express = require('express');
const app = express();
const port = 3000;
const router = require('../Server/routes');
const cors = require('cors');
const UserController = require('./controllers/UserController');
const { User } = require('./models');

// const http = require("http").Server(app);
// const io = require("socket.io")(http);
const { Server } = require('socket.io');
const { createServer } = require('http');
const user = require('./models/user');

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

  socket.on('init', async (data) => {
    access_token = data;

    const response = await UserController.loginUserSocket(socket.id, data);
    io.sockets.emit('usersUpdate', response.users);
    io.sockets.to(socketId).emit('myProfile', response.myProfile);
  });

  socket.on('userInformation', function (data) {
    socketsStatus[socketId] = data;
    // io.sockets.emit('usersUpdate', Users);
  });

  socket.on('voice', function (data) {
    var newData = data.split(';');
    newData[0] = 'data:audio/ogg;';
    newData = newData[0] + newData[1];
    // socket.broadcast.emit('send', newData);

    for (const id in socketsStatus) {
      if (id != socketId && !socketsStatus[id].status?.mute && socketsStatus[id].status?.online) socket.broadcast.to(id).emit('send', newData);
    }
  });

  socket.on('disconnect', async function () {
    console.log('disconnect');

    try {
      const user = await UserController.getUserBySocketId(socketId);
      delete socketsStatus[socketId];
      if (user) {
        await user.update({ status: 'offline' });
        const users = await User.findAll();
        io.sockets.emit('usersUpdate', users);
      }
    } catch (error) {
      console.log(error);
    }
  });
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(router);

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
