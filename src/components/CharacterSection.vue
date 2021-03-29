<template>
<div class="rounded bg-white shadow-md mb-5 mx-2">
    <div class="section-header">
        <div class="header-title" @click="visible = !visible">
            <h3 class="title text-black">{{section.title}}</h3>
            <div class="header-right">
                <b-button v-on:click.stop="reviewSection" class="review-button" variant="info"><b-icon icon="archive"></b-icon><b-icon icon="clock"></b-icon></b-button>
            </div>
        </div>
        <b-progress class="progress mt-2" :max="max" :class="{noBottomBorderRadius: visible}">
            <b-progress-bar class="progress-part" :style="getLvlStyle(4)" :value="getLvlCount"></b-progress-bar>
            <b-progress-bar class="progress-part" :style="getLvlStyle(3)" :value="getLvlCount"></b-progress-bar>
            <b-progress-bar class="progress-part" :style="getLvlStyle(2)" :value="getLvlCount"></b-progress-bar>
            <b-progress-bar class="progress-part" :style="getLvlStyle(1)" :value="getLvlCount"></b-progress-bar>
            <b-progress-bar class="progress-part" :style="getLvlStyle(0)" :value="getLvlCount"></b-progress-bar>
        </b-progress>
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
            :color="section.color" />
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
            return StyleCalc.cardBgColor(this.section.color, lvl);
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
    /* border: 1px solid #ced4da; */
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