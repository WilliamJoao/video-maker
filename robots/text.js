const algorithmia = require('algorithmia')
const algorithmiaApiKey = require('../credentials/algorithmia.json').apiKey
const sentenceBoundaryDetection = require('sbd')

const watsonApiKey = require('../credentials/watson-nlu.json').apikey
const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js')
 
const nlu = new NaturalLanguageUnderstandingV1({
    iam_apikey: watsonApiKey,
    version: '2018-04-05',
    url: 'https://gateway.watsonplatform.net/natural-language-understanding/api/'
})

async function robot(content) {
    await fetchContentfromWikipedia(content)
    sanitizeContent(content)
    breakContentIntoSetences(content)
    limitMaximumSetences(content)
    await fetchKeywordsOfAllSetences(content)

    async function fetchContentfromWikipedia(content) {
        const algorithmiaAuthenticated = algorithmia(algorithmiaApiKey) 
        const wikipediaAlgorithm = algorithmiaAuthenticated.algo('web/WikipediaParser/0.1.2')
        const wikipediaResponse = await wikipediaAlgorithm.pipe(content.searchTerm)
        const wikipediaContent = wikipediaResponse.get()

        content.sourceContentOriginal = wikipediaContent.content
    }

    function sanitizeContent(content) {
        const withoutBlankLinesAndMarkdow = removeBlankLinesAndMarkdown(content.sourceContentOriginal)
        const withoutDatesInParentheses = removeDatesInParentheses(withoutBlankLinesAndMarkdow)
        
        content.sourceContentSanitized = withoutDatesInParentheses

        function removeBlankLinesAndMarkdown(text) {
            const allLines = text.split('\n')

            const withoutBlankLinesAndMarkdow = allLines.filter(line => {
                return (line.trim().length === 0 || line.trim().startsWith('=')) ? false : true
            })

            return withoutBlankLinesAndMarkdow.join(' ')
        }

        function removeDatesInParentheses(text) {
            return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g, ' ')
        }
    }

    function breakContentIntoSetences(content) {
        content.senteces = []

        const sentences = sentenceBoundaryDetection.sentences(content.sourceContentSanitized)

        sentences.forEach(sentence => {
            content.senteces.push({
                text: sentence,
                keywords: [],
                images: []
            })
        })
    }

    function limitMaximumSetences(content) {
        content.senteces = content.senteces.slice(0, content.maximumSentences)
    }

    async function fetchWatsonAndReturnKeywords(setence) {
        return new Promise((resolve, reject) => {
            nlu.analyze({
                text: setence,
                features: {
                    keywords: {}
                }
            }, (error, response) => {
                if (error) {
                    throw error
                }
    
                const keywords = response.keywords.map(keyword => {
                    return keyword.text
                })
    
                resolve(keywords)
            })
        })
    }

    async function fetchKeywordsOfAllSetences(content) {
        for (const setence of content.senteces) {
            setence.keywords = await fetchWatsonAndReturnKeywords(setence.text)
        }
    }
}

module.exports = robot