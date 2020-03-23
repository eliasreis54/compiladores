const fs = require('fs')

const RESERVED_WORDS = ['int', 'float', 'char', 'if', 'else']
const RELATIONAL_OPERATORS = ['>', '<', '>=', '<=', '!=', '==']
const FINAL_SYMBOLS = ['=', ',', ';', '(', ')', '{', '}', ' ']
const NUMBERS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']

const isNumber = n => /^-?[\d.]+(?:e-?\d+)?$/.test(n)

const checkIsNotAnySymbol = letter => {
  return (RELATIONAL_OPERATORS.includes(letter) || FINAL_SYMBOLS.includes(letter) || letter === ' ')
}

const finalSymbolMap = new Map()
const identifiersMap = new Map()
const reserverdWordsMap = new Map()
const numbersMap = new Map()
const relationalOpertorsMap = new Map()

const checkAndAddReservedWord = word => {
  if (reserverdWordsMap.has(word)) {
    return
  }
  reserverdWordsMap.set(word, 'palavra reservada')
}

const checkAndAddFinalSymbolMap = symbol => {
  if (finalSymbolMap.has(symbol)) {
    return
  }
  finalSymbolMap.set(symbol, 'terminal')
}


const checkAndAddIdentifiersMap = identifier => {
  if (identifiersMap.has(identifier) || identifier == '' || NUMBERS.includes(identifier[0])) {
    return
  }
  identifiersMap.set(identifier, 'idenficador')
}

const checkAndAddRelationalOperatorsMap = operator => {
  if (relationalOpertorsMap.has(operator)) {
    return
  }
  relationalOpertorsMap.set(operator, 'operador relacional')
}

const lexicalAnaliser = line => {
  const lineSplit = line.split('')
  let nextWord = ''
  let word = ''
  let initial = 0
  let final = 0
  for (let idx = 0; idx <= lineSplit.length; idx ++) {
    if (FINAL_SYMBOLS.includes(line[idx])) {
      checkAndAddFinalSymbolMap(line[idx])
    }
    if (RELATIONAL_OPERATORS.includes(line[idx])) {
      checkAndAddRelationalOperatorsMap(line[idx])
    }
    word += line[idx]
    if (RESERVED_WORDS.includes(word)) {
      checkAndAddReservedWord(word)
      word = ''
    }
    if (NUMBERS.includes(word)) {
      checkAndAddNumbersMap(word)
      word = ''
    }
    nextWord = line[(idx + 1)]
    if (FINAL_SYMBOLS.includes(nextWord) || RELATIONAL_OPERATORS.includes(nextWord)) {
      FINAL_SYMBOLS.forEach(b => {
        const index = word.indexOf(b)
        if (index >= 0) {
          word.split(word[index]).forEach(c => {
            c = c.trim()
            if (!RESERVED_WORDS.includes(c) && (!isNumber(c))) {
              checkAndAddIdentifiersMap(c)
            }
          })
        }
      })
      RELATIONAL_OPERATORS.forEach(b => { const index = word.indexOf(b)
        if (index >= 0) {
          word.split(word[index]).forEach(c => {
            c = c.trim()
            if (!RESERVED_WORDS.includes(c) && (!isNumber(c))) {
              checkAndAddIdentifiersMap(c)
            }
          })
        }
      })
      nextWord = ''
      word = ''
    }
    }
}

const file = fs.readFileSync('./Prod.anderson', 'UTF-8').split('\n').map(e => e.trim()).filter(e => e.length > 0);

file.forEach(lexicalAnaliser)

console.log('identificadores', identifiersMap)
console.log('palavras reservadas', reserverdWordsMap)
console.log('simbolos finais', finalSymbolMap)
console.log('operadores relacionais', relationalOpertorsMap)
