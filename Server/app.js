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

const socketsStatus = [];
let Users = [];
let access_token = '';

io.on('connection', function (socket) {
  console.log('connect', socket.id);
  const socketId = socket.id;
  // const user = await user;
  socketsStatus[socket.id] = {};

  socket.on('init', async (data) => {
    access_token = data;
    // console.log(socket.id, data);
    const response = await UserController.loginUserSocket(socket.id, data);
    // console.log(data);
    io.sockets.emit('usersUpdate', response);
  });

  socket.on('voice', function (data) {
    var newData = data.split(';');
    newData[0] = 'data:audio/ogg;';
    newData = newData[0] + newData[1];

    for (const id in socketsStatus) {
      if (id != socketId && !socketsStatus[id].mute && socketsStatus[id].online) socket.broadcast.to(id).emit('send', newData);
    }
  });

  socket.on('userInformation', function (data) {
    socketsStatus[socketId] = data;
    // console.log(Users);
    // io.sockets.emit('usersUpdate', Users);
  });

  socket.on('disconnect', async function () {
    console.log('disconnect');
    const response = await UserController.offline(access_token);
    delete socketsStatus[socketId];
    io.sockets.emit('usersUpdate', response);
  });
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(router);

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
