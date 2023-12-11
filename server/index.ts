// server/index.ts
const { createServer } = require("http");
import { Server, Socket } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000", // Sesuaikan dengan URL frontend Anda
    methods: ["GET", "POST"],
  },
});

const groupMembers: Record<string, string[]> = {};

io.on("connection", (socket: Socket) => {
  console.log("User connected");

  socket.on(
    "joinGroup",
    ({ groupName, username }: { groupName: string; username: string }) => {
      socket.join(groupName);

      // Menambahkan nama pengguna ke daftar anggota grup
      if (!groupMembers[groupName]) {
        groupMembers[groupName] = [];
      }
      groupMembers[groupName].push(username);

      // Mengirim pembaruan anggota grup ke semua klien di grup tersebut
      io.to(groupName).emit("groupUpdated", {
        groupId: groupName,
        members: groupMembers[groupName],
      });
    }
  );

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server listening on *:${PORT}`);
});
