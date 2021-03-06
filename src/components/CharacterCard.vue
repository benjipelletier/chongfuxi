<template>
   <div 
    class="char-container bg-white flex justify-center items-center rounded relative" 
    :style="dynamicGridColumn"
    :class="[ selectCharStyle, cardBgStyle, cardStyle, cardSizeStyle, {'addCharType': addCharType}]"
    @click="clickHandler"
     > 
        <span class="font-thin"> {{character}} </span>
        <div v-if="getUserProgress.readyHas(character)" class="absolute -top-2 -right-2 text-gray-200">
<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
</svg>
        </div>
    </div> 
</template>

<script>
import { StyleCalc } from '@/util/helpers.js'
import { mapGetters, mapActions } from 'vuex'

export default {
    name: "CharacterCard",
    props: {
        character: null,
        color: null,
        sectionId: null,
        addCharType: {
            type: Boolean,
            default: false
        },
        selected: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        ...mapGetters(['getReviewLevel', 'getSize', 'getEditSectionId', 'getGlobalSelect', 'getUserProgress']),
        dynamicGridColumn() {
            let span = this.character.length
            if (this.getSize.idx == 0) { // small
                if (this.character.length > 2) span = 3
            } else if (this.getSize.idx == 1) { // medium
                if (this.character.length > 3) span = 3
                else if (this.character.length > 1) span = 2
            } else { // large
                if (this.character.length > 2) span = 3
            }
            return `grid-column: span ${span};`;
        },
        reviewLevel() {
            return this.getReviewLevel(this.character)

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
        selectCharStyle() {
            if (!this.addCharType) {
                if (this.getEditSectionId === this.sectionId) {
                    return { 
                        'selectedHover': !this.selected,
                        'selected': this.selected
                    }
                } else if (this.getGlobalSelect.mode) {
                    return { 
                        'selectedHover': !this.getGlobalSelect.vocab.includes(this.character),
                        'selected': this.getGlobalSelect.vocab.includes(this.character)
                    }
                }
            }
            return {}
        }
    },
    methods: {
        ...mapActions(['openAddCharacterModal', 'updateGlobalSelectVocab']),
        clickHandler() {
            if (this.addCharType) {
                this.openAddCharacterModal(this.sectionId)
            } else if (this.getEditSectionId === this.sectionId) {
                this.$emit('select', this.character)
            } else if (this.getGlobalSelect.mode) {
                console.log('hjerre')
                this.updateGlobalSelectVocab(this.character)
            }
        }
    },
}
</script>

<style scoped>
.addCharType { 
    @apply bg-white text-gray-900 hover:opacity-100;
}
.addCharType span {
    font-weight: bold !important;

}
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

:not(.not-reviewed).selectedHover {
    @apply  ring-gray-100 ring-inset hover:ring-2;
}
.not-reviewed.selectedHover {
    @apply ring-offset-gray-900 ring-offset-2 ring-gray-100 ring-inset hover:ring-2 hover:bg-gray-100 hover:text-black;
}

:not(.not-reviewed).selected {
    @apply  ring-gray-100 ring-inset ring-2 !important;
}

.not-reviewed.selected {
    @apply opacity-100 ring-offset-gray-900 ring-inset ring-2 ring-gray-900 bg-white text-black !important
}

</style>