import express from 'express';
import socket from 'socket.io';
import bodyParser from 'body-parser';
import http from 'http';
import authRoute from "./routes/authRoute";
import path from 'path';
require('dotenv').config();

//const apiVersion = express.Router();
const app = express();
app.use(express.static(path.join(__dirname, 'Client')));
app.use(express.static('Client'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use('/api/v1/red-flags', getRedFlagRecords);
// app.use('/api/v1/interventions', interventionRecord);
app.use('/api/v1/auth', authRoute);

let port = process.env.PORT || 5000;
let server = http.createServer(app)
let io = socket().listen(server);
io.on('connection', (socket)=>{
    console.log(`user connected, id: ${socket.id}`);
   
})

server.listen(port,()=>{console.log(`server is listening on port ${port}`)});

export default server;