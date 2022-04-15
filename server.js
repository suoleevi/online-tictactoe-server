const {
  validateInput,
  checkIfWin,
  checkIfTie,
  GameBoard,
} = require("./game.js");

const PORT = 3000;
const io = require("socket.io")(PORT, {
  cors: {
    origin: "*",
  },
});

let runningRoomId = 0;
const gameboards = [];

io.on("connection", (socket) => {
  // Joining a room
  const roomId = runningRoomId;
  const roomIdStr = roomId.toString();
  socket.join(roomIdStr);

  // Starting game when room is full
  if (io.sockets.adapter.rooms.get(roomIdStr).size === 2) {
    gameboards[roomId] = new GameBoard();

    // Randomizing X and O
    let random = Math.floor(Math.random());
    socket.emit("start", random === 1 ? "X" : "O");
    socket.to(roomIdStr).emit("start", random === 0 ? "X" : "O");

    runningRoomId++;
  }

  // Handling gameboard clicks
  socket.on("click", (data) => {
    if (!validateInput(data)) return;

    gameboards[roomId].setBox(data, socket.id);
    socket.to(roomId.toString()).emit("click", data);

    if (checkIfWin(gameboards[roomId])) {
      socket.emit("win");
      socket.to(roomIdStr).emit("lose");
    } else if (checkIfTie(gameboards[roomId])) {
      io.to(roomIdStr).emit("tie");
    }
  });

  // Resetting the game
  socket.on("reset", () => {
    gameboards[roomId] = new GameBoard();

    // Randomizing X and O
    let random = Math.floor(Math.random());
    socket.emit("start", random === 1 ? "X" : "O");
    socket.to(roomIdStr).emit("start", random === 0 ? "X" : "O");
  });

  // Handling socket disconnections
  socket.on("disconnect", (data) => {
    io.to(roomIdStr).emit("disconnected");
  });
});
