const { SSL_OP_NO_TICKET } = require("constants");
const express = require("express");
const app = express();
const http = require("http").createServer(app);

const io = require("socket.io")(http);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  socket.hello = "whassup";
  socket.on("join", (user) => {
    socket.user = user;
    console.log(`user ${user} connected`);
    socket.broadcast.emit("join", `${user} has joined the room`);
  });
  console.log("socket.hello:", socket.hello);
  socket.on("disconnect", (reason) => {
    console.log(`${socket.user} has disconnected:`, reason);
  });
  socket.on("chat message", (msg) => {
    console.log(`message from ${socket.id}: ${msg}`);
    io.emit("chat message", socket.user + ": " + msg);
  });
});

http.listen(3000, () => console.log("listening on :3000"));
