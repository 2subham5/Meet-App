const express = require('express');
const bodyParser = require('body-parser');
const {Server} = require('socket.io');

const io = new Server({
    cors: true,
});
const app = express();
app.use(bodyParser.json());
// to map a particular mail to socketId
const emailToSocketMapping = new Map();
const socketToEmailMapping  = new Map();
io.on('connection', (socket)=>{
    console.log("New Connection");
    // when the friend will request to join room
    // it will some data that would be:
    // roomId, emailId
    socket.on('join-room', data=>{

       const {roomId, emailId} = data;
       console.log("User", emailId, "Joined Room", roomId);
       emailToSocketMapping.set(emailId,socket.id);
       socketToEmailMapping.set(socket.id,emailId);
       socket.join(roomId);
    //    console.log("room joined", roomId);
       socket.emit('joined-room', {roomId});
       // it will broadcast when new user joins the room 
       console.log("broad")
       socket.broadcast.to(roomId).emit("user-joined", {emailId});
    });
    socket.on('call-user', data=>{
        const {emailId,offer} = data;
        const fromEmail = socketToEmailMapping.get(socket.id)
        console.log(fromEmail)
        const socketId = emailToSocketMapping.get(emailId);
        socket.to(socketId).emit('incoming-call', {from:fromEmail, offer})
    });

    socket.on('call-accepted', data =>{
        const{emailId, ans} = data;
        const socketId = emailToSocketMapping.get(emailId);
        socket.to(socketId).emit('call-accepted',{ans});
    } )
});

app.listen(8000, ()=> console.log('Running at port 8000'));
io.listen(8001);