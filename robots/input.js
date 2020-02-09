const readline = require('readline-sync')
const state = require('./state')

function robot(){

    const content = {
        maximumSentences: 7
    }
    
    content.searchTerm = askAndReturnSearchTerm()
    content.prefix = askAndReturnPrefix()
    state.save(content)

    function askAndReturnSearchTerm() {
        return readline.question('Type a Wikipedia search term: ')
    }
    
    function askAndReturnPrefix() {
        const prefixes = ['Who is', 'What is', 'The History of']
        const selectPrefixIndex = readline.keyInSelect(prefixes, 'Choose one option')
        
        return prefixes[selectPrefixIndex]
    }
}

module.exports = robot