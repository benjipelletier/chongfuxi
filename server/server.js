const express = require('express')
const cors = require('cors')
const admin = require('firebase-admin')
const serviceAccount = require('./certs/key.json')
const port = 3000
const app = express()

app.use(cors())

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const definitions_ref = db.collection('definitions')
const users_ref = db.collection('users')
const progress_ref = db.collection('progress')
const sections_ref = db.collection('sections')


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/sections', async (req, res) => {
    const base_sections = await sections_ref.where('base_section', '==', true).get()
    const payload = []
    base_sections.forEach(doc => {
        payload.push({
            id: doc.id,
            ...doc.data()
        })
    })        

    // sort base sections
    payload.sort()
    let rIdx = payload.findIndex(section => section.id === "radicals")
    if (rIdx >= 0) {
        let radicals = payload[rIdx]
        payload.splice(rIdx, rIdx+1)
        payload.unshift(radicals)
    }

    // get 
    if (req.query.idToken) {
        console.log("IdToken found")
        let decodedToken = await admin.auth().verifyIdToken(req.query.idToken)
            const uid = decodedToken.uid;
            const user_sections = await sections_ref.where('user', '==', uid).get()
            base_sections.forEach(doc => {
            payload.push({
                id: doc.id,
                ...doc.data()
            })
    })
    }
    res.send(payload)
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
