const {app} = require('electron')

const path = require('path')

const fs = require('fs')

const configFileName = 'config.json'

class Storage {
    constructor() {
        this.appDataDir = app.getPath('userData')
        this.configFilePath = path.join(this.appDataDir, configFileName)
        try {
            fs.accessSync(this.configFilePath, fs.F_OK)
        } catch (err) {
            console.log(`config file ${configFileName} doesn't exist, trying to create`)
            try {
                fs.writeFileSync(this.configFilePath, '{}')
            } catch (err) {
                console.error(`error while creating ${configFileName} : ${err}`)
            }

        }
    }

    get configJSON() {
        let data = undefined
        try {
            data = fs.readFileSync(this.configFilePath, 'utf8')
        } catch (err) {
            console.error(`error while reading file ${configFileName} : ${err}`)
            return undefined
        }
        try {
            return JSON.parse(data)
        } catch (e) {
            console.error(`error while parsing JSON: ${e}`)
            return undefined
        }
    }

    set configJSON(newJson) {
        try {
            fs.writeFileSync(this.configFilePath, JSON.stringify(newJson, null, '\t'))
        } catch (err) {
            console.error(`error while trying to write file ${configFileName} : ${err}`)
        }
    }

    getProp(name) {
        const data = this.configJSON
        return data[name]
    }

    setProp(name, val) {
        let data = this.configJSON
        data[name] = val
        this.configJSON = data

    }
}

module.exports.Storage = Storage