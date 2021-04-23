<template>
    <main class="dark:bg-gray-900 min-h-screen">
      <div class="flex items-start">
        <div id="sidebar" class="w-72 pt-16 h-screen fixed hidden md:block dark:bg-gray-800">
          <div class="w-auto h-auto flex flex-col space-y-4 p-4">
            <!-- <div class="flex flex-row h-14 rounded">
              <button class="flex justify-center items-center w-1/3 bg-white bg-opacity-10 hover:bg-opacity-20 active:bg-white rounded-l">
                <span>小</span>
              </button>
              <div class="w-1/3 bg-white bg-opacity-20">sdf</div>
              <div class="w-1/3 bg-white bg-opacity-20 rounded-r"></div>
            </div> -->
            <div class="flex flex-col" v-for="(section, i) in getSections" :key="i">
              <div class="dark:bg-white dark:bg-opacity-10 dark:hover:bg-opacity-20 cursor-pointer h-12 rounded-t flex items-center">
                <a :href="'#' + section.id" class="text-white font-light text-2xl w-full h-full px-2 flex items-center">
                  <span>{{section.title}}</span>
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
          </div>
        </div>
        <div id="main-content" class="flex flex-col mt-16 p-4 ml-0 w-full md:ml-72">
            <CharacterSection 
              v-for="(section, i) in getSections" 
              :key="i"
              :section="section" 
              :sectionIndex="i" 
              v-on:review-section="reviewSection(i)" />
        </div>
      </div>
      <!-- <b-modal @ok="handleGoReview" id="review-modal" centered title="Review">
          <div class="modal-container">
            <div class="modal-main">
              <CharacterCard 
                class="item" 
                v-for="(char, i) in newCards"
                :key="i" 
                :character="char"
                :charData="getCharData(char)"
                :showVocab="getShowVocab"
                :color="getSections[currSectionIndex].color" />
            </div>
            <div class="add-chars">
            <b-form-spinbutton id="sb-vertical" size="lg" min="0" v-model="newCharsCount" vertical></b-form-spinbutton>
            </div>
          </div>
      </b-modal> -->
    </main>
</template>

<script>
import CharacterSection from '@/components/CharacterSection'
// import CharacterCard from '@/components/CharacterCard'
import { mapGetters, mapActions } from 'vuex'
import { StyleCalc } from '@/util/helpers.js'

export default {
  name: 'Home',
  components: {
    CharacterSection,
    // CharacterCard,
  },
  data() {
    return {
      currSectionIndex: -1,
      newCharsCount: 0,
      newCards: [],
    }
  },
  computed: {
    ...mapGetters(['getSections', 'getCharData', 'getShowVocab'])
  },
  methods: {
    ...mapActions(['setReviewDeck']),
    reviewSection(i) {
      this.currSectionIndex = i
      this.$bvModal.show('review-modal')
    },
    handleGoReview() {
      this.setReviewDeck(this.newCards);
      this.$router.push("review")
    },
    setNewCards() {
      let section = this.getSections[this.currSectionIndex];
      let charSet = this.getShowVocab ? section.vocabulary : section.characters
      this.newCards = charSet.filter(char => this.getCharData(char)?.review_level || -1 == 0).slice(0, this.newCharsCount)
    },
    progressClass(section, level) {
      return StyleCalc.cardBgStyle(section.id, level)
    },
    progressWidth(section, level) {
      let sec_len = section.characters.length;
      let chars_len = section.characters.filter(char => this.getCharData(char).review_level == level).length
      let percent = Math.floor(chars_len*100/sec_len)
      return `width: ${percent}%`

    }
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