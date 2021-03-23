const {
    app,
    BrowserWindow,
    ipcMain,
    dialog,
} = require('electron')

const path = require('path')

const {Storage} = require('./Storage')
storage = new Storage()

async function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 640,
        height: 480,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false, // for security reasons
            contextIsolation: true, // for security reasons
            enableRemoteModule: false // for security reasons
        }
    })
    await mainWindow.loadFile('src/index.html')
    mainWindow.webContents.openDevTools()
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
        createWindow().then(r => {})
    }
})

ipcMain.handle('select-folder', async (_, _) => {
    const filename = dialog.showOpenDialog({
        title: 'Выберите папку',
        properties: ['openDirectory']
    })
    return filename
})

ipcMain.handle('get-app-path', async (event, args) => {
    const filename = app.getPath('userData')
    return filename
})

ipcMain.handle('write-local', async (event, name, val) => {
    storage.setProp(name, val)
})

ipcMain.handle('read-local', async (event, name) => {
    return storage.getProp(name)
})

