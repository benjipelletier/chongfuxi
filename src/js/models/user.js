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
    static async load(uid) {
        const idToken = getIdToken()
        try {
            let response = await axios.get(`${URL_BASE}/users/${uid}`, {
                params: {
                    idToken
                }
            })
            console.log('USER ', response.data)
        } catch(e) {
            console.log('Error: ', e)
            try {
                let response = await axios.put(`${URL_BASE}/users/${uid}`, {
                    idToken
                })
                console.log('USER FROM POST ', response.data)
            } catch(e2) {
            console.log('Error: ', e2)

            }
        }
    }
}