<template>
   <div 
    class="char-container bg-white flex justify-center items-center rounded " 
    :class="
        [cardBgStyle, cardStyle, cardSizeStyle]
        
        " :style="dynamicGridColumn"
     > 
        <span class="font-thin"> {{character}} </span>
    </div> 
</template>

<script>
import { StyleCalc } from '@/util/helpers.js'
import { mapGetters } from 'vuex'

export default {
    name: "CharacterCard",
    props: [
        'character',
        'reviewLevel',
        'color',
        'sectionId',
    ],
    computed: {
        ...mapGetters(['getSize']),
        dynamicGridColumn() {
            if (this.getSize.idx == 0 || this.getSize.idx == 1) {
                let span = this.character.length
                if (this.character.length > 3) span = 3
                else if (this.character.length > 1) span = 2
                return `grid-column: span ${span};`;
            }
            return `grid-column: span ${this.character.length > 2 ? 3 : this.character.length};`;
        },
        cardBgStyle() { 
            return StyleCalc.cardBgStyle(this.sectionId, this.reviewLevel);
        },
        cardStyle() { 
            return StyleCalc.cardStyle(this.sectionId, this.reviewLevel);
        },
        cardSizeStyle() {
            return {
                'sm-char': this.getSize.idx == 0,
                'md-char': this.getSize.idx == 1,
                'lg-char': this.getSize.idx == 2,
            }
        },
        getCharTextColor() { return StyleCalc.charTextColor(this.sectionId, this.reviewLevel); },
    },
}
</script>

<style scoped>
.not-reviewed.sm-char {
    border: none;
}
.not-reviewed.md-char {
    border-width: 2px;
}
.sm-char {
    @apply text-xl;
    height: 2rem;
}

.md-char {
    @apply text-3xl;
    height: 4rem;
}


.lg-char {
    @apply text-6xl;
    height: 100px;
}
.char-container {
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
.sm-char.textShadow {
    text-shadow: 0 1px rgba(20,20,20,0.3)
}
.md-char.textShadow {
    text-shadow: 0 2px rgba(20,20,20,0.3)
}
.lg-char.textShadow {
    text-shadow: 0 2px rgba(20,20,20,0.3)
}
.vocabCard {
    

}

</style>