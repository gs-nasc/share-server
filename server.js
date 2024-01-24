const express = require("express")
const app = express()
const http = require("http").Server(app)
const io = require("socket.io")(http, {
    cors: {
        origin: "*"
    }
})

const port = process.env.PORT || 8000

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html")
})

io.on('connection', async (socket) => {
    const allUsers = (await io.in("room-1").fetchSockets()).map(u => u.id);
    console.log(allUsers);

    socket.on("join-room", async (s) => {
        socket.join(s);
        const allUsers = (await io.in(s).fetchSockets()).map(u => u.id);
        console.log(allUsers);
    });

    socket.on("create-room", async (s) => {
        const roomCode = (Math.random() + 1).toString(36).substring(7);
        socket.emit("room-created", roomCode);
    });

    socket.on("event", async(e) => {
        socket.rooms.forEach(r => {
            if(r != socket.id) io.in(r).emit("event", e);
        });
    })
})


http.listen(port, () => {
  console.log(`App listening on port ${port}`)
});