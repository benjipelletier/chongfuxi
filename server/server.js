const express = require('express')
const cors = require('cors')
const admin = require('firebase-admin')
const serviceAccount = require('./certs/key.json')
const dictionary = require('./data/dictionary.json')
const port = 3000
const app = express()

app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

async function verifyAuth(idToken) {
    let decodedToken = await admin.auth().verifyIdToken(idToken)
    return decodedToken.uid;
}

app.get('/sections', async (req, res) => {
    console.log("GET /sections")
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

    // get user sections
    if (req.query.idToken) {
        try {
            console.log("getting user uuid from token")
            const uid = await verifyAuth(req.query.idToken);
            const user_sections = await sections_ref.where('user', '==', uid).get()
            user_sections.forEach(doc => {
                payload.push({
                    id: doc.id,
                    ...doc.data()
                })
            })
            res.send(payload)
        } catch(e) {
            console.log(e)
        }
    } else {
        res.send(payload)
    }
})

app.post('/section', async (req, res) => {
    console.log("POST /section")
    const { title, idToken } = req.body
    if (idToken) {
        try {
            console.log("getting user uuid from token...")
            const uid = await verifyAuth(idToken);
            console.log("Adding section data to firestore...")
            const section = {
                base_sections: false,
                title: title,
                user: uid,
                words: [],
            }
            const response = await sections_ref.add(section)
            section.id = response.id
            res.send(section)
        } catch(e) {
            res.status(400).send({
                message: e.response
            })
        }
    } else {
        res.status(400).send({
            message: 'No idToken found'
        })
    }
})

app.put('/section/:sectionId', async (req, res) => {
    console.log("PUT /section/:sectionId")
    const sectionId = req.params.sectionId
    const { newTitle, idToken } = req.body
    if (idToken) {
        try {
            console.log("getting user uuid from token...")
            const uid = await verifyAuth(idToken);
            console.log("Editing section data...")
            const doc = await sections_ref.doc(sectionId)
            const section = await doc.get()
            if (section.data().user !== uid) {
                res.status(401).send({
                    message: "Unauthorized to PUT section "
                })
            }
            await doc.update({
                title: newTitle
            })
            console.log("Sending response...")
            res.sendStatus(200)
        } catch(e) {
            console.log("Error: " + e)
            res.status(400).send({
                message: e.response
            })
        }
    } else {
        res.status(400).send({
            message: 'No idToken found'
        })
    }
})

app.delete('/section/:sectionId', async (req, res) => {
    console.log("DELETE /section/:sectionId")
    const sectionId = req.params.sectionId
    const { idToken } = req.query
    if (idToken) {
        try {
            console.log("getting user uuid from token...")
            const uid = await verifyAuth(idToken);
            console.log("Deleting section data to firestore...")
            const doc = await sections_ref.doc(sectionId)
            const section = await doc.get()
            if (section.data().user !== uid) {
                res.status(401).send({
                    message: "Unauthorized to DELETE section "
                })
            }
            await doc.delete()
            console.log("Sending response...")
            res.sendStatus(200)
        } catch(e) {
            console.log("Error: " + e)
            res.status(400).send({
                message: e.response
            })
        }
    } else {
        res.status(400).send({
            message: 'No idToken found'
        })
    }
})


app.get('/definitions/:id', async (req, res) => {
    const phrase = req.params.id
    console.log(`GET /definitions/${phrase}`)
    if (dictionary[phrase] == undefined) {
        res.sendStatus(404)
    }

    res.send({
        simplified: phrase,
        ...dictionary[phrase]
    })
})

app.patch('/section/:sectionId/words', async (req, res) => {
    console.log("PATCH /section/:sectionId/words")
    const sectionId = req.params.sectionId
    const { wordsToAdd, wordsToRemove, idToken } = req.body
    if (idToken) {
        try {
            console.log("getting user uuid from token...")
            const uid = await verifyAuth(idToken);
            const doc = await sections_ref.doc(sectionId)
            const section = await doc.get()
            if (section.data().user !== uid) {
                res.status(401).send({
                    message: "Unauthorized to PUT section/words "
                })
            }
            if (wordsToAdd) {
                console.log("Adding words...")
                console.log(wordsToAdd)
                wordsToAdd.forEach(async word => {
                    await doc.update({
                        words: admin.firestore.FieldValue.arrayUnion(word)
                    })
                })
            }
            if (wordsToRemove) {
                console.log("Removing words...")
                console.log(wordsToRemove)
                wordsToRemove.forEach(async word => {
                    await doc.update({
                        words: admin.firestore.FieldValue.arrayRemove(word)
                    })
                })
            }
            console.log("Sending response...")
            res.sendStatus(200)
        } catch(e) {
            console.log("Error: " + e)
            res.status(400).send({
                message: e.response
            })
        }
    } else {
        res.status(400).send({
            message: 'No idToken found'
        })
    }
})
app.get('/users/:uid', async (req, res) => {
    console.log("GET /users/:uid")
    const uid = req.params.uid
    const { idToken } = req.query
    if (idToken) {
        try {
            const doc = await users_ref.doc(uid)
            const user = await doc.get()
            if (user && user.exists) {
                res.status(200).send({
                    user
                })
            } else {
                res.sendStatus(404)
            }
        } catch (e) {
            res.status(404).send({
                message: e.response
            })
        }
    } else {
        res.status(400).send({
            message: 'No idToken found'
        })
    }
})

app.put('/users/:uid', async (req, res) => {
    console.log("PUT /users/:uid")
    const uid = req.params.uid
    const { idToken } = req.body
    console.log(idToken)
    if (idToken) {
        try {
            const doc = await users_ref.doc(uid)
            await doc.set({test: 3}, {merge: true})
            const user = await users_ref.doc(uid).get()
            res.status(200).send(user)
        } catch(e) {
            console.log("Error: ", e)
            res.status(404).send({
                message: e.response
            })
        }
    } else {
        res.status(400).send({
            message: 'No idToken found'
        })
    }
})

app.post('/definitions/:entry', async (req, res) => {
    console.log("POST /definitions/:entry")
    const entry = req.params.entry
    const { idToken } = req.body
    try {
        const doc = await definitions_ref.doc(entry).get()
        if (!doc.exists) {
            const defn = dictionary[entry]
            if (defn === undefined) {
                res.status(404).send({
                    message: `No entry for ${entry} found`
                })
            } else {
                await definitions_ref.doc(entry).set(defn)
                res.status(200).send(defn)
            }
        } else {
            res.status(200).send(doc.data())

        }
    } catch(e) {
        console.log("Error: ", e)
        res.status(404).send({
            message: e.response
        })
    }
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
