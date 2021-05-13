import Vue from 'vue'
import Vuex from 'vuex'
// import sections from './server/data/sections.json'
// import settings from './server/data/settings.json'
import { Section } from '@/js/models/section.js';


const state = {
    sections: [],
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
      idx: 1
    },
    showType: {
      labels: ['词汇', '字', '字（不重复）'],
      idx: 0
    },
    editSectionId: null,
    modals: {
        addCharacter: {
            open: false,
            sectionId: null
        }
    },
}

const getters = {
    getSections: state => state.sections,
    getReviewLevel: state => (char) => {
      return state.progress[char]?.review_level || 0
    },
    getReviewSession: state => state.reviewSession,
    getUser: state => state.user,
    getSize: state => state.size,
    getShowType: state => state.showType,
    getModals: state => state.modals,
    getEditSectionId: state => state.editSectionId
}

const actions = {
    async fetchSections({ commit }) {
        let sections = await Section.load()
        commit('setSections', sections);
    },
    // async fetchProgress({ commit }) {
    //     // const response = await axios.get(URL_BASE + '/user')
    //     console.log(commit)
    //     // commit('setProgress', response.data)
    // },
    // async setReviewDeck({ commit }, newCards) {
    //     commit('setReviewDeck', newCards)
    // },
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
        let section = await Section.post(title)
        if (!section) return
        commit('addSection', section)
    },
    async setEditSectionId({ commit }, sectionId) {
        commit('setEditSectionId', sectionId)
    },
    async removeSection({ commit }, sectionId) {
        await Section.delete(sectionId)
        commit('removeSection', sectionId)
    },
    async editSection({ commit }, data) {
        await Section.put(data.idx, data.title)
        commit('editSection', {
            idx: data.idx,
            title: data.title
        })
    },
    async setSize({ commit }, idx) {
        commit('setSize', idx)
    },
    async setShowType({ commit }, idx) {
        commit('setShowType', idx)
    },
    async addWordsToSection({ commit }, { section, words }) {
        await section.patchWords({wordsToAdd: words})
        commit('editSectionWords', {
            section,
            wordsToAdd: words
        })
    },
    async removeWordsFromSection({ commit }, { section, words }) {
        await section.patchWords({wordsToRemove: words})
        commit('editSectionWords', {
            section,
            wordsToRemove: words
        })
    },
    async openAddCharacterModal({ commit }, sectionId) { 
        commit('updateModal', {
            modalId: 'addCharacter',
            data: {
                open: true,
                sectionId
            }
        })
    },
    async closeAddCharacterModal({ commit }) { 
        commit('updateModal', {
            modalId: 'addCharacter',
            data: {
                open: false,
                sectionId: null
            }
        })
     }
}

const mutations = {
    setSections(state, sections) { state.sections = sections },
    setReviewDeck(state, cards) { state.reviewSession.cards = cards},
    setProgress(state, data) { state.progress = data },
    setUserLoggedIn(state, value) { state.user.loggedIn = value },
    setUserData(state, data) { state.user.data = data; },
    addSection(state, data) { state.sections.push(data) },
    removeSection(state, sectionId) { 
        state.sections = state.sections.filter(e => e.id !== sectionId)
    },
    editSection(state, data) { 
        const section = state.sections.find(e => e.id === data.idx)
        section.edit(data)
    },
    setSize(state, idx) { state.size.idx = idx },
    setShowType(state, idx) { 
        if (idx === 2) {
            Section.updateCharactersUnique(state.sections)
        }
        state.showType.idx = idx 
    },
    updateModal(state, payload) { state.modals[payload.modalId] = payload.data },
    editSectionWords(state, { section, wordsToAdd, wordsToRemove }) {
        section.editWords({wordsToAdd, wordsToRemove})
        if (state.showType.idx === 2) {
            Section.updateCharactersUnique(state.sections)
        }
    },
    setEditSectionId(state, sectionId) { state.editSectionId = sectionId }
}

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
})
