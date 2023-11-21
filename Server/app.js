const express = require('express');
const app = express();
const port = 3000;
const router = require('../Server/routes');
const UserController = require('./controllers/UserController');

// const http = require("http").Server(app);
// const io = require("socket.io")(http);
const { Server } = require("socket.io")
const { createServer } = require("http")

const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin:"*"
  }
})



io.on("connection", (socket) => {
  // console.log("connect")
  // console.log(socket.id, "<<< socket Id")
  // socket.emit
  socket.on("init", async (data) => {
    // console.log(socket.id, data)
    await UserController.loginUserSocket(socket.id, data)
  })
})

app.use(express.json());
app.use(express.urlencoded({ extended: false })) 
app.use(router)


server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
