<template>
    <main class="dark:bg-gray-900 min-h-screen">
      <div class="flex items-start">
        <div id="sidebar" class="w-72 pt-16 h-screen fixed hidden md:block dark:bg-gray-800">
          <div class="w-auto h-auto flex flex-col space-y-4 p-4">
            <!-- Words/Chars -->
            <div class="flex flex-row h-14 rounded">
              <button class="flex justify-center items-center w-2/5 bg-white hover:bg-opacity-20 focus:outline-none first:rounded-l last:rounded-r"
                :class="{ 'bg-opacity-20 text-white hover:bg-opacity-20ring-inset text-2xl': 0 == getShowType.idx, 'bg-opacity-10 text-gray-400 text-2xl': 0 != getShowType.idx }"
                @click="setShowType(0)">
                <span class="font-light">{{getShowType.labels[0]}}</span>
              </button>
              <div class="flex w-3/5 flex-col">
                <button class="flex justify-center items-center w-full h-1/2 bg-white hover:bg-opacity-20 focus:outline-none rounded-tr"
                  :class="{ 'bg-opacity-20 text-white hover:bg-opacity-20ring-inset text-1xl': 1 == getShowType.idx, 'bg-opacity-10 text-gray-400 text-1xl': 1 != getShowType.idx }"
                  @click="setShowType(1)">
                  <span class="font-light">{{getShowType.labels[1]}}</span>
                </button>
                <button class="flex justify-center items-center w-full h-1/2 bg-white hover:bg-opacity-20 focus:outline-none first:rounded-l rounded-br"
                  :class="{ 'bg-opacity-20 text-white hover:bg-opacity-20ring-inset text-1xl': 2 == getShowType.idx, 'bg-opacity-10 text-gray-400 text-1xl': 2 != getShowType.idx }"
                  @click="setShowType(2)">
                  <span class="font-light">{{getShowType.labels[2]}}</span>
                </button>
              </div>
            </div>

            <!-- Sizes -->
            <div class="flex flex-row h-14 rounded">
              <button class="flex justify-center items-center w-1/3 bg-white hover:bg-opacity-20 focus:outline-none first:rounded-l last:rounded-r"
                v-for="(size, i) in getSize.labels"
                :class="{ 'bg-opacity-20 text-white hover:bg-opacity-20ring-inset text-2xl': i == getSize.idx, 'bg-opacity-10 text-gray-400 text-2xl': i != getSize.idx }"
                @click="setSize(i)"
                :key="i">
                <span class="font-light">{{size}}</span>
              </button>
            </div>

            <div class="flex space-x-2 w-full">
              <button class="bg-indigo-500 h-14 w-1/2 text-white text-xl font-light active:outline-none focus:outline-none hover:bg-opacity-80 flex justify-center space-x-2 p-2 rounded">
                  <div class="flex items-center h-full space-x-1">
                      <span>10</span>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="white">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                      </svg>
                  </div>
                  <div class="flex items-center h-full space-x-1">
                      <span>32</span>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="white">
                          <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                      </svg>
                  </div>
              </button>
              <div class="w-1/2 flex space-x-1">
                <button @click="reviewSelectGo" :class="{'rounded-l': getGlobalSelect.mode, 'rounded': !getGlobalSelect.mode}" class="bg-indigo-500 h-14 w-full text-white text-xl font-light active:outline-none focus:outline-none hover:bg-opacity-80 flex justify-center space-x-2 p-2 disabled:opacity-50" :disabled="getGlobalSelect.mode && getGlobalSelect.vocab.length === 0">
                    <div class="flex items-center h-full space-x-1">
                      <span v-if="getGlobalSelect.mode"> {{getGlobalSelect.vocab.length}} </span>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="white">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                    </div>
                </button>
                <button v-if="getGlobalSelect.mode" @click="setGlobalSelectMode(false)" class="bg-gray-500 w-1/3 flex justify-center items-center rounded-r text-white text-xl font-light active:outline-none focus:outline-none hover:bg-opacity-80 space-x-2 p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="white">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>


          <scrollactive class="flex flex-col space-y-4">
            <div class="flex flex-col overflow-ellipsis overflow-hidden" v-for="(section, i) in getSections" :key="i">
              <div class="h-12 rounded-t flex items-center">
                <a :href="'#' + section.canonicalId" class="scrollactive-item bg-white bg-opacity-10 hover:bg-opacity-20 cursor-pointer w-full text-gray-200 font-light text-2xl w-full h-full px-2 rounded-t flex items-center">
                  {{section.title}}
                </a>
              </div>
              <!-- <div class="bg-gray-900 h-3 rounded-b"> </div> -->
              <div class="relative">
                <div class="overflow-hidden h-2 text-xs flex rounded-b bg-gray-900">
                  <div :style="progressWidth(section, 4)" :class="progressClass(section, 4)" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center"></div>
                  <div :style="progressWidth(section, 3)" :class="progressClass(section, 3)" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center"></div>
                  <div :style="progressWidth(section, 2)" :class="progressClass(section, 2)" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center"></div>
                  <div :style="progressWidth(section, 1)" :class="progressClass(section, 1)" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center"></div>
                </div>
              </div>
            </div>
          </scrollactive >

            <div class="flex flex-row h-14 rounded">
              <button @click="showNewSecModal" class="flex justify-center items-center w-full bg-opacity-10 bg-white hover:bg-opacity-20 focus:outline-none active:bg-opacity-30 first:rounded-l last:rounded-r">
                <span class="font-bold text-white text-opacity-20 text-5xl">+</span>
              </button>
            </div>

          </div>
        </div>
        <div id="main-content" class="flex flex-col mt-16 p-4 ml-0 w-full md:ml-72">
            <CharacterSection 
              v-for="(section, i) in getSections" 
              :key="i"
              :section="section" 
              :sectionIdx="i" 
              @editSection="showEditSecModal" />
        </div>
      </div>
      <Modal
        header="New Section"
        v-show="newSecModal"
        @close="closeNewSecModal"
        @confirm="confirmNewSecModal" />
      <Modal
        header="Edit Section"
        :title="editSecData.title"
        :idx="editSecData.idx"
        :isEditSection="true"
        v-show="editSecModal"
        @close="closeEditSecModal"
        @confirm="confirmEditSecModal"
        @delete="deleteEditSecModal" />
      <AddCharacterModal v-show="getModals.addCharacter.open"/>
    </main>
