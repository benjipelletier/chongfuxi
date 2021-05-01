import firebase from "firebase/app";
import "firebase/auth";

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
        console.log(result.user)
    }).catch((error) => {
        console.log(error)
    });
}

function googleSignOut() {
    firebase.auth()
    .signOut()
    .then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    });
}


export {
    googleSignIn,
    googleSignOut
}