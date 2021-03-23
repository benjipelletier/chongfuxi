// import sections from './server/data/sections.json'
// import settings from './server/data/settings.json'

import axios from 'axios'

const URL_BASE = 'http://localhost:5000'

const state = {
    sections: [],
    progress: {},
    showVocab: true,
    reviewSession: {
        cards: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    },
    user: {
        loggedIn: false,
        data: null
    }
}

const getters = {
    getSections: state => state.sections,
    getCharData: state => (char) => state.progress[char],
    getShowVocab: state => state.showVocab,
    getReviewSession: state => state.reviewSession,
    getUser: state => state.user
}

const actions = {
    async fetchSections({ commit }) {
        const response = await axios.get(URL_BASE + '/sections', {
            params: {
                user_id: 1
            }
        });
        console.log("section " + JSON.stringify(response.data))
        payload = response.data
        commit('setSections', payload)
    },
    async fetchProgress({ commit }) {
        const response = await axios.get(URL_BASE + '/user')
        commit('setProgress', response.data)
    },
    async setShowVocab({ commit }, showVocab) {
        commit('setShowVocab', showVocab)
    },
    async setReviewDeck({ commit }, newCards) {
        commit('setReviewDeck', newCards)
    },
    async fetchUser({ commit }, user) {
        commit('setUserLoggedIn', user !== null)
        if (user) {
            commit('setUserData', {
                displayName: user.displayName,
                email: user.email
            })
        } else {
            commit('setUserData', null)
        }
    }
}

const mutations = {
    setSections(state, sections) { state.sections = sections },
    setShowVocab(state, showVocab) { state.showVocab = showVocab},
    setReviewDeck(state, cards) { state.reviewSession.cards = cards},
    setProgress(state, data) { state.progress = data },
    setUserLoggedIn(state, value) { state.user.loggedIn = value },
    setUserData(state, data) { state.user.data = data }
}

export default {
    state,
    getters,
    actions,
    mutations,
}