import express from 'express';
// import socket from 'socket.io';
import bodyParser from 'body-parser';
import http from 'http';
import authRoute from "./routes/authRoute";
import articleRoute from "./routes/articleRoute";
import path from 'path';
import "dotenv/config";

const app = express();
app.use(express.static(path.join(__dirname, 'Client')));
app.use(express.static('Client'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/article', articleRoute)


let port = process.env.PORT || 5000;
let server = http.createServer(app)
// let io = socket().listen(server);
// io.on('connection', (socket)=>{
//     console.log(`user connected, id: ${socket.id}`);
   
// })

server.listen(port,()=>{console.log(`server is listening on port ${port}`)});

export default server;