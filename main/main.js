// main/main.js
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    // Crée la fenêtre du navigateur de bureau
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    // En développement, on va lui demander de charger le serveur local de Vite (React)
    // Une fois qu'on aura lancé Vite, il tournera sur http://localhost:5173
    win.loadURL('http://localhost:5173');

    // Optionnel : Ouvre les outils de développement (Inspecteur F12) automatiquement
    win.webContents.openDevTools();
}

// Quand Electron est prêt, il crée la fenêtre
app.whenReady().then(createWindow);

// Quitter quand toutes les fenêtres sont fermées (sauf sur Mac)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});