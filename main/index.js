const { app, BrowserWindow } = require('electron');
const path = require('path');
const IPFetcher = require('../server/ipFetcher');
// Declare mainWindow globally within the module scope
let mainWindow;

function createWindow() {
    // Initialize the mainWindow variable with a new BrowserWindow instance
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    // Load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    // Open the DevTools. Remove this line in production
    mainWindow.webContents.openDevTools();

    // Handle window being closed
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    const ipFetcher = new IPFetcher();
  ipFetcher.on('ipFetched', (ip) => {
    console.log("IP fetched and saved:", ip);
    // Optionally send IP to renderer process
    // mainWindow.webContents.send('public-ip', ip);
  });
  ipFetcher.fetchPublicIP();
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // Re-create a window in the app when the dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
