require('dotenv').config();
const os = require('os');
const io = require('socket.io-client');
const socket = io('http://'+process.env.PUBLIC_IP+'/'+process.env.PORT);
console.log(socket.io.uri) // Make sure to replace YOUR_PC_IP with your server's IP

function updateSystemInfo() {
  const memUsage = os.freemem() / os.totalmem() * 100;
  const uptime = os.uptime();

  // Update the local HTML
  document.getElementById('info').innerHTML = `
    <p>Free Memory: ${memUsage.toFixed(2)}%</p>
    <p>System Uptime: ${uptime} seconds</p>
  `;

  // Send data to the server
  socket.emit('system_info', { memUsage, uptime });
}

setInterval(updateSystemInfo, 1000);

function showNetwork () {
  document.getElementById('network').
  innerHTML = 'Server running on ' + process.env.PUBLIC_IP + '/' + process.env.PORT;

}
showNetwork();
