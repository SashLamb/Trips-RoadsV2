const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('node:path')
const { initDatabase } = require('./database') // On importe ton initialisation SQLite

async function handleFileOpen () {
    const { canceled, filePaths } = await dialog.showOpenDialog()
    if (!canceled) {
        return filePaths[0]
    }
}

function createWindow () {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    if (app.isPackaged) {
        mainWindow.loadFile(path.join(__dirname, '../src/index.html'));
    } else {
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    }
}

app.whenReady().then(() => {
    initDatabase()
    ipcMain.handle('dialog:openFile', handleFileOpen)
    ipcMain.handle('ping-main', async () => {
        console.log("Le Renderer a envoyé un Ping !")
        return "Pong ! Le pont IPC fonctionne à la perfection 🚀"
    })
    createWindow()
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})