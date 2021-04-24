const {contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('backend', {
    selectFolder: () => {
        return ipcRenderer.invoke('os/select-folder')
    },
    writeLocal: (name, val) => {
        return ipcRenderer.invoke('storage/write-config', name, val)
    },
    readLocal: (name) => {
        return ipcRenderer.invoke('storage/read-config', name)
    },
    loadDirStructure: (path) => {
        return ipcRenderer.invoke('tests/load-dir-structure', path)
    },
    loadJson: (path) => {
        return ipcRenderer.invoke('tests/load-json', path)
    },
    addUser: (user) => {
        return ipcRenderer.invoke('db/add-user', user)
    },
    getUsers: () => {
        return ipcRenderer.invoke('db/list-users')
    },
    getUserById: (id) => {
        return ipcRenderer.invoke('db/get-user-by-id', id)
    },
    removeUserById: (id) => {
        return ipcRenderer.invoke('db/remove-user-by-id', id)
    }
})