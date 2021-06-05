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
    static async get(entry) {
        // doesn't follow REST convention
        return axios.post(`${URL_BASE}/definitions/${entry}`)
        .then(response => {
            return new Definition(response.data)
        })
    }
    getDefnByPinyin(pinyin, requireTones = false) {
        // returns index 
        return new Promise((resolve, reject) => {
            pinyin = this.normalizePinyin(pinyin, requireTones)
            this.definitions.forEach(definition => {
                console.log('in py', pinyin)
                console.log('def py', this.normalizePinyin(definition.pinyin, requireTones))
                console.log(definition)
                if (pinyin === this.normalizePinyin(definition.pinyin, requireTones)) {
                    return resolve(definition)
                }
            })
            reject('Could not match definition by pinyin')
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