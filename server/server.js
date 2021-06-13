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

async function getUidFromToken(idToken) {
    console.log('idToken ',idToken)
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
            const uid = await getUidFromToken(req.query.idToken);
            const user_sections = await sections_ref.where('user', '==', uid).orderBy('createdAt').get()
            user_sections.forEach(doc => {
                payload.push({
                    id: doc.id,
                    ...doc.data()
                })
            })
            res.send(payload)
        } catch(e) {
            console.log(e)
            res.send(payload)
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
            const uid = await getUidFromToken(idToken);
            console.log("Adding section data to firestore...")
            const section = {
                base_sections: false,
                title: title,
                user: uid,
                words: [],
                createdAt: admin.firestore.Timestamp.now(),
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
            const uid = await getUidFromToken(idToken);
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
            const uid = await getUidFromToken(idToken);
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
            const uid = await getUidFromToken(idToken);
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
    // creates entry if none found in db
    console.log("PUT /users/:uid")
    const userUid = req.params.uid
    const { idToken, userData } = req.body

    verifyUser(idToken, userUid)
    .then(async uid => {
        try {
            const doc = await users_ref.doc(uid).get()
            if (!doc.exists) {
                const userObj = {
                    name: userData.name,
                    email: userData.email,
                    createdAt: admin.firestore.Timestamp.now(),
                }
                await users_ref.doc(uid).set(userObj)
                res.status(200).send(userObj)
            } else {
                res.status(200).send(doc.data())
            }
        } catch(e) {
            res.status(404).send(e)
        }

    }).catch(e => {
        res.status(400).send(e)
    })
})

app.get('/users/:uid/progress', async (req, res) => {
    const userUid = req.params.uid
    const { idToken } = req.body

    verifyUser(idToken, userUid)
    .then(async uid => {
        try {
            let response = users_ref.doc(uid).collection('progress')
            res.status(200).send(response)
        } catch (e) {
            res.status(400).send(e)
        }
    })
})

app.put('/definitions/:entry', async (req, res) => {
    // creates entry if none found in db
    console.log("PUT /definitions/:entry")
    const entry = req.params.entry
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

function verifyUser(idToken, uid) {
    return new Promise(async (resolve, reject) => {
        if (idToken) {
            try {
                const retrievedUid = await getUidFromToken(idToken);
                console.log('ret', retrievedUid)
                if (retrievedUid === uid) {
                    resolve(retrievedUid)
                } else {
                    reject("Can't verify user. uid does not match.")
                }
            } catch (e) {
                reject("Can't verify user. Error getting uid: " + e)
            }
        } else {
            reject("Can't verify user. idToken doesn't exist.")
        }
    })
}

function ProgressModel() {
    return {
        numCorrect: 0,
        numIncorrect: 0,
        level: 0,
        nextReviewDueDate: null,
        nonTimedReview: {
            numCorrect: 0,
            numIncorrect: 0
        },
        createdAt: admin.firestore.Timestamp.now(),
    }
}


async function createProgressEntry(docRef) {
    await docRef.set(ProgressModel())
    console.log('done')
}

app.put('/users/:uid/progress/:entryId', async (req, res) => {
    // creates entries for vocab if none found in db
    const { uid, entryId } = req.params
    const { idToken, progressData } = req.body
    try { 
        let userUid = await verifyUser(idToken, uid)
        console.log('uid', uid, userUid)
        const progressDoc_ref = await users_ref.doc(`${userUid}/progress/${entryId}`)
        const progressDoc = await progressDoc_ref.get()
        console.log(progressDoc.exists)
        if (progressDoc.exists) {
        } else {
            console.log('here')
            await createProgressEntry(progressDoc_ref)
        }
        // await progressDoc_ref.update(progressData)
        res.status(200).send(progressData)

    } catch (e) {
        res.status(400).send(e)
    }
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
