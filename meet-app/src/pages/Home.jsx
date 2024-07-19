import React, {useState, useEffect,useCallback} from "react";
import { useNavigate } from "react-router-dom";
 import "./home.css";
 import { useSocket } from "../providers/Socket";
const Homepage = ()=>{
    const {socket} = useSocket();
    const navigate = useNavigate()
    // socket.emit('join-room', {roomId:'1', emailId:'any@ex.com'})
    const [email, setEmail] = useState();
    const [ roomId, setRoomId]= useState();
    // whenever joined gets an roomId then redirect tot that room
   const handleRoomJoined = useCallback(({roomId})=>{
        navigate(`/room/${roomId}`);
        // console.log('Room joined', roomId)
   },[navigate])
   const handleJoinRoom = ()=>{
    socket.emit('join-room', {emailId:email, roomId});
};
    useEffect(()=>{
        // console.log("useeffect")
        socket.on('joined-room',handleRoomJoined)
        return ()=>{socket.off('joined-room', handleRoomJoined);}
    }, [handleJoinRoom,socket]);
   
    return(
        <div className="homepage-container">
            <div className="input-container">

                <input value={email} type="email" onChange={e=>setEmail(e.target.value)} placeholder="Enter your email here" />
                <input value={roomId} type="text" onChange = {e=> setRoomId(e.target.value)} placeholder="Enter room code" />
                <button onClick={handleJoinRoom}>Enter room</button>
            </div>
        </div>
    )
}
export default Homepage;