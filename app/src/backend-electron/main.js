const {
    app,
    protocol,
    BrowserWindow,
    ipcMain,
    dialog,
} = require('electron')

const isDev = require('electron-is-dev');

const path = require('path')

const {Storage} = require('./Storage')
const {Loader} = require('./Loader')

let storage = new Storage()
let loader = new Loader()

async function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 640,
        height: 480,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false, // for security reasons
            contextIsolation: true, // for security reasons
            enableRemoteModule: false, // for security reasons
            webSecurity: false
        }
    })

    mainWindow.webContents.openDevTools()
    if (isDev) {
        await mainWindow.loadURL('http://localhost:3000')
    } else {
        await mainWindow.loadFile(path.join(__dirname, '..', '..', 'build', 'index.html'))
    }
}

// runs createWindow when initialisation is done
app.whenReady().then(async () => {// TODO: fix this protocol register bug
    await protocol.registerFileProtocol('file', (request, cb) => {
        const url = request.url.replace('file:///', '')
        const decodedUrl = decodeURI(url)
        try {
            return cb(decodedUrl)
        } catch (error) {
            console.error('ERROR: registerLocalResourceProtocol: Could not get file path:', error)
        }
    })
    await createWindow()
})



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

ipcMain.handle('select-folder', () => {
    return dialog.showOpenDialog({
        title: 'Выберите папку',
        properties: ['openDirectory']
    })
})

ipcMain.handle('get-app-path', () => {
    return app.getPath('userData')
})

ipcMain.handle('write-local', (event, name, val) => {
    storage.setProp(name, val)
})

ipcMain.handle('read-local', (event, name) => {
    return storage.getProp(name)
})

ipcMain.handle('load-dir-structure', (event, rootPath) => {
    return loader.loadFolderHierarchy(rootPath)
})

ipcMain.handle('load-json', (event, path) => {
    return loader.loadJson(path)
})

