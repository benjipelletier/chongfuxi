<template>
   <div class="char-container bg-white flex justify-center items-center rounded" :style="dynamicGridColumn" > 
        <span class="font-normal text-6xl" :key="char"> {{character}} </span>
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
        getCardBgColor() { 
            return StyleCalc.cardBgColor(this.sectionId, this.charData?.review_level);
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
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    cursor: pointer; 
    text-align: center;
    /* display: grid;
    gap: 0.5rem;
    grid-template-columns: repeat(auto-fill, minmax(5rem, 1fr)) */
}

.vocabCard {
    /* display: inline-block; */
    /* width: 60px; */

}

</style>