const fs = require('fs')

const contentFilePath = './content.json'

function save(content) {
    const contentString = JSON.stringify(content)
    return fs.writeFileSync(contentFilePath, contentString)
}

function load() {
    console.log('passo 1', contentFilePath)
    const fileBuffer = fs.readFileSync(contentFilePath, 'utf-8')
    console.log('passo 2', fileBuffer)
    const contentJson = JSON.parse(fileBuffer)
    console.log('passo 3', contentJson)

    return contentJson
}

module.exports = {
    save, load
}