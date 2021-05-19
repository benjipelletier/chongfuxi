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
    static async load(entry) {
        const response = await axios.post(`${URL_BASE}/definitions/${entry}`)
        return response.data
    }
}