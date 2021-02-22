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
    ],
    computed: {
        card_bg_style() {
            if (this.char.lvl == 0) return 'background-color: #f0f0f1';
            let hue = 45;
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
    font-weight: 300;
    text-shadow: 0 0.04rem 0.04rem #333;
    box-shadow: 0 0.15rem 0 rgb(212, 212, 212);
    padding: 0;
}


.char {
}

</style>