const fs = require('fs/promises');
const path = require('path');

class Loader {
    async loadJson(filePath) {
        const content = (await fs.readFile(filePath)).toString('utf-8');
        return JSON.parse(content);
    }

    async loadFolderHierarchy(rootPath) {
        async function generateTree(curPath, name, loadJson) {
            let curName = name;
            let curType = 'dir';
            let curDescription = undefined;
            if (name[0] === '~') {
                curName = name.slice(1);
                curType = 'test';
                curDescription = (await loadJson(path.join(curPath, 'config.json'))).description;
            }

            let res = {
                name: curName,
                type: curType,
                description: curDescription,
                content: [],
            }
            let content = await fs.readdir(curPath, {withFileTypes: true});
            for (let dirent of content) {
                if (dirent.isDirectory()) {
                    res.content.push(await generateTree(path.join(curPath, dirent.name), dirent.name, loadJson))
                }
            }
            return res;
        }
        return generateTree(rootPath, path.basename(rootPath), path => this.loadJson(path));
    }
}

module.exports.Loader = Loader