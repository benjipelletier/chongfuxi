import firebase from "firebase/app";
import "firebase/auth";

import store from "../store/index.js"

var provider = new firebase.auth.GoogleAuthProvider();

provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

provider.setCustomParameters({
    'login_hint': 'user@example.com'
});

function googleSignIn() {
    console.log(firebase.auth().currentUser)
    firebase.auth()
    .signInWithPopup(provider)
    .then((result) => {
        store.dispatch("signInUser", result.user)
        console.log(result.user)
    }).catch((error) => {
        console.log(error)
    });
}

function googleSignOut() {
    firebase.auth()
    .signOut()
    .then((result) => {
        store.dispatch("signOutUser", result.user)
        console.log(result.user)
    }).catch((error) => {
        console.log(error)
    });
}


export {
    googleSignIn,
    googleSignOut
}