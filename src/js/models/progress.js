import axios from 'axios'
import { Model } from "@/js/models/base.js"
import { Definition } from "@/js/models/definition.js"
import { URL_BASE, getIdToken, getUid } from '../common.js'

export class Progress extends Model {
    get defaults() {
        return {
            word: "",
            // definition
            definitionPromise: null,
            definition: null,
            // response data
            pinyinMatch: {
                found: null,
                idx: null
            },
            meaningMatch: {
                found: null,
                idx: null
            },
            new: false
        }
    }
    setDefinitionPromise() {
        this.definitionPromise = Definition.get(this.word)
        .then(response => {
            console.log('found definition for ', this.word)
            this.definition = response
            return response
        })
    }
    setPinyinMatch(found, idx) {
        this.pinyinMatch.found = found
        this.pinyinMatch.idx = idx
    }
    setMeaningMatch(found, idx) {
        this.meaningMatch.found = found
        this.meaningMatch.idx = idx
    }
    get correct() {
        if (this.pinyinMatch.found === true && this.meaningMatch.found === true) {
            return true
        } else if (this.pinyinMatch.found === false || this.meaningMatch.found === false) {
            return false
        }
        return null
    }
    setNew(isNew) {
        this.new = isNew
    }
    async put() {
        const idToken = await getIdToken()
        const uid = await getUid()
        return axios.put(`${URL_BASE}/users/${uid}/progress/${this.word}`, {
            idToken,
            'correct': this.correct
        }).then(response => {
            console.log(response)
        }).catch(e => {
            console.log(e)
        })
    }
}