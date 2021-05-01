import axios from 'axios'
import store from '../store/index.js'

const URL_BASE = 'http://localhost:3000'

const Sections = {
    data: [],

    async load() {
        const idToken = store.getters.getUser.data?.idToken 
        const response = await axios.get(URL_BASE + '/sections', {
            params: {
                idToken
            }
        });
        this.data = response.data

        // split characters
        this.data = this.data.map(
            section => { 
                return {
                    ...section,
                    characters: this.wordsToChars(section.words)
                }
            }
        )

        // split characters no duplicates
        let accSet = new Set()
        this.data = this.data.map(
            section => { 
                return {
                    ...section,
                    charactersNoDup: this.wordsToCharsNoDup(section.characters, accSet)
                }
            }
        )

        // sort words
        this.data.forEach(section => {
            section.words = this.sortByLen(section.words)
        })
    },
    sortByLen(lst) {
        return lst.sort((e1, e2) => {
            return e1.length - e2.length
        })
    },
    wordsToChars(words) {
        let charSet =  words.reduce((acc, word) => {
            return new Set([...acc, ...word.split("")])
        }, [])
        return Array.from(charSet)
    },
    wordsToCharsNoDup(chars, accSet) {
        let ret = []
        chars.forEach(char => {
            if (!accSet.has(char)) {
                ret.push(char)
                accSet.add(char)
            }
        })
        return ret
    }
}

const User = {
    data: [],

    async load() {
        // const response = await axios.get(URL_BASE + '/sections');

        // this.data = response
    }
}

export {
    Sections,
    User
}