<template>
    <main class="dark:bg-gray-900 min-h-screen">
      <div class="flex items-start">
        <div id="sidebar" class="w-72 pt-16 h-screen fixed hidden md:block dark:bg-gray-800 overflow-y-scroll">
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

            <div class="flex flex-col overflow-ellipsis overflow-hidden" v-for="(section, i) in getSections" :key="i">
              <div class="dark:bg-white dark:bg-opacity-10 dark:hover:bg-opacity-20 active:bg-opacity-30 cursor-pointer h-12 rounded-t flex items-center">
                <a :href="'#' + section.canonicalId" class="w-full text-white font-light text-2xl w-full h-full px-2 flex items-center">
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
              v-on:review-section="reviewSection(i)"
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
      currSectionIndex: -1,
      newCharsCount: 0,
      newCards: [],
      showTypeIdx: 0,
      newSecModal: false,
      editSecModal: false,
      editSecData: {
        title: null,
        idx: null
      },
    }
  },
  computed: {
    ...mapGetters(['getSections', 'getReviewLevel', 'getSize', 'getShowType', 'getModals']),
  },
  methods: {
    ...mapActions(['setReviewDeck', 'addSection', 'removeSection', 'editSection', 'setSize', 'setShowType', 
    ]),
    reviewSection(i) {
      this.currSectionIndex = i
      this.$bvModal.show('review-modal')
    },
    handleGoReview() {
      this.setReviewDeck(this.newCards);
      this.$router.push("review")
    },
    setNewCards() {
      // let section = this.getSections[this.currSectionIndex];
      // let charSet = this.getShowVocab ? section.words : section.characters
      // this.newCards = charSet.filter(char => this.getReviewLevel(char) || -1 == 0).slice(0, this.newCharsCount)
    },
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
  },
  watch: {
    newCharsCount() {
      this.setNewCards()
    },
    currSectionIndex() {
      this.setNewCards();
    }
  }
}
</script>

<style scoped>

</style>