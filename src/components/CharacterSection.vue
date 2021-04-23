<template>
<div class="mb-5 flex flex-col">
    <span class="block relative -top-20 invisible" :id="section.id"></span>
    <div class="w-full h-14 sticky top-0 flex" >
        <span class="text-white font-thin text-5xl">{{section.title}}</span>
    </div>
        <div class="character-grid my-2" id="panel-2">
            <CharacterCard 
            v-for="(char, i) in (getShowVocab ? section.vocabulary : section.characters)" 
            :key="i" 
            :character="char"
            :charData="getCharData(char)"
            :showVocab="getShowVocab"
            :color="section.color"
            :sectionId="section.id" />
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

.character-grid {
    display: grid;
    gap: 0.5rem;
    grid-template-columns: repeat(auto-fill, minmax(5rem, 1fr));
}

</style>