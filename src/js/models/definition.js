import axios from 'axios'
import { Model } from "@/js/models/base.js"
import { URL_BASE } from '../common.js'

export class Definition extends Model {
    get defaults() {
        return {
            traditional: "",
            definitions: []
        }
    }
    getPinyin(pyIdx) {
        console.log('py idx', pyIdx)
        return this.definitions[pyIdx].pinyin
    }
    getMeanings(pyIdx) {
        return this.definitions[pyIdx].meaning
    }
    isDuoYinCi() {
        return this.definitions.length > 1
    }
    getPinyins() {
        return this.definitions.map(block => block.pinyin)
    }
    static async get(entry) {
        // doesn't follow REST convention
        return axios.post(`${URL_BASE}/definitions/${entry}`)
        .then(response => {
            return new Definition(response.data)
        })
    }
    getIdxMatchPinyin(pinyin, requireTones = false) {
        // returns index 
        return new Promise((resolve, reject) => {
            pinyin = this.normalizePinyin(pinyin, requireTones)
            this.definitions.forEach((definition, i) => {
                console.log('in py', pinyin)
                console.log('def py', this.normalizePinyin(definition.pinyin, requireTones))
                console.log(definition)
                if (pinyin === this.normalizePinyin(definition.pinyin, requireTones)) {
                    return resolve(i)
                }
            })
            reject('Could not match definition by pinyin')
        })
    }
    getIdxMatchMeaning(pyIdx, input) {
        input = input.toLowerCase()
        return new Promise((resolve, reject) => {
            if (pyIdx === null) reject('invalid pyIdx')
            this.definitions[pyIdx].meaning.forEach((meaning, i) => {
                meaning.toLowerCase().split(/\s*(\([^()]*\))/).forEach(part => {
                    if (part.trim() === input) {
                        return resolve(i)
                    }
                })
            })
            reject('Could not match meaning')
        })
    }
    normalizePinyin(pinyin, requireTones = false) {
        pinyin = pinyin.toLowerCase()
        if (!requireTones) {
            pinyin = pinyin.split(' ').map(syl => parseInt(syl.slice(-1)) ? syl.slice(0, -1) : syl).join('')
        }
        pinyin = pinyin.replace(/'/g, '')
        pinyin = pinyin.replace(/\s+/g, '')

        return pinyin
    }
}