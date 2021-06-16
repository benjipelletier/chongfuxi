import axios from 'axios'
import { Model } from "@/js/models/base.js"
import { URL_BASE, getIdToken } from '../common.js'
import firebase from "firebase/app";

export class User extends Model {
    constructor(attributes = {}) {
        attributes.progress = new UserProgress({ 
            collection: attributes.progress
        })
        super(attributes)
    }
    get defaults() {
        return {
        }
    }
    static async load(uid, userData) {
        console.log('loading')
        const idToken = await getIdToken()
        // doesn't follow REST convention
        return axios.put(`${URL_BASE}/users/${uid}`, {
            idToken,
            userData
        }).then(response => {
            return new User(response.data)
        })
    }
}

export class UserProgress extends Model {
    constructor(attributes = {}) {
        super(attributes)
        this.updateReviewSets()
        console.log('constructor', attributes)
        setInterval(() => {
            const now = new Date()
            console.log('now', now.getMinutes())
            if (now.getMinutes() === 0) {
                this.updateReviewSets()
            }
        }, 60000)
    }
    get defaults() {
        return {
            collection: {},
            reviewSets: {
                new: new Set(),
                ready: new Set(),
                waiting: new Set()
            }
        }
    }
    updateReviewSets() {
        let readySet = new Set()
        let waitingSet = new Set()
        let nowSeconds = firebase.firestore.Timestamp.now().seconds

        for (const word in this.collection) {
            if (this.collection[word].nextReviewDueDate !== null) {
                let dueSeconds = this.collection[word].nextReviewDueDate._seconds
                if ((dueSeconds - nowSeconds) < 0) {
                    readySet.add(word)
                } else {
                    waitingSet.add(word)
                }
            } else {
                waitingSet.add(word)
            }
        }
        this.reviewSets.ready = readySet
        this.reviewSets.waiting = waitingSet
    }
    updateNew(vocab) {
        if (!this.reviewSets.new.has(vocab) &&
            !this.reviewSets.ready.has(vocab) &&
            !this.reviewSets.waiting.has(vocab)) {
                this.reviewSets.new.add(vocab)
        } else if (this.reviewSets.new.has(vocab)) {
            this.reviewSets.new.delete(vocab)
        }
    }
    removeNew() {
        this.reviewSets.new = new Set()
    }
    getWordsToReview() {
        return [...this.reviewSets.new, ...this.reviewSets.ready]
    }
    updateProgress(word, updatedData) {
        this.collection[word] = updatedData
        console.log('set ', word, updatedData)
        if (this.reviewSets.new.has(word)) {
            this.reviewSets.new.delete(word)
        }
        this.updateReviewSets()
    }
}