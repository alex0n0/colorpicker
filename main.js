const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow, ipcMain } = electron;


app.on('ready', function() {
    createWindow();
});

var mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        height: 1000,
        width: 900,
        minWidth: 520,
        minHeight: 800
    });

    mainWindow.loadURL(url.format({
        protocol: 'file',
        pathname: path.join(__dirname, 'assets/src/index.html'),
        slashes: true
    }));
    // mainWindow.maximize();

    mainWindow.on('closed', function() {
        mainWindow = null;
        app.quit();
    });

}