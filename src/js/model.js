import axios from 'axios'
import store from '../store/index.js'

const URL_BASE = 'http://localhost:3000'

function getIdToken() {
    return store.getters.getUser.data?.idToken 
}

const Sections = {
    charactersSet: new Set(),
    async load() {
        let data = [];
        const idToken = getIdToken()
        const response = await axios.get(URL_BASE + '/sections', {
            params: {
                idToken
            }
        });
        data = response.data
        data = response.data.map(section => this.normalize(section))

        // split characters
        data.forEach(section => section.characters = this.wordsToChars(section.words))

        // split characters no duplicates
        data.forEach(section => section.charactersNoDup = this.wordsToCharsNoDup(section.characters, this.charactersSet))

        // sort words
        data.forEach(section => section.words = this.sortByLen(section.words))

        return data
    },
    async post(title) {
        const idToken = getIdToken()
        const response = await axios.post(URL_BASE + '/section', {
            title: title,
            idToken: idToken
        })
        return this.normalize(response.data)
    },
    async put(sectionId, newTitle) {
        const idToken = getIdToken()
        console.log(sectionId, idToken)
        await axios.put(URL_BASE + `/section/${sectionId}`, {
            idToken,
            newTitle,
        })
    },
    async delete(sectionId) {
        const idToken = getIdToken()
        console.log(sectionId)
        await axios.delete(URL_BASE + `/section/${sectionId}`, {
            params: {
                idToken
            }
        })
    },
    normalize(section) {
        return {
            base_section: section.base_section || false,
            words: section.words || [],
            characters: section.characters || [],
            charactersNoDup: section.charactersNoDup || [],
            title: section.title,
            canonicalId: section.canonicalId || this.canonicalId(section.title),
            id: section.id || null
        }
    },
    canonicalId(title) {
        return title.replace(/\s\s+/g, ' ').trim().replaceAll(" ", "_").toLowerCase()
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
    },
    async addWords(section, wordsToAdd) {
        const idToken = getIdToken()
        const response = await axios.patch(URL_BASE + `/section/${section.id}/words`, {
            idToken,
            wordsToAdd,
        })
        console.log(response)
        const updatedWords = section.words
        wordsToAdd.forEach(word => {
            if (!updatedWords.includes(word)) {
                updatedWords.push(word)
            }
        })
        const updatedChars = this.wordsToChars(section.words)
        const updatedCharsNoDup = this.wordsToCharsNoDup(section.characters, this.charactersSet)
        return {
            ...section,
            words: updatedWords,
            characters: updatedChars,
            charactersNoDup: updatedCharsNoDup
        }
    },
    async removeWords(section, wordsToRemove) {
        const idToken = getIdToken()
        await axios.patch(URL_BASE + `/section/${section.id}/words`, {
            idToken,
            wordsToRemove,
        })
        console.log("nice" +  wordsToRemove)
        const updatedWords = section.words.filter(word => !wordsToRemove.includes(word))
        const updatedChars = this.wordsToChars(section.words)
        const updatedCharsNoDup = this.wordsToCharsNoDup(section.characters, this.charactersSet)
        // console.log(updatedWords)
        return {
            ...section,
            words: updatedWords,
            characters: updatedChars,
            charactersNoDup: updatedCharsNoDup
        }
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