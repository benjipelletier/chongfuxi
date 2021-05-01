import Vue from 'vue'
import Vuex from 'vuex'
// import sections from './server/data/sections.json'
// import settings from './server/data/settings.json'
import { Sections } from '@/js/model.js'

const state = {
    sections: {},
    progress: {},
    reviewSession: {
        cards: [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    },
    user: {
        loggedIn: false,
        data: null
    },
    size: {
      labels: ["小","中","大"],
      idx: 0
    },
    showType: {
      labels: ['词汇', '字', '字（不重复）'],
      idx: 0
    }
}

const getters = {
    getSections: state => state.sections,
    getReviewLevel: state => (char) => {
      return state.progress[char]?.review_level || 0
    },
    getReviewSession: state => state.reviewSession,
    getUser: state => state.user,
    getSize: state => state.size,
    getShowType: state => state.showType
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
    async setReviewDeck({ commit }, newCards) {
        commit('setReviewDeck', newCards)
    },
    async fetchUser({ commit }, user) {
        if (user) {
            let idToken = await user.getIdToken(true);
            commit('setUserLoggedIn', true)
            commit('setUserData', {
                displayName: user.displayName,
                email: user.email,
                photo: user.photoURL,
                idToken: idToken
            })
        } else {
            commit('setUserLoggedIn', false)
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
    },
    async setSize({ commit }, idx) {
        commit('setSize', idx)
    },
    async setShowType({ commit }, idx) {
        commit('setShowType', idx)
    }
}

const mutations = {
    setSections(state, sections) { state.sections = sections },
    setReviewDeck(state, cards) { state.reviewSession.cards = cards},
    setProgress(state, data) { state.progress = data },
    setUserLoggedIn(state, value) { state.user.loggedIn = value },
    setUserData(state, data) { state.user.data = data; },
    addSection(state, data) { state.sections.push(data) },
    removeSection(state, idx) { state.sections.splice(idx, 0) },
    editSection(state, data) { console.log(data); state.sections[data.idx].title = data.title},
    setSize(state, idx) { state.size.idx = idx },
    setShowType(state, idx) { state.showType.idx = idx }
}

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
})
