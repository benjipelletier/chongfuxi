import axios from 'axios'
import store from '../store/index.js'

const URL_BASE = 'http://localhost:3000'

const Sections = {
    async load() {
        let data = [];
        const idToken = store.getters.getUser.data?.idToken 
        const response = await axios.get(URL_BASE + '/sections', {
            params: {
                idToken
            }
        });
        data = response.data

        // split characters
        data = data.map(
            section => { 
                return {
                    ...section,
                    characters: this.wordsToChars(section.words)
                }
            }
        )

        // split characters no duplicates
        let accSet = new Set()
        data = data.map(
            section => { 
                return {
                    ...section,
                    charactersNoDup: this.wordsToCharsNoDup(section.characters, accSet)
                }
            }
        )

        // sort words
        data.forEach(section => {
            section.words = this.sortByLen(section.words)
        })
        return data
    },
    async post(title) {
        const idToken = store.getters.getUser.data?.idToken 
        const response = await axios.post(URL_BASE + '/section', {
            title: title,
            idToken: idToken
        })
        return this.normalize(response.data)
    },
    normalize(section) {
        return {
            base_section: section.base_section || false,
            words: section.words || [],
            characters: section.characters || [],
            charactersNoDup: section.charactersNoDup || [],
            title: section.title,
            id: section.id || this.canonicalId(section.title),
        }
    },
    canonicalId(title) {
        return title.trim().replaceAll(" ", "_").toLowerCase()
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

        // data = response
    }
}

export {
    Sections,
    User
}