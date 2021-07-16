import Vue from 'vue'
import Vuex from 'vuex'
// import sections from './server/data/sections.json'
// import settings from './server/data/settings.json'
import { Section } from '@/js/models/section.js';
import { User } from '../js/models/user.js';
import { Definition } from '../js/models/definition.js';
// import createPersistedState from "vuex-persistedstate";


const state = {
    sections: [],
    progress: {},
    reviewSession: {
        isSRS: false,
        cards: ['女', '啊','羡慕','水龙头', '家庭主妇',3]
    },
    user: {
        loggedIn: false,
        data: new User()
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
    globalSelect: {
        mode: false,
        vocab: []
    },
    definitions: {}
}

const getters = {
    getSections: state => state.sections,
    getReviewLevel: state => (char) => {
      return state.user.data.progress.collection[char]?.level
    },
    getUserProgress: state => {
        return state.user.data.progress
    },
    getReviewSession: state => state.reviewSession,
    getUser: state => state.user,
    getSize: state => state.size,
    getShowType: state => state.showType,
    getModals: state => state.modals,
    getEditSectionId: state => state.editSectionId,
    getGlobalSelect: state => state.globalSelect,
}


const actions = {
    async fetchSections({ commit }) {
        let sections = await Section.load()
        commit('setSections', sections);
    },
    async fetchUser({ commit }, user) {
        if (user) {
            commit('setUserLoggedIn', true)
            commit('fetchAndSetUserData', user)
        } else {
            commit('setUserLoggedIn', false)
            commit('setUserData', new User())
        }
    },
    async addSection({ commit }, title) {
        let section = await Section.post(title)
        if (!section) return
        console.log('posted ', section)
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
     },
    async setReviewSession({ commit }, reviewConfig) {
        commit('setReviewSession', reviewConfig)
    },
    async setDefinition({ commit }, entry) {
        try {
            const defn = await Definition.load(entry)
            commit('setDefinition', {entry, defn})
        } catch(e) {
            console.log(e)
            console.log("Couldn't find definition for " + entry)

        }
    },
    async setGlobalSelectMode({ commit }, mode) {
        commit('setGlobalSelectMode', mode)
    },
    async updateGlobalSelectVocab({ commit }, vocab) {
        commit('updateGlobalSelectVocab', vocab)
        commit('updateReviewNewSet', vocab)
    },
    async updateUserProgress({ commit }, updatedProgress) {
        commit('updateUserProgress', updatedProgress)
    }
}

const mutations = {
    setSections(state, sections) { state.sections = Object.freeze(sections) },
    setReviewDeck(state, cards) { state.reviewSession.cards = cards},
    setProgress(state, data) { state.progress = data },
    setUserLoggedIn(state, value) { state.user.loggedIn = value },
    setUserData(state, data) { state.user.data = data; },
    addSection(state, data) {
        Vue.set(state, 'sections', [...state.sections, data])
    },
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
        const stateSection = state.sections.find(e => e.id === section.id)
        stateSection.editWords({wordsToAdd, wordsToRemove})
        if (state.showType.idx === 2) {
            Section.updateCharactersUnique(state.sections)
        }
        console.log('here', section)
        console.log('here', stateSection)
        console.log('here', state.sections)
        Vue.set(state, 'sections', state.sections)
    },
    setEditSectionId(state, sectionId) { state.editSectionId = sectionId },
    setReviewSession(state, data) { state.reviewSession = data },
    setDefinition(state, {entry, defn}) { 
        if (state.definitions[entry] === undefined) {
            state.definitions[entry] = defn
        }
    },
    setGlobalSelectMode(state, mode) { 
        state.globalSelect.mode = mode
        if (mode === false) {
            Vue.set(state.globalSelect, 'vocab', [])
            state.user.data.progress.removeNew()
        }
    },
    updateGlobalSelectVocab(state, vocab) { 
        if (state.globalSelect.vocab.includes(vocab)) {
            Vue.set(state.globalSelect, 'vocab', state.globalSelect.vocab.filter(x => x != vocab))
        } else {
            Vue.set(state.globalSelect, 'vocab', [vocab, ...state.globalSelect.vocab])
        }
    },
    updateReviewNewSet(state, vocab) {
        state.user.data.progress.updateNew(vocab)
    },
    updateUserProgress(state, { word, updatedData }) {
        state.user.data.progress.updateProgress(word, updatedData)
    },
    async fetchAndSetUserData(state, user) {
        console.log('USER FOUND ', user)
        if (!state.user.data.retreivedData) {
            state.user.data = await User.load(user.uid, {
                name: user.displayName,
                email: user.email,
                photo: user.photoURL
            })
        }
    }
}

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
//   plugins: [createPersistedState()],
})
