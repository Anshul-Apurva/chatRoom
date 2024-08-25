const { name } = require("ejs");
const express = require("express");
const app = express();
const http = require("http");
const{Server} = require("socket.io");
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("./public"));


const users = {};
io.on("connection" , (socket) => {
   
    

    socket.on("userMessage" , (message) => {
       
        io.emit("message" ,{message : message , name : users[socket.id]});
    });
    

    socket.on("user-joined" , (name) =>{
        
        users[socket.id] = name;
        io.emit("user-joined" , name);    
        
    });
    socket.on("disconnect" , () =>{
        socket.broadcast.emit("left" , users[socket.id]);
        delete[socket.id];
    });

    
});


app.get("/" , (req , res) => {
     
    return res.sendFile("index.html");
});


const PORT = process.env.PORT || 8000;
server.listen(PORT , () => console.log("Server started at PORT : " , PORT));