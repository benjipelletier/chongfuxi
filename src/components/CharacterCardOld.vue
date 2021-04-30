<template>
   <div class="char-container rounded" > 
        <span class="char" :style="getCharTextColor"> {{character}} </span>
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
        // getCardBgColor() { return StyleCalc.cardBgColor(this.sectionId, this.charData?.review_level); },
        // getCharTextColor() { return StyleCalc.charTextColor(this.sectionId, this.charData?.review_level); },
        getVocabClass() {
            return (this.showVocab && this.character.length > 1) ? 'vocabCard' : '';
        }

    },
}
</script>

<style scoped>
.char-container {
    min-width: 40px;
    height: 40px;
    font-size: 20px;
    display: flex;
    padding: 10px;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    font-weight: 400;
    /* text-shadow: 0 0.04rem 0.04rem #333; */
    box-shadow: var(--main-shadow-inset);
    cursor: pointer; 
    /* text-shadow: 0 1px 0 rgba(0, 0, 0, 10%); */
    /* grid-column: span 2; */
    flex-grow: 1;
}

.vocabCard {
    /* display: inline-block; */
    /* width: 60px; */

}

</style>