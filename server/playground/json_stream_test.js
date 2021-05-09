
const Fuse = require('fuse.js')

const path = '../data/words-lst.json'
file = require(path)

const options = {
//   includeScore: true,
  // Search in `author` and in `tags` array
  threshold: 0.3,
  keys: ['simplified', 'traditional', 'pronunciations.pinyin', 'pronunciations.toneless']
}

const fuse = new Fuse(file, options)

console.log(fuse.search('ni hao3'))