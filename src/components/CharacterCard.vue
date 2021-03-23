<template>
   <div class="char-container rounded" :class="getVocabClass" :style="getCardBgColor"> 
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
        'showVocab'
    ],
    computed: {
        getCardBgColor() { return StyleCalc.cardBgColor(this.color, this.charData?.review_level); },
        getCharTextColor() { return StyleCalc.charTextColor(this.color, this.charData?.review_level); },
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
    box-shadow: var(--main-shadow-inset);
    cursor: pointer; 
    flex-grow: 1;
}

.vocabCard {
    

}

</style>