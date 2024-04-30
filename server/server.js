require('dotenv').config();
const http = require('http');
const socketIo = require('socket.io');
const si = require('systeminformation');
const server = http.createServer();
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
const fs = require('fs');
const path = require('path');
const os = require('os');
io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Send data periodically
  setInterval(() => {
    si.cpuTemperature()
      .then(temp => {
        socket.emit('cpu_temp', temp);
      })
      .catch(error => console.error(error));

    si.mem()
      .then(memory => {
        socket.emit('memory_info', memory);
      })
      .catch(error => console.error(error));
  }, 1000); // Update interval

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
let ipAdress = process.env.PUBLIC_IP || 'localhost';

server.listen(process.env.PORT || 5000, () => {
    console.log('Server running on ' + ipAdress + '/' + `${server.address().port}`);
    });

