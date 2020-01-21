const readline = require('readline-sync')

function start() {
    const content = {}

    content.seachTerm = askAndReturnSeachTerm()
    content.prefix = askAndReturnPrefix()

    function askAndReturnSeachTerm() {
        return readline.question('Type a Wikipedia search term: ')
    }

    function askAndReturnPrefix() {
        const prefixes = ['Who is', 'What is', 'The History of']
        const selectPrefixIndex = readline.keyInSelect(prefixes, 'Choose one option')
        
        return prefixes[selectPrefixIndex]
    }

    console.log(content)
}

start()