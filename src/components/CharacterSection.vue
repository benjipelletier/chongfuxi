<template>
<div class="mb-5 flex flex-col">
    <span class="block relative -top-20 invisible" :id="section.id"></span>
    <div class="w-full h-14 flex" >
        <span class="w-4/5 text-white font-thin text-5xl">{{section.title}}</span>
        <div class="w-1/5 flex justify-end items-center space-x-2">
            <button :class="progressClass(section, 4)" class="h-8 w-16 ring-gray-300 hover:ring-2 active:outline-none flex justify-center items-center rounded">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="white">
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
            </button>
            <button v-if="!section.base_section" @click="showEditSecModal(section.title, sectionIdx)" class="h-8 w-8 bg-gray-600 ring-gray-300 hover:ring-2 active:outline-none flex justify-center items-center rounded">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="white">
                    <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
                </svg>
            </button>
        </div>
    </div>
        <div :class="cardSizeStyle" class="character-grid my-2" id="panel-2">
            <CharacterCard 
            v-for="(char, i) in (getShowVocab ? section.words : section.characters)" 
            :key="i" 
            :character="char"
            :reviewLevel="getReviewLevel(char)"
            :showVocab="getShowVocab"
            :color="section.color"
            :sectionId="section.id"
            :size="size" />
    </div>

</div>
</template>

<script>
import CharacterCard from '@/components/CharacterCard'
import { mapGetters } from 'vuex'
import { StyleCalc } from '@/util/helpers.js'

export default {
    name: "CharacterSection",
    components: {
        CharacterCard
    },
    data() {
        return {
            visible: true,
        }
    },
    props: [
        'section',
        'sectionIdx',
        'size'
    ],
    computed: {
        max() { return this.section.characters.length; },
        getLvlCount() {
            return this.section.characters.length/5;
        },
        ...mapGetters(['getReviewLevel', 'getShowVocab']),
        cardSizeStyle() {
            return {
                'sm-char': this.size == 0,
                'md-char': this.size == 1,
                'lg-char': this.size == 2,
            }
        },
    },
    methods: {
        getLvlStyle(lvl) {
            return StyleCalc.cardBgColor(this.section.id, lvl);
        },
        reviewSection() {
            console.log()
            this.$emit('review-section', this.sectionIndex)
        },
        progressClass(section, level) {
            return StyleCalc.cardBgStyle(section.id, level)
        },
        showEditSecModal(title, secIdx) {
            console.log("nice")
            this.$emit('editSection', title, secIdx);
        }
    }
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
    grid-template-columns: repeat(auto-fill, minmax(2rem, 1fr));
}

.md-char {
    grid-template-columns: repeat(auto-fill, minmax(3rem, 1fr));
}

.lg-char {
    grid-template-columns: repeat(auto-fill, minmax(5rem, 1fr));
}

</style>