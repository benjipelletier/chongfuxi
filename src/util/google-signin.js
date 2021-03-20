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
        console.log(firebase.auth().currentUser)
        /** @type {firebase.auth.OAuthCredential} */
        // var credential = result.credential;

        // // This gives you a Google Access Token. You can use it to access the Google API.
        // var token = credential.accessToken;
        // // The signed-in user info.
        // var user = result.user;
        // ...
    }).catch((error) => {
        console.log(error)
        // Handle Errors here.
        // var errorCode = error.code;
        // var errorMessage = error.message;
        // // The email of the user's account used.
        // var email = error.email;
        // // The firebase.auth.AuthCredential type that was used.
        // var credential = error.credential;
        // ...
    });
}


export {
    googleSignIn,
}