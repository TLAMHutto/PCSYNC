const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');
const net = require('electron').net;
const os = require('os');

class IPFetcher extends EventEmitter {
  fetchPublicIP() {
    const request = net.request('https://api.ipify.org?format=json');
    request.on('response', (response) => {
      response.on('data', (chunk) => {
        const ip = JSON.parse(chunk).ip;
        console.log(`Your public IP address is: ${ip}`);
        this.emit('ipFetched', ip);
        this.saveIP(ip);
      });
    });
    request.end();
  }

  saveIP(ip) {
    const filePath = path.join(__dirname, '..', '.env');

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          // The .env file does not exist, so create it and write the variable
          console.log('.env file does not exist, creating one.');
          return fs.writeFile(filePath, `PUBLIC_IP=${ip}${os.EOL}`, 'utf8', error => {
              if (error) {
                  console.error('Failed to create .env file:', error);
              } else {
                  console.log(`.env file created and PUBLIC_IP set to ${ip}`);
              }
          });
        } else {
          console.error('Error reading .env file:', err);
          return;
        }
      }

      // Split the file content into an array of lines
      const lines = data.split(os.EOL);
      let found = false;

      // Iterate over the lines to find the key and update its value
      const updatedLines = lines.map(line => {
        if (line.startsWith('PUBLIC_IP=')) {
          found = true;
          return `PUBLIC_IP=${ip}`; // Update the existing line
        }
        return line;
      });

      // If the key was not found, add it to the end
      if (!found) {
        updatedLines.push(`PUBLIC_IP=${ip}`);
      }

      // Join the updated lines back into a single string and write it back to the .env file
      fs.writeFile(filePath, updatedLines.join(os.EOL), err => {
        if (err) {
          console.error('Failed to write to .env file:', err);
        } else {
          console.log(`PUBLIC_IP set to ${ip} in .env file.`);
        }
        });
    }
    );
    }
}

module.exports = IPFetcher;