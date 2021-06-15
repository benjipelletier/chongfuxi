import axios from 'axios'
import { Model } from "@/js/models/base.js"
import { URL_BASE, getIdToken } from '../common.js'

export class User extends Model {
    constructor(attributes = {}) {
        attributes.progress = new UserProgress({ 
            collection: attributes.progress
        })
        super(attributes)
    }
    get defaults() {
        return {
            progress: new UserProgress()
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

        for (const word in this.collection) {
            console.log('date', (new Date()).getSeconds() - this.collection[word].nextReviewDueDate._seconds)
            console.log('date', this.collection[word].nextReviewDueDate)
            if (!this.collection[word].nextReviewTime) {
                readySet.add(word)
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
}