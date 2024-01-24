import { Server } from 'socket.io';

const io = new Server({});

io.on("connection", async (socket) => {
    console.log("User connected");

    const allUsers = (await io.in("room-1").fetchSockets()).map(u => u.id);
    console.log(allUsers);

    socket.on("join-room", async (s) => {
        io.in(socket.id).socketsJoin(s);
        const allUsers = (await io.in(s).fetchSockets()).map(u => u.id);
        console.log(allUsers);
    });

    socket.on("create-room", async (s) => {
        const roomCode = (Math.random() + 1).toString(36).substring(7);
        socket.emit("room-created", roomCode);
        io.in(socket.id).socketsJoin(s);
    });
});

io.listen(Number(process.env.PORT) | 3000);