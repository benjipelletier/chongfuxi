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

            <div v-if="getUser.loggedIn" class="flex space-x-2 w-full">
              <button @click="reviewSessionSRS()" class="bg-indigo-500 h-14 flex-grow text-white text-xl font-light active:outline-none focus:outline-none hover:bg-opacity-80 flex justify-center space-x-2 p-2 rounded">
                  <div v-if="getUserProgress.reviewSets.new.length !== 0" class="flex items-center h-full space-x-1">
                      <span>{{getUserProgress.reviewSets.new.length}}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clip-rule="evenodd" />
                      </svg>
                  </div>
                  <div class="flex items-center h-full space-x-1">
                      <span>{{getUserProgress.reviewSets.ready.length}}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="white">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                      </svg>
                  </div>
                  <div class="flex items-center h-full space-x-1">
                      <span>{{getUserProgress.reviewSets.waiting.length}}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="white">
                          <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                      </svg>
                  </div>
              </button>
              <div class="flex space-x-1">
                <button @click="reviewSelectGo" :class="{'rounded-l': getGlobalSelect.mode, 'rounded': !getGlobalSelect.mode}" class="bg-indigo-500 h-14 w-full text-white text-xl font-light active:outline-none focus:outline-none hover:bg-opacity-80 flex justify-center space-x-2 p-2 disabled:opacity-50" :disabled="getGlobalSelect.mode && getGlobalSelect.vocab.length === 0">
                    <div class="flex items-center h-full space-x-1">
                      <span v-if="getGlobalSelect.mode"> {{getGlobalSelect.vocab.length}} </span>
                      <svg v-if="getGlobalSelect.mode" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="white">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg> 
                      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
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
                  <div v-for="barI in [10,9,8,7,6,5,4,3,2,1,0]" :key="'progress-bar-' + barI" :style="progressWidth(section, barI)" :class="progressClass(section, barI)" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center"></div>
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
            <div class="mb-4 flex">
              <!-- <div v-for="(attr, i) in this.getUserProgress.groupByDueDateToday()" :key="i">
                {{attr}}
              </div> -->
            <bar-chart :data="getLevelChartData"></bar-chart>
            <v-calendar :attributes="calendarAttrs" is-dark>
              <template #day-popover="{ day, format, masks, attributes }">
                <div class="">
                    <span>{{ format(day.date, masks.dayPopover) }}</span>
                  <div
                    v-for="attr in orderAttributes(attributes)"
                    :key="attr.key"
                    :attribute="attr">
                    {{ attr.customData.label }}
                  </div>
                </div>
              </template>
            </v-calendar>
              <!-- <div v-for="(times, i) in this.getUserProgress.groupByDueDateToday()" :key="i">
                {{times.date}}
              </div> -->
            </div>
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
    AddCharacterModal,
  },
  data() {
    return {
      newSecModal: false,
      editSecModal: false,
      editSecData: {
        title: null,
        idx: null
      },
      defaultCalendarAttrs: [
        {
          key: 'today',
          highlight: {
            color: 'indigo',
            fillMode: 'solid',
            contentClass: 'italic',
          },
          dates: new Date(),
        },
      ]
    }
  },
  computed: {
    ...mapGetters(['getSections', 'getReviewLevel', 'getSize', 'getShowType', 'getModals', 'getGlobalSelect', 'getUser', 'getUserProgress']),
    calendarAttrs() {
    return [...this.defaultCalendarAttrs,
    ...this.getUserProgress.groupByDueDatesExludingToday().map(entry => {
      return {
        dates: entry.date,
        popover: {
          visibility: 'hover'
        },
        bar: 'indigo',
        customData: {
          label: entry.date.toLocaleString('en-US', { hour: 'numeric', hour12: true }) + ' : ' + entry.words.length + ' due',
          date: entry.date
        }
      }
    })]
    },
    getLevelChartData() {
      let arr = new Array(11).fill(0).map((x, i) => [i, Object.keys(this.getUserProgress.collection).filter(word => this.getUserProgress.collection[word].level == i).length])
      console.log(arr)
      return arr
    }
  },
  methods: {
    ...mapActions(['setReviewDeck', 'addSection', 'removeSection', 'editSection', 'setSize', 'setShowType', 'setGlobalSelectMode', 'setReviewSession']),
    progressClass(section, level) {
      return StyleCalc.cardBgStyle(section.id, level)
    },
    progressWidth(section, level) {
      let sec_len = section.words.length;
      let words_len = section.words.filter(word => this.getReviewLevel(word) == level).length
      let percent = Math.ceil(words_len*100/sec_len)
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
        this.setGlobalSelectMode(false)
      }
    },
    reviewSessionSRS() {
      if (this.getUserProgress.reviewSets.new.length + this.getUserProgress.reviewSets.ready.length !== 0) {
        this.setReviewSession({
            isSRS: true,
            cards: this.getUserProgress.getWordsToReview()
        })
        this.$router.push("review")
      }
    },
    orderAttributes(attrs) {
      return attrs.sort(function compare(a, b) {
        console.log('a',  a)
        var dateA = new Date(a.customData.date);
        var dateB = new Date(b.customData.date);
        return dateA - dateB;
      });
    }
  },
}
</script>

<style scoped>

.is-active {
 @apply bg-white bg-opacity-20;
}

</style>