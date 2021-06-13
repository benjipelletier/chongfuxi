import axios from 'axios'
import { Model } from "@/js/models/base.js"
import { URL_BASE } from '../common.js'
import stringSimilarity from 'string-similarity'

export class Definition extends Model {
    get defaults() {
        return {
            traditional: "",
            definitions: []
        }
    }
    static async get(entry) {
        // doesn't follow REST convention
        return axios.put(`${URL_BASE}/definitions/${entry}`)
        .then(response => {
            return new Definition(response.data)
        })
    }
    getPinyin(pyIdx) {
        console.log('py idx', pyIdx)
        return this.definitions[pyIdx].pinyin
    }
    getMeanings(pyIdx) {
        return this.definitions[pyIdx].meanings
    }
    isDuoYinCi() {
        return this.definitions.length > 1
    }
    getPinyins() {
        return this.definitions.map(block => block.pinyin)
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
    getFlattenedMeanings() {
        return this.definitions.map(def => def.meanings).flat()
    }
    getIdxMatchMeaning(input) {
        input = input.toLowerCase()
        let highestMatchRating = 0
        let highestMatchIdxPair = []
        return new Promise((resolve, reject) => {
            this.definitions.forEach((def, pyIdx) => {
                def.meanings.forEach((meaning, meaningIdx) => {
                    const meaningLowerCase = meaning.toLowerCase()
                    meaningLowerCase.split(/\s*(\([^()]*\))/)
                    .forEach(part => {
                        const rating = stringSimilarity.compareTwoStrings(input, part)
                        console.log('NICE',part, rating)
                        if (rating > highestMatchRating) {
                            highestMatchRating = rating
                            highestMatchIdxPair = [pyIdx, meaningIdx]
                        }
                    })
                })
            })
            if (highestMatchRating >= 0.6) {
                resolve(highestMatchIdxPair)
            } else {
                reject('Could not match meaning')
            }
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