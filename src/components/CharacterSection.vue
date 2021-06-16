<template>
<div class="mb-5 flex flex-col">
    <span class="block relative -top-16 invisible" :id="section.canonicalId"></span>
    <div class="w-full h-14 flex overflow-clip">
        <div class="w-3/5 text-white font-thin text-5xl">
            <div @click="collapsed = !collapsed" class="inline-flex space-x-4 items-center hover: hover:bg-opacity-10 cursor-pointer rounded">
                <span>{{section.title}}</span>
                <div>
                    <svg v-if="collapsed" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="gray">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                    </svg>
                </div>
            </div>
        </div>
        <div v-if="getEditSectionId === section.id" class="w-2/5 flex justify-end items-center space-x-2">
            <button @click="removeWords(section, selectedList)" :disabled="selectedList.length === 0" class="disabled:opacity-50 bg-red-500 h-10 w-10 active:outline-none focus:outline-none hover:bg-opacity-80 flex justify-center items-center rounded" >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="white">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
            </button>
            <button @click="editMode(null)" class="bg-green-500 h-10 w-10 active:outline-none focus:outline-none hover:bg-opacity-80 flex justify-center items-center rounded">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="white">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
            </button>
        </div>
        <div v-else class="w-2/5 flex justify-end items-center space-x-2">
            <div v-if="getGlobalSelect.mode">
                <button @click="selectAll()" :class="progressClass(section, 10)" class="h-10 text-white font-bold active:outline-none focus:outline-none hover:bg-opacity-80 disabled:opacity-25 flex justify-center items-center space-x-2 p-2 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clip-rule="evenodd" />
                    </svg>
                </button>
            </div>
            <div class="flex space-x-0">
                <button @click="reviewSectionSRS()" :disabled="getReadySet.size === 0" :class="progressClass(section, 10)" class="h-10 text-white font-bold active:outline-none focus:outline-none hover:bg-opacity-80 disabled:opacity-25 flex justify-center space-x-2 p-2 rounded">
                    <div class="flex items-center h-full space-x-1">
                        <span>{{getReadySet.size}}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="white">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                        </svg>
                    </div>
                    <div class="flex items-center h-full space-x-1">
                        <span>{{getWaitingSet.size}}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="white">
                            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                        </svg>
                    </div>
                </button>
            </div>
            <div class="flex space-x-0">
                <button @click="reviewSection()" :class="progressClass(section, 10)" class="h-10 text-white font-bold active:outline-none focus:outline-none hover:bg-opacity-80 flex justify-center space-x-1 p-2 rounded">
                        <span>{{chooseShowType().length}}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="white">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                            <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        </svg>
                </button>
            </div>
            <button v-if="!section.base_section" @click="editMode(section.id)" class="h-10 w-10 bg-gray-600 hover:bg-opacity-80 active:outline-none focus:outline-none flex justify-center items-center rounded">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="white">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
            </button>
            <button v-if="!section.base_section" @click="showEditSecModal(section.title, section.id)" class="h-10 w-10 bg-gray-600 hover:bg-opacity-80 active:outline-none focus:outline-none flex justify-center items-center rounded">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="white">
                    <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
                </svg>
            </button>
        </div>
    </div>
        <div v-if="!collapsed" :class="cardSizeStyle" class="character-grid my-2" id="panel-2">
            <CharacterCard 
            v-for="(char, i) in chooseShowType()"
            :key="i" 
            :character="char"
            :color="section.color"
            :sectionId="section.id"
            :selected="selectedList.includes(char)"
            v-on:select="selectCard(char)" />
            <CharacterCard 
            v-if="!section.base_section"
            character="+"
            :sectionId="section.id"
            :addCharType="true" />
        </div>
</div>
</template>

<script>
import CharacterCard from '@/components/CharacterCard'
import { mapGetters, mapActions } from 'vuex'
import { StyleCalc } from '@/util/helpers.js'

export default {
    name: "CharacterSection",
    components: {
        CharacterCard
    },
    data() {
        return {
            visible: true,
            selectedList: [],
            collapsed: false
        }
    },
    props: [
        'section',
    ],
    computed: {
        ...mapGetters(['getSize', 'getShowType', 'getEditSectionId', 'getGlobalSelect', 'getUserReviewSets']),
        cardSizeStyle() {
            return {
                'sm-char': this.getSize.idx == 0,
                'md-char': this.getSize.idx == 1,
                'lg-char': this.getSize.idx == 2,
            }
        },
        getNewSet() {
            return this.getUserReviewSets.new
        },
        getReadySet() {
            return new Set(this.chooseShowType().filter(word => this.getUserReviewSets.ready.has(word)))
        },
        getWaitingSet() {
            return new Set(this.chooseShowType().filter(word => this.getUserReviewSets.waiting.has(word)))
        }
    },
    methods: {
        ...mapActions(['setEditSectionId', 'removeWordsFromSection', 'setReviewSession', 'updateGlobalSelectVocab']),
        progressClass(section, level) {
            return StyleCalc.cardBgStyle(section.id, level)
        },
        showEditSecModal(title, secIdx) {
            this.$emit('editSection', title, secIdx);
        },
        chooseShowType() {
            if (this.getShowType.idx == 1) {
                return this.section.characters
            } else if (this.getShowType.idx == 2) {
                return this.section.charactersUnique
            }
            return this.section.words
        },
        editMode(sectionId) {
            this.selectedList = []
            this.setEditSectionId(sectionId)
        },
        selectCard(char) {
            if (this.selectedList.includes(char)) {
                this.selectedList = this.selectedList.filter(x => x !== char)
            } else {
                this.selectedList.push(char)
            }
            console.log(char)
        },
        removeWords(section, words) {
            this.removeWordsFromSection({section, words})
            this.setEditSectionId(null)
        },
        reviewSection() {
            this.setReviewSession({
                isSRS: false,
                cards: this.chooseShowType()
            })
            console.log('set')
            this.$router.push("review")
            console.log('pushing')
        },
        reviewSectionSRS() {
            this.setReviewSession({
                isSRS: true,
                cards: [...this.getReadySet]
            })
            this.$router.push("review")
        },
        selectAll() {
            this.chooseShowType().forEach(word => {
                this.updateGlobalSelectVocab(word)
            })
        }
    },
}
</script>

<style scoped>
.section-header {
    height: 3rem;
    color: white;
    position: relative;
}

.header-title {
    position: absolute;
    left: 0;
    right: 0;
    height: 3rem;
    display: flex;
    padding-left: 0.5rem;
    justify-content: space-between;
    cursor: pointer;
}

.title {
    font-weight: 900;
    margin: auto 0;
}

.header-right {
    width: 7rem;
    margin: auto 0;
    padding: 0.5rem;
}

.review-button {
    width: 100%;
    display: flex;
    justify-content: space-evenly;
}

.character-grid {
    display: grid;
    gap: 0.5rem;
}

.sm-char {
    gap:0.3rem;
    grid-template-columns: repeat(auto-fill, minmax(2rem, 1fr));
}

.md-char {
    grid-template-columns: repeat(auto-fill, minmax(3rem, 1fr));
}

.lg-char {
    grid-template-columns: repeat(auto-fill, minmax(5rem, 1fr));
}

</style>