const {contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('backend', {
    selectFolder: () => {
        return ipcRenderer.invoke('select-folder')
    },
    getAppPath: () => {
        return ipcRenderer.invoke('get-app-path')
    },
    writeLocal: (name, val) => {
        return ipcRenderer.invoke('write-local', name, val)
    },
    readLocal: (name) => {
        return ipcRenderer.invoke('read-local', name)
    },
    getDirStructure: (path) => {
        return ipcRenderer.invoke('get-dir-structure', path)
    }
})