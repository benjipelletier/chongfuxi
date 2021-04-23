<template>
   <div class="char-container bg-white flex justify-center items-center rounded" :class="[cardBgStyle, cardStyle]" :style="dynamicGridColumn" > 
        <span class="font-thin text-6xl"> {{character}} </span>
    </div> 
</template>

<script>
import { StyleCalc } from '@/util/helpers.js'

export default {
    name: "CharacterCard",
    props: [
        'character',
        'charData',
        'color',
        'sectionId',
        'showVocab'
    ],
    computed: {
        dynamicGridColumn() {
            return `grid-column: span ${this.character.length > 2 ? 3 : this.character.length};`;
        },
        cardBgStyle() { 
            return StyleCalc.cardBgStyle(this.sectionId, this.charData?.review_level);
        },
        cardStyle() { 
            return StyleCalc.cardStyle(this.sectionId, this.charData?.review_level);
        },
        getCharTextColor() { return StyleCalc.charTextColor(this.sectionId, this.charData?.review_level); },
        getVocabClass() {
            return (this.showVocab && this.character.length > 1) ? 'vocabCard' : '';
        }

    },
}
</script>

<style scoped>
.char-container {
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    cursor: pointer; 
    text-align: center;
    /* background-color: rgba(255,255,255,0.2); */
    /* display: grid;
    gap: 0.5rem;
    grid-template-columns: repeat(auto-fill, minmax(5rem, 1fr)) */
}
.textShadow {
    text-shadow: 0 2px rgba(20,20,20,0.3)
}
.vocabCard {
    /* display: inline-block; */
    /* width: 60px; */

}

</style>