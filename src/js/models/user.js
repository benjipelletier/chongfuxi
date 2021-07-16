import axios from 'axios'
import { Model } from "@/js/models/base.js"
import { URL_BASE, getIdToken } from '../common.js'
import firebase from "firebase/app";
import "firebase/firestore";

export class User extends Model {
    constructor(attributes = {}) {
        const collection = attributes.progress || {}
        attributes.progress = new UserProgress({ 
            collection
        })
        super(attributes)
    }
    get defaults() {
        return {
            retreivedData: false
        }
    }
    static async load(uid, userData) {
        console.log(uid, userData)
        console.log('LOADING USER EXPENSIVE')
        const idToken = await getIdToken()
        // doesn't follow REST convention
        return axios.put(`${URL_BASE}/users/${uid}`, {
            idToken,
            userData
        }).then(response => {
            console.log(response)
            return new User({...response.data, retreivedData: true})
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
            collection: {
                // 'a': {
                //     nextReviewDueDate: { _seconds: 1624647225 },
                //     level: 2
                // },
                // 'b': {
                //     nextReviewDueDate: { _seconds: 1624997225 },
                //     level: 2
                // },
                // 'c': {
                //     nextReviewDueDate: { _seconds: 1624647225 },
                //     level: 3
                // }
            },
            reviewSets: {
                new: [],
                ready: [],
                waiting: []
            }
        }
    }
    updateReviewSets() {
        let readySet = []
        let waitingSet = []
        let nowSeconds = firebase.firestore.Timestamp.now().seconds

        for (const word in this.collection) {
            if (this.collection[word].nextReviewDueDate !== null) {
                let dueSeconds = this.collection[word].nextReviewDueDate._seconds
                if ((dueSeconds - nowSeconds) < 0) {
                    readySet.push(word)
                } else {
                    waitingSet.push(word)
                }
            } else {
                waitingSet.push(word)
            }
        }
        this.reviewSets.ready = readySet
        this.reviewSets.waiting = waitingSet
    }
    updateNew(vocab) {
        if (!this.reviewSets.new.includes(vocab) &&
            !this.reviewSets.ready.includes(vocab) &&
            !this.reviewSets.waiting.includes(vocab)) {
                this.reviewSets.new.push(vocab)
        } else if (this.reviewSets.new.includes(vocab)) {
            this.removeFromNew(vocab)
        }
    }
    removeNew() {
        this.reviewSets.new = []
    }
    removeFromNew(word) {
        const idx = this.reviewSets.new.indexOf(word)
        if (idx > -1) {
            this.reviewSets.new.splice(idx, 1)
        }
    }
    getWordsToReview() {
        return [...this.reviewSets.new, ...this.reviewSets.ready]
    }
    updateProgress(word, updatedData) {
        this.collection[word] = updatedData
        this.updateReviewSets()
    }
    newHas(word) {
        const idx = this.reviewSets.new.indexOf(word)
        return idx > -1
    }
    readyHas(word) {
        const idx = this.reviewSets.ready.indexOf(word)
        return idx > -1
    }
    waitingHas(word) {
        const idx = this.reviewSets.waiting.indexOf(word)
        return idx > -1
    }
    isSameDay(d1, d2) {
        return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear()
    }
    isSameHour(d1, d2) {
        return d1.getHours() === d2.getHours() && this.isSameDay(d1, d2)
    }
    groupByDueDateToday() {
        const today = new Date()
        let entries = []

        for (const word in this.collection) {
            const dueSeconds = this.collection[word].nextReviewDueDate._seconds
            const revDate = new Date(dueSeconds * 1000)

            const dueNow = this.reviewSets.ready.includes(word)
            const sameDay = this.isSameDay(revDate, today)

            if (!dueNow && sameDay) {
                let found = false
                entries.forEach(entry => {
                    if (this.isSameHour(entry.date, revDate)) {
                        entry.words.push(word)
                        found = true
                    }
                })
                if (!found) {
                    entries.push({
                        date: revDate,
                        words: [word]
                    })
                }
            }
        }
        console.log('today', entries)
        return entries
    }
    groupByDueDatesExludingToday() {
        let entries = []

        for (const word in this.collection) {
            const dueSeconds = this.collection[word].nextReviewDueDate._seconds
            const revDate = new Date(dueSeconds * 1000)

            const dueNow = this.reviewSets.ready.includes(word)

            if (dueNow) continue

            let found = false
            entries.forEach(entry => {
                if (this.isSameHour(entry.date, revDate)) {
                    entry.words.push(word)
                    found = true
                }
            })
            if (!found) {
                entries.push({
                    date: revDate,
                    words: [word]
                })
            }
        }
        console.log('entries ', entries)
        return entries
    }
    getDueDates() {
        let dates = []
        for (const word in this.collection) {
            const revDate = new Date(this.collection[word].nextReviewDueDate._seconds * 1000)

            dates.push(revDate)
        }
        return dates
    }
    getNumWordsInLevel(level) {
        return Object.keys(this.collection).filter(word => this.collection[word].level == level).length
    }
    getNumWordsInLevelDue(level) {
        return Object.keys(this.collection).filter(word => this.collection[word].level == level && this.reviewSets.ready.includes(word)).length
    }
    getNumWordsInLevelWaiting(level) {
        return Object.keys(this.collection).filter(word => this.collection[word].level == level && this.reviewSets.waiting.includes(word)).length
    }
}