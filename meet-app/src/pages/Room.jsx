// import React , {useEffect, useCallback,useState}from "react";
// import ReactPlayer from 'react-player';
// import { useSocket } from "../providers/Socket";
// import { usePeer } from "../providers/Peer";
// const RoomePage = ()=>{
//     const {socket} = useSocket();
//     const {peer, createOffer,createAnswer,setRemoteAns,sendStream,remoteStream} = usePeer();

//     const[myStream,setMyStream] = useState(null);
// // to render other person stream
// const [remoteEmailId, setRemoteEmailId] = useState();

//     const handleNewUserJoined = useCallback(async(data)=>{
//         const {emailId} = data
//         console.log('New User joined room', emailId);
//         const offer = await createOffer();
//         socket.emit('call-user', {emailId, offer});
//         setRemoteEmailId(emailId)
//     },[createOffer, socket]);

//     const handleIncommingCall = useCallback(async(data)=>{
//   const {from, offer} = data;
//   console.log('Incoming call from', from, offer);
//   // to send back answer
//   const ans = await createAnswer(offer);
//   // emailId of the sender answer which we are sending
//   socket.emit('call-accepted', {emailId:from, ans})
//   // for reconnection
//   setRemoteEmailId(from)
//     },[createAnswer,socket])
 
// const handleCallAccepted = useCallback(async(data)=>{
//   const {ans} = data;
//   console.log('Call got accepted', ans);
//   await setRemoteAns(ans);
// },[setRemoteAns])
    
// const getUserMediaStream = useCallback(async()=>{
//     const stream = await navigator.mediaDevices.getUserMedia({audio:true, video:true})
//     // sendStream(stream);
//     setMyStream(stream);
// },[])

// const handleNegosiation = useCallback(()=>{
//   const localOffer = peer.localDescription;
//   // resend offer
//   socket.emit('call-user',{emailId:remoteEmailId, offer:localOffer})
// },[peer.localDescription,remoteEmailId,socket])

//     useEffect(()=>{
//         // when broadcasted that a user is joined
//         socket.on('user-joined',handleNewUserJoined);
//         socket.on('incoming-call', handleIncommingCall);
//         socket.on('call-accepted', handleCallAccepted);
        
//         return () => {
//             socket.off('user-joined', handleNewUserJoined);
//             socket.off('incomming-call', handleIncommingCall);
//             socket.off('call-accepted', handleCallAccepted);
//         };
//     }, [handleCallAccepted,handleIncommingCall,handleNewUserJoined,socket]);
// useEffect(()=>{
//   peer.addEventListener("negotiationneeded", handleNegosiation);
//   return()=>{
//     peer.removeEventListener("negotiationneeded", handleNegosiation);
//   }
// },[])
//     useEffect(()=>{
//       getUserMediaStream();
//     },[getUserMediaStream])
//   return (
//     <div className="room-page-container">
//        <h1>hello</h1>
//        <h4>you are connected to {remoteEmailId}</h4>
//        <button onClick={(e)=> sendStream(myStream)}>Send My Video</button>
//        <ReactPlayer url={myStream} playing muted/>
//        <ReactPlayer url={remoteStream} playing/>
//     </div>
//   )
// }

// export default RoomePage;

import React, { useEffect, useCallback, useState } from "react";
import ReactPlayer from "react-player";
import { useSocket } from "../providers/Socket";
import { usePeer } from "../providers/Peer";

const RoomePage = () => {
    const { socket } = useSocket();
    const { peer, createOffer, createAnswer, setRemoteAns, sendStream, remoteStream } = usePeer();

    const [myStream, setMyStream] = useState(null);
    const [remoteEmailId, setRemoteEmailId] = useState();

    const handleNewUserJoined = useCallback(async (data) => {
        const { emailId } = data;
        console.log("New User joined room", emailId);
        const offer = await createOffer();
        socket.emit("call-user", { emailId, offer });
        setRemoteEmailId(emailId);
    }, [createOffer, socket]);

    const handleIncommingCall = useCallback(async (data) => {
        const { from, offer } = data;
        console.log("Incoming call from", from, offer);
        const ans = await createAnswer(offer);
        socket.emit("call-accepted", { emailId: from, ans });
        setRemoteEmailId(from);
    }, [createAnswer, socket]);

    const handleCallAccepted = useCallback(async (data) => {
        const { ans } = data;
        console.log("Call got accepted", ans);
        await setRemoteAns(ans);
    }, [setRemoteAns]);

    const getUserMediaStream = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        setMyStream(stream);
    }, []);

    const handleNegotiation = useCallback(async () => {
        try {
            const offer = await peer.createOffer();
            await peer.setLocalDescription(offer);
            socket.emit("call-user", { emailId: remoteEmailId, offer });
        } catch (error) {
            console.error("Error during renegotiation:", error);
        }
    }, [peer, remoteEmailId, socket]);

    useEffect(() => {
        socket.on("user-joined", handleNewUserJoined);
        socket.on("incoming-call", handleIncommingCall);
        socket.on("call-accepted", handleCallAccepted);

        return () => {
            socket.off("user-joined", handleNewUserJoined);
            socket.off("incoming-call", handleIncommingCall);
            socket.off("call-accepted", handleCallAccepted);
        };
    }, [handleCallAccepted, handleIncommingCall, handleNewUserJoined, socket]);

    useEffect(() => {
        peer.addEventListener("negotiationneeded", handleNegotiation);
        return () => {
            peer.removeEventListener("negotiationneeded", handleNegotiation);
        };
    }, [handleNegotiation, peer]);

    useEffect(() => {
        getUserMediaStream();
    }, [getUserMediaStream]);

    useEffect(() => {
        if (myStream) {
            sendStream(myStream);
        }
    }, [myStream, sendStream]);

    return (
        <div className="room-page-container">
            <h1>Hello</h1>
            <h4>You are connected to {remoteEmailId}</h4>
            <button onClick={() => sendStream(myStream)}>Send My Video</button>
            <ReactPlayer url={myStream} playing muted />
            <ReactPlayer url={remoteStream } playing />
        </div>
    );
};

export default RoomePage;
