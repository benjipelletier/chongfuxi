// import sections from './server/data/sections.json'
// import settings from './server/data/settings.json'

import axios from 'axios'

const URL_BASE = 'http://localhost:3000'

// const genVocab = (lst) => lst.map(x => { 
//     return { 
//         char: x, 
//         lvl: Math.floor(Math.random() * 5)
//     }
// })

// let hsk1_flat = hsk1.reduce((x, y) => {
//   let chars = y.split("");
//   return [...x, ...chars];
// }, [])

// const sections_mod = sections.map(x => {
//     return {
//         settings: settings.sections[x.title],
//         ...x, 
//     };
// })

const state = {
    sections: {},
    user: {}
}

const getters = {
    getSections: state => state.sections,
    getCharData: state => (char) => state.user[char]
}

const actions = {
    async fetchSections({ commit }) {
        const response = await axios.get(URL_BASE + '/sections');
        commit('setSections', response.data);
    },
    async fetchUserData({ commit }) {
        const response = await axios.get(URL_BASE + '/user');
        commit('setUser', response.data);
    },
}

const mutations = {
    setSections(state, sections) { state.sections = sections },
    setUser(state, user) { state.user = user; },
}

export default {
    state,
    getters,
    actions,
    mutations,
}