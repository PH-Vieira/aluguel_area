const { app, BrowserWindow } = require('electron')
const path = require('path')

let win

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        show: false, // cria mas só exibe quando estiver pronta
        webPreferences: {
            contextIsolation: true,
        }
    })

    win.loadURL('http://localhost:5173')

    win.webContents.openDevTools()

    win.once('ready-to-show', () => {
        win.show()
    })
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})