const {contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('backend', {
    selectFolder: () => {
        return ipcRenderer.invoke('select-folder')
    },
    getAppPath: () => {
        return ipcRenderer.invoke('get-app-path')
    },
    writeLocal: (name, val) => {
        return ipcRenderer.invoke('write-config', name, val)
    },
    readLocal: (name) => {
        return ipcRenderer.invoke('read-config', name)
    },
    loadDirStructure: (path) => {
        return ipcRenderer.invoke('load-dir-structure', path)
    },
    loadJson: (path) => {
        return ipcRenderer.invoke('load-json', path)
    }
})