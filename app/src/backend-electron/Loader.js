const fs = require('fs/promises');
const path = require('path');

async function fileExists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    } catch (e) {
        return false;
    }
}

async function loadJson(filePath) {
    const content = (await fs.readFile(filePath)).toString('utf-8');
    return JSON.parse(content);
}

async function validateOrder(dirPath) {
    if (!await fileExists(path.join(dirPath, 'order.json'))) {
        await fs.writeFile(path.join(dirPath, 'order.json'), JSON.stringify({
            order: []
        }))
    }

    let orderOld = (await loadJson(path.join(dirPath, 'order.json'))).order;

    let actualFolders = [];
    let allEntries = await fs.readdir(dirPath, {withFileTypes: true});
    for (let dirent of allEntries) {
        if (dirent.isDirectory() && !['.', '~'].includes(dirent.name[0])) {
            actualFolders.push(dirent.name)
        }
    }

    let orderNew = [];
    for (const entry of orderOld) {
        if (actualFolders.includes(entry)) {
            orderNew.push(entry);
        }
    }
    for (const entry of actualFolders) {
        if (!orderOld.includes(entry)) {
            orderNew.push(entry);
        }
    }

    await fs.writeFile(path.join(dirPath, 'order.json'), JSON.stringify({
        order: orderNew
    }))
}

class Loader {
    async loadFolderHierarchy(rootPath) {
        async function generateTree(curPath, name) {
            await validateOrder(curPath);
            const folders = (await loadJson(path.join(curPath, 'order.json'))).order;

            let curName = name;
            let curType;
            let curDescription = undefined;

            if (await fileExists(path.join(curPath, 'config.json'))) {
                curType = 'test';
                try {
                    curDescription = (await loadJson(path.join(curPath, 'config.json'))).description;
                } catch (e) {
                    throw `can't load description from ${path.join(curPath, 'config.json')}`;
                }
            } else {
                curType = 'dir';
            }

            let res = {
                name: curName,
                type: curType,
                description: curDescription,
                content: [],
            }
            for (let folder of folders) {
                res.content.push(await generateTree(path.join(curPath, folder), folder))
            }
            return res;
        }
        return generateTree(rootPath, path.basename(rootPath));
    }
}

module.exports.Loader = Loader
module.exports.loadJson = loadJson