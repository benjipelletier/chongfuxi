// import axios from 'axios'
import store from '../store/index.js'

export const URL_BASE = 'http://localhost:3000'

export function getIdToken() {
    return store.getters.getUser.data?.idToken 
}