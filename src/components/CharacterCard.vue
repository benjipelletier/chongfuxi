<template>
   <div class="char-container rounded" :style="card_bg_style"> 
        <span class="char" > {{char.char}} </span>
    </div> 
</template>

<script>
export default {
    name: "CharacterCard",
    props: [
        'char',
        'hue'
    ],
    computed: {
        card_bg_style() {
            if (this.char.lvl == 0) return 'background-color: #f0f0f1; color: rgba(0, 0, 0, 0.5); text-shadow: none';
            let hue = this.hue;
            let sat = 100;
            let light = 100 - this.char.lvl * 10;
            return `background-color: hsl(${hue}, ${sat}%, ${light}%)`
        }
    }
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
    box-shadow: 0 0.15rem 0 rgb(184, 184, 184);
    padding: 0;
    cursor: pointer;
}


.char {
}

</style>