const {
    app,
    protocol,
    BrowserWindow,
    ipcMain,
    dialog,
} = require('electron')

const isDev = require('electron-is-dev');

const path = require('path')

const lodashId = require('lodash-id')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const {Loader, loadJson} = require('./Loader')


const adapterConfig = new FileSync(path.join(app.getPath('userData'), 'config.json'))
const configStorage = low(adapterConfig)

const adapterDB = new FileSync(path.join(app.getPath('userData'), 'db.json'))
const db = low(adapterDB)
db._.mixin(lodashId)

let loader = new Loader()

db.defaults({users: [], attempts: []})
    .write()

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

function addOSHandlers() {
    ipcMain.handle('os/select-folder', () => {
        return dialog.showOpenDialog({
            title: 'Выберите папку',
            properties: ['openDirectory']
        })
    })
}

function addConfigHandlers() {
    ipcMain.handle('storage/write-config', (event, name, val) => {
        configStorage.set(name, val)
            .write()
    })

    ipcMain.handle('storage/read-config', (event, name) => {
        return configStorage.get(name)
            .value()
    })
}

function addTestsLoaderHandlers() {
    ipcMain.handle('tests/load-dir-structure', (event, rootPath) => {
        return loader.loadFolderHierarchy(rootPath)
    })

    ipcMain.handle('tests/load-json', (event, path) => {
        return loadJson(path)
    })
}

function addDBHandlers() {
    ipcMain.handle('db/add-user', (event, user) => {
        return db.get('users')
            .insert(user)
            .write()
    })
    ipcMain.handle('db/list-users', () => {
        return db.get('users')
            .value()
    })
    ipcMain.handle('db/delete-user', (event, id) => {
        return db.get('users')
            .removeById(id)
            .write()
    })
    ipcMain.handle('db/edit-user', (event, id, newUser) => {
        return db.get('users')
            .replaceById(id, newUser)
            .write()
    })
    ipcMain.handle('db/get-user-by-id', (event, id) => {
        return db.get('users')
            .getById(id)
            .value()
    })
    ipcMain.handle('db/remove-user-by-id', (event, id) => {
        return db.get('users')
            .removeById(id)
            .write()
    })

}

addOSHandlers();
addConfigHandlers();
addTestsLoaderHandlers();
addDBHandlers();