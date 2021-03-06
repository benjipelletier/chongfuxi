<template>
   <div class="char-container rounded" :style="getCardBgColor"> 
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
    ],
    computed: {
        getCardBgColor() { return StyleCalc.cardBgColor(this.color, this.charData?.review_level); },
        getCharTextColor() { return StyleCalc.charTextColor(this.color, this.charData?.review_level); }

    },
}
</script>

<style scoped>
.char-container {
    width: 40px;
    height: 40px;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 400;
    /* text-shadow: 0 0.04rem 0.04rem #333; */
    box-shadow: inset 0 -2px 0 rgba(0, 0, 0, 25%);
    padding: 0;
    cursor: pointer; 
    /* text-shadow: 0 1px 0 rgba(0, 0, 0, 10%); */
}

</style>