<template>
  <b-navbar class="nav-container " fixed="top">
    <div class="left">
    </div>
    <b-navbar-brand class="my-auto order-0 title-container" href="#"><span id="title">重复习</span><p id="subtitle">ChongFuXi</p></b-navbar-brand>
    <div class="right">
        <b-button @click="$emit('switchVocabWords')">{{getVocabWords}}</b-button>
        </div>
  </b-navbar>
</template>

<script>
export default {
    name: "Header",
    props: [
        'showVocab'
    ],
    computed: {
        getVocabWords() {
            return this.showVocab ? "Vocab" : "Words"
        }
    }
}
</script>

<style scoped>
.title-container {
    width: 100%;
}
.nav-container {
    background-color: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(5px);
    display: flex;
    justify-content: space-between;
    align-content: center;
}

.left, .right {
    width: 20%;
    height: 100%;
}

.right {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.switch-label {
    width: 70px;
    height: 40px;
    margin: auto;
    background-color: white;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

#title {
    font-weight: bold;
}

#subtitle {
    font-size: 0.8rem;
    font-weight: 300;
    margin: 0;
}
</style>