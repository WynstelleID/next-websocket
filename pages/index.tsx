// pages/index.tsx
import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

export default function Home() {
  const [groupMembers, setGroupMembers] = useState<string[]>([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Bergabung dengan grup ketika komponen dimuat
    socket.emit("joinGroup", "myGroup");

    // Mendengarkan pembaruan dari server
    socket.on("groupUpdated", (data) => {
      setGroupMembers(data.members);
    });

    return () => {
      // Membersihkan efek samping pada unmount
      socket.disconnect();
    };
  }, []);

  const handleJoinGroup = () => {
    // Mengirimkan perintah ke server untuk menambahkan anggota baru ke grup
    socket.emit("joinGroup", { groupName: "myGroup", username });
  };

  return (
    <div>
      <h1>Real-Time Group Members</h1>
      <ul>
        {groupMembers.map((member, index) => (
          <li key={index}>{member}</li>
        ))}
      </ul>
      <input
        type="text"
        placeholder="Masukkan Nama Anda"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleJoinGroup}>Join Group</button>
    </div>
  );
}
