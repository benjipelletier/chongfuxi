import axios from 'axios'
import { Model } from "@/js/models/base.js"
import { URL_BASE, getIdToken } from '../common.js'

export class User extends Model {
    get defaults() {
        return {
            email: "",
            name: "",

        }
    }
    static async load(uid, userData) {
        const idToken = getIdToken()
        // doesn't follow REST convention
        const userResponse = await axios.put(`${URL_BASE}/users/${uid}`, {
            idToken,
            userData
        })
        const progressResponse = await axios.get(`${URL_BASE}/users/${uid}/progress`)
        console.log('progress ', progressResponse)
        return new User(userResponse.data)
    }
}