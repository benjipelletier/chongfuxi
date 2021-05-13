<template>
    <div class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <!--
            Background overlay, show/hide based on modal state.

            Entering: "ease-out duration-300"
                From: "opacity-0"
                To: "opacity-100"
            Leaving: "ease-in duration-200"
                From: "opacity-100"
                To: "opacity-0"
            -->
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

            <!-- This element is to trick the browser into centering the modal contents. -->
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <!--
            Modal panel, show/hide based on modal state.

            Entering: "ease-out duration-300"
                From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                To: "opacity-100 translate-y-0 sm:scale-100"
            Leaving: "ease-in duration-200"
                From: "opacity-100 translate-y-0 sm:scale-100"
                To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            -->
            <div class="inline-block align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div class="bg-gray-900 px-4 py-4">
                    <div class="mb-2">
                        <span class="text-3xl font-light text-gray-500">Add Characters</span>
                    </div>
                        <div class="sm:flex sm:items-start">
                            <input type="text"  @keyup.enter="addChar" v-model.trim="input" placeholder="汉字" class="w-full h-12 rounded bg-gray-800 text-white p-2 outline-none text-3xl font-light focus:ring-2 ring-gray-700">
                        </div>
                    <!-- <div v-if="Object.keys(searchResults).length !== 0" class="flex flex-col space-y-2 bg-gray-400 p-2 rounded">
                        <span class="text-xl">{{searchResults.simplified}}</span>
                        <div v-for="(def, i) in searchResults.definitions" :key="i" class="bg-gray-300 p-2 rounded">
                            <span>{{def.pinyin}}</span>
                            <div v-for="(meaning, i) in def.meaning" :key="i" class="bg-gray-200 p-2 rounded">
                                <span>{{meaning}}</span>

                            </div>
                        </div>
                    </div> -->
                    <div class="mt-4 flex flex-row flex-wrap gap-2">
                        <div v-for="(word, i) in wordsToAdd" :key="i" @click="wordsToAdd.splice(i, 1)" class="relative bg-white h-10 w-max p-2 cursor-pointer ring-offset-gray-900 ring-offset-2 ring-red-500 hover:ring-2 hover:bg-red-100 flex justify-center items-center rounded">
                            <span class="text-xl">{{word}}</span>

                        </div>
                        <div v-if="input" class="bg-white h-10 w-max p-2 flex justify-center items-center rounded bg-opacity-30">
                            <span class="text-xl">{{input}}</span>

                        </div>
                    </div>
                </div>
                <div class="bg-gray-800 px-4 py-4 sm:flex sm:flex-row-reverse">
                    <button @click="confirm" class="w-full inline-flex justify-center rounded-md shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-gray-50 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-gray-600 sm:ml-3 sm:w-auto sm:text-sm">
                    Confirm
                    </button> 
                    <button type="button" @click="close" class="mt-3 w-full inline-flex justify-center rounded-md shadow-sm px-4 py-2 bg-gray-600 text-base font-medium text-gray-300 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-700 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                    Close
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
// import CharSearch from '@/js/character_search.js'

export default {
  name: 'AddCharacterModal',
  components: {
  },
  data() {
    return {
        input: "",
        wordsToAdd: []
    }
  },
  props: [
      'section'
  ],
  computed: {
        ...mapGetters(['getAddCharacterModalSection', 'getSections', 'getModals']),
  },
  methods: {
        ...mapActions(['closeAddCharacterModal', 'addWordsToSection']),
      close() {
          this.wordsToAdd = []
        this.closeAddCharacterModal()
      },
      confirm(e) {
          e.preventDefault()
          this.addWordsToSection({
              section: this.getSections.find(e => e.id == this.getModals['addCharacter'].sectionId),
              words: this.wordsToAdd
          })
          this.close()
      },
      addChar(e) {
          console.log()
          e.preventDefault()
          if (this.input.length == 0) return
          if (this.wordsToAdd.includes(this.input)) return
          this.wordsToAdd.push(this.input)
          this.input = ""
      }
  },
  watch: {
      async input() {
        //   let response = await CharSearch.search(this.input)
      }
  }
}
</script>

<style scoped>
</style>
