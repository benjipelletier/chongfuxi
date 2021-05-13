import axios from 'axios'
import { Model } from "@/js/models/base.js"
import { URL_BASE, getIdToken } from '../common.js'

export class Section extends Model {
    constructor(attributes = {}) {
        super({
            ...attributes,
            canonicalId: Section.getCanonicalId(attributes.title),
            characters: Section.wordsToChars(attributes.words),
        })
        this.sortWordsByLen()
    }
    get defaults() {
        return {
            title: "",
            base_section: false,
            user: null,
            words: [],
            characters: [],
            charactersUnique: [],
            canonicalId: "",
            id: ""
        }
    }
    static async load() {
        const idToken = getIdToken()
        try {
            const response = await axios.get(URL_BASE + '/sections', {
                params: {
                    idToken
                }
            });
            console.log("in load ", response.data)
            return response.data.map(section => new Section(section))
        } catch(e) {
            console.log("Error: ", e)
            return []
        }
    }
    static async post(title) {
        const idToken = getIdToken()
        try {
            const response = await axios.post(URL_BASE + '/section', {
                title: title,
                idToken: idToken
            })
            console.log("post ", response.data)
            return new Section(response.data)
        } catch(e) {
            console.log("Error: ", e)
            return null
        }
    }
    static async delete(sectionId) {
        const idToken = getIdToken()
        console.log(sectionId)
        try {
            await axios.delete(URL_BASE + `/section/${sectionId}`, {
                params: {
                    idToken
                }
            })
        } catch(e) {
            console.log("Error", e)
        }
    }
    static async put(sectionId, newTitle) {
        const idToken = getIdToken()
        console.log(sectionId, idToken)
        try {
            await axios.put(URL_BASE + `/section/${sectionId}`, {
                idToken,
                newTitle,
            })
        } catch(e) {
            console.log(e)
        }
    }
    async patchWords({wordsToAdd = [], wordsToRemove = []}) {
        // API calls to add/remove words
        const idToken = getIdToken()
        await axios.patch(URL_BASE + `/section/${this.id}/words`, {
            idToken,
            wordsToAdd,
            wordsToRemove
        })
    }
    static getCanonicalId(title) {
        return title.replace(/\s\s+/g, ' ').trim().replaceAll(" ", "_").toLowerCase()
    }
    static wordsToChars(words) {
        let charSet =  words.reduce((acc, word) => {
            return new Set([...acc, ...word.split("")])
        }, [])
        return Array.from(charSet)
    }
    static globalCharSet = new Set()
    static updateCharactersUnique(sections) {
        console.log("charUniq START")
        let charSet = new Set()
        sections.forEach(section => {
            section.charactersUnique = []
            section.characters.forEach(char => {
                if (!charSet.has(char)) {
                    section.charactersUnique.push(char)
                    charSet.add(char)
                }
            })
        })
        console.log("charUniq END")
    }
    sortWordsByLen() {
        this.words.sort((e1, e2) => {
            return e1.length - e2.length
        })
    }
    edit(data) {
        if (data.title) {
            this.title = data.title
            this.canonicalId = Section.getCanonicalId(data.title)
        }
    }
    editWords({wordsToAdd = [], wordsToRemove = []}) {
        if (wordsToAdd.length) {
            wordsToAdd.forEach(word => {
                if (!this.words.includes(word)) {
                    this.words.push(word)
                }
            })
            this.characters = Section.wordsToChars(this.words)
        }
        if (wordsToRemove.length) {
            this.words = this.words.filter(word => !wordsToRemove.includes(word))
            this.characters = Section.wordsToChars(this.words)
        }
    }
}
