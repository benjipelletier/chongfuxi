import Vue from 'vue'
import Vuex from 'vuex'
// import sections from './server/data/sections.json'
// import settings from './server/data/settings.json'
import { Sections } from '@/js/model.js'

const state = {
    sections: {},
    progress: {},
    showVocab: false,
    reviewSession: {
        cards: [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    },
    user: {
        loggedIn: false,
        data: null
    }
}

const getters = {
    getSections: state => state.sections,
    getReviewLevel: state => (char) => {
      state.progress[char]?.review_level || 0
    },
    getShowVocab: state => state.showVocab,
    getReviewSession: state => state.reviewSession,
    getUser: state => state.user
}

const actions = {
    async fetchSections({ commit }) {
        await Sections.load()
        commit('setSections', Sections.data);
    },
    async fetchProgress({ commit }) {
        // const response = await axios.get(URL_BASE + '/user')
        console.log(commit)
        // commit('setProgress', response.data)
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
                email: user.email,
                photo: user.photoURL,
            })
        } else {
            commit('setUserData', null)
        }
    },
    async addSection({ commit }, title) {
        commit('addSection', {
            characters: [],
            vocabulary: [],
            title: title,
            id: title.trim().replaceAll(" ", "_").toLowerCase()
        })
    },
    async removeSection({ commit }, idx) {
        commit('removeSection', idx)
    },
    async editSection({ commit }, data) {
        commit('editSection', data)
    }
}

const mutations = {
    setSections(state, sections) { state.sections = sections },
    setShowVocab(state, showVocab) { state.showVocab = showVocab},
    setReviewDeck(state, cards) { state.reviewSession.cards = cards},
    setProgress(state, data) { state.progress = data },
    setUserLoggedIn(state, value) { state.user.loggedIn = value },
    setUserData(state, data) { state.user.data = data; },
    addSection(state, data) { state.sections.push(data) },
    removeSection(state, idx) { state.sections.splice(idx, 0) },
    editSection(state, data) { console.log(data); state.sections[data.idx].title = data.title}
}

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
})
