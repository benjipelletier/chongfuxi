<template>
    <main class="dark:bg-gray-900 min-h-screen">
      <div class="flex items-start">
        <div id="sidebar" class="w-72 pt-16 h-screen fixed hidden md:block dark:bg-gray-800">
          <div class="w-auto h-auto p-2">
            <div class="m-2 my-4 flex flex-col" v-for="(section, i) in getSections" :key="i">
              <div class="dark:bg-white dark:bg-opacity-10 dark:hover:bg-opacity-20 cursor-pointer h-12 rounded-t flex items-center px-2">
                <span class="text-white font-light text-2xl">{{section.title}}</span>
              </div>
              <div class="bg-gray-900 h-3 rounded-b">
              </div>
            </div>
          </div>
        </div>
        <div id="main-content" class="flex flex-col mt-16 p-4 ml-0 md:ml-72">
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