</template>

<script>
import CharacterSection from '@/components/CharacterSection'
import Modal from '@/components/Modal.vue'
import AddCharacterModal from '@/components/AddCharacterModal.vue'
// import CharacterCard from '@/components/CharacterCard'
import { mapGetters, mapActions } from 'vuex'
import { StyleCalc } from '@/util/helpers.js'

export default {
  name: 'Home',
  components: {
    CharacterSection,
    Modal,
    AddCharacterModal
  },
  data() {
    return {
      newSecModal: false,
      editSecModal: false,
      editSecData: {
        title: null,
        idx: null
      },
    }
  },
  computed: {
    ...mapGetters(['getSections', 'getReviewLevel', 'getSize', 'getShowType', 'getModals', 'getGlobalSelect']),
  },
  methods: {
    ...mapActions(['setReviewDeck', 'addSection', 'removeSection', 'editSection', 'setSize', 'setShowType', 'setGlobalSelectMode', 'setReviewSession']),
    progressClass(section, level) {
      return StyleCalc.cardBgStyle(section.id, level)
    },
    progressWidth(section, level) {
      let sec_len = section.characters.length;
      let chars_len = section.characters.filter(char => this.getReviewLevel(char) == level).length
      let percent = Math.floor(chars_len*100/sec_len)
      return `width: ${percent}%`
    },
    // new section
    showNewSecModal() {
      this.newSecModal = true;
    },
    closeNewSecModal() {
      this.newSecModal = false;
    },
    confirmNewSecModal(title) {
      this.addSection(title)
    },
    // edit section
    showEditSecModal(title, idx) {
      this.editSecData = {
        title,
        idx
      }
      this.editSecModal = true;
    },
    closeEditSecModal() {
      this.editSecModal = false;
    },
    confirmEditSecModal(data) {
      this.editSection(data)
    },
    deleteEditSecModal(idx) {
      this.removeSection(idx)
    },
    reviewSelectGo() {
      if (!this.getGlobalSelect.mode) {
          this.setGlobalSelectMode(true)
      } else {
        // col
        this.setReviewSession({
          isSRS: false,
          cards: this.getGlobalSelect.vocab
        })
        console.log('set')
        this.$router.push("review")
      }
    },
  },
}
</script>

<style scoped>

.is-active {
 @apply bg-white bg-opacity-20;
}

</style>