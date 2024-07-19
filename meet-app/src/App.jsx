import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Home";
import RoomePage from "./pages/Room";
import { SocketProvider } from "./providers/Socket";
import { PeerProvider } from "./providers/Peer";
function App() {


  return (
    <div>
      <SocketProvider>
        <PeerProvider>
          <Routes>

            <Route path="/" element={<Homepage />} />
            <Route path="/room/:roomId" element={<RoomePage />} />
          </Routes>
        </PeerProvider>
      </SocketProvider>
    </div>
  );
}

export default App
