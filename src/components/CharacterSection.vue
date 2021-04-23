<template>
<div class="mt-2 mb-5 flex flex-col">
    <div class="w-full h-15 sticky top-0">
            <span class="text-white font-thin text-5xl">{{section.title}}</span>
    </div>
    <b-collapse id="section-collapse" v-model="visible">
        <div class="character-grid">
            <CharacterCard 
            class="item" 
            v-for="(char, i) in (getShowVocab ? section.vocabulary : section.characters)" 
            :key="i" 
            :character="char"
            :charData="getCharData(char)"
            :showVocab="getShowVocab"
            :color="section.color"
            :sectionId="section.id" />
    </div>
    </b-collapse>

</div>
</template>

<script>
import CharacterCard from '@/components/CharacterCard'
import { mapGetters } from 'vuex'
import { StyleCalc } from '@/util/helpers.js'

export default {
    name: "CharacterSection",
    components: {
        CharacterCard,
    },
    data() {
        return {
            visible: true,
        }
    },
    props: [
        'section',
        'sectionIndex'
    ],
    computed: {
        max() { return this.section.characters.length; },
        getLvlCount() {
            return this.section.characters.length/5;
        },
        ...mapGetters(['getCharData', 'getShowVocab']),
    },
    methods: {
        getLvlStyle(lvl) {
            return StyleCalc.cardBgColor(this.section.id, lvl);
        },
        reviewSection() {
            console.log()
            this.$emit('review-section', this.sectionIndex)
        },
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

.collapse-button:focus {
    border: none;
    outline: none;
    background-color: rgba(255,255,255,0);
}

.progress {
    height: 100%;
    margin: 0 !important;
    transition: border-bottom-left-radius, border-bottom-right-radius;
    transition-duration: 0.3s;
}

.noBottomBorderRadius {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
}

.character-grid {
    padding: 0.5rem;
    display: flex;
    flex-wrap:wrap;
    gap: 0.5rem;
    /* gap: 0.5rem;
    grid-template-columns: repeat(auto-fill, minmax(40px, 1fr)); */
}

.character-grid::after {
  content: '';
  flex-grow: 1000000000;
}

</style>