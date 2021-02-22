<template>
<div class="rounded">
    <div class="section-header">
        <div class="header-title">
            <h3 class="title">{{charSet.name}}</h3>
        </div>
        <b-progress class="progress mt-2" :max="max" >
            <b-progress-bar class="progress-part" :style="get_lvl_style(4)" :value="get_lvl_count(4)"></b-progress-bar>
            <b-progress-bar class="progress-part" :style="get_lvl_style(3)" :value="get_lvl_count(3)"></b-progress-bar>
            <b-progress-bar class="progress-part" :style="get_lvl_style(2)" :value="get_lvl_count(2)"></b-progress-bar>
            <b-progress-bar class="progress-part" :style="get_lvl_style(1)" :value="get_lvl_count(1)"></b-progress-bar>
            <b-progress-bar class="progress-part" :style="get_lvl_style(0)" :value="get_lvl_count(0)"></b-progress-bar>
        </b-progress>
    </div>
    <div class="character-grid">
            <CharacterCard class="item" v-for="char in charSet.chars" :key="char" v-bind:char="char"/>
        </div>
</div>
</template>

<script>
import CharacterCard from '@/components/CharacterCard'
export default {
    name: "CharacterSection",
    components: {
        CharacterCard,
    },
    props: [
        'charSet'
    ],
    computed: {
        max() {
            return this.charSet.chars.length;
        },
    },
    methods: {
        get_lvl_count(lvl) {
            return this.charSet.chars.filter(x => x.lvl == lvl).length;
        },
        get_lvl_style(lvl) {
            if (lvl == 0) return 'background-color: white';
            let hue = 45;
            let sat = 100;
            let light = 100 - lvl * 10;
            return `background-color: hsl(${hue}, ${sat}%, ${light}%)`
        }
    }

}
</script>

<style scoped>
.section-header {
    height: 3rem;
}
.header-title {
    position: absolute;
    height: 3rem;
    display: flex;
    padding-left: 0.5rem;
}
.title {
    font-weight: 900;
    margin: auto;
}
.progress {
    /* border: 1px solid #ced4da; */
    height: 100%;
    margin: 0 !important;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    box-shadow: 0 0.1rem 0 rgb(212, 212, 212);
}

.progress-part {
    /* box-shadow: 0.1rem 0 4px rgba(0, 0, 0, 0.2) inset; */
}

.character-grid {
    padding: 0.5rem;
    display: grid;
    gap: 0.5rem 0.5rem;
    grid-template-columns: repeat(auto-fill, minmax(39px, auto));
}

</style>