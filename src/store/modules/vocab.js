import radicals from '@/config/radicals.json'
import hsk1 from '@/config/hsk1.json'

const genVocab = (lst) => lst.map(x => { 
    return { 
        char: x, 
        lvl: Math.floor(Math.random() * 5)
    }
})

let hsk1_flat = hsk1.reduce((x, y) => {
  let chars = y.split("");
  return [...x, ...chars];
}, [])

const state = {
    vocab: [
        {
            name: "Radicals (Top 100)",
            chars: genVocab(radicals),
            color_hue: 90,
        },
        {
            name: "HSK 1",
            chars: genVocab(hsk1_flat),
            color_hue: 45,
        },
    ]
}

const getters = {
    getAllVocab: state => state.vocab
}

const actions = {
    // async fetchTodos({ commit }) {
    //     const response = await axios.get('https://jsonplaceholder.typicode.com/todos')
    //     commit('setTodos', response.data)
    // },
}

const mutations = {
    setTodos(state, todos) { state.todos = todos },
    newTodo(state, todo) { state.todos.unshift(todo) },
    removeTodo(state, id) { state.todos = state.todos.filter(x => x.id !== id) },
    updateTodo(state, updTodo) {
        const index = state.todos.findIndex(todo => todo.id === updTodo.id)
        if (index !== -1) {
            state.todos.splice(index, 1, updTodo)
        }
    }

}

export default {
    state,
    getters,
    actions,
    mutations,
}