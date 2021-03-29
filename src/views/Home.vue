<template>
    <main class="pt-16 flex-1  bg-gray-100">
      <div class="flex items-start max-w-screen-xl m-auto">
        <div id="sidebar" class="w-1/5 hidden md:block overflow-auto sticky top-4">
          <div class="px-2 pb-5 h-full overflow-x-hidden overflow-y-auto">
            <div id="sidebar-card" class="relative p-4 bg-white shadow-lg rounded">
              <h1 class="lg:mb-3 uppercase tracking-wide font-bold text-m lg:text-xs text-gray-900">
                Sections
              </h1>
              <ul>
                <li>
                  sdf{{i}}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div id="main-content" class="relative md:w-4/5 w-full mb-4 flex flex-col">
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

<style scoped>

/* .character-section {
  margin: 10px 0;
  background-color: white;
  padding: 0;
  box-shadow: var(--main-shadow-inset);
}

.modal-container {
  display: flex;
}

.modal-main {
  width: 80%;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.modal-main::after {
  content: '';
  flex-grow: 1000000000;
}

.add-chars {
  width: 20%;
  display: flex;
  justify-content: center;
} */

</style>