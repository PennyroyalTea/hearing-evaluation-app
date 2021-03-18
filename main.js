const {app, BrowserWindow} = require('electron')

async function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 640,
        height: 480,
        webPreferences: {
            nodeIntegration: true
        }
    })
    await mainWindow.loadFile('index.html')
}

// runs createWindow when initialisation is done
app.whenReady().then(createWindow)


app.on('window-all-closed', function () {
    // on macOS it's expected that programs with 0 windows continue to run unless quit with cmd+q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

