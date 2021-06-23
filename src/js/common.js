import firebase from "firebase/app";

export const URL_BASE = 'http://localhost:3000'

export async function getIdToken() {
    return await firebase.auth().currentUser?.getIdToken(true)
}

export async function getUid() {
    return await firebase.auth().currentUser?.uid
}