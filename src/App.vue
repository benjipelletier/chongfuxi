<template>
  <div id="app">
    <Header :showVocab="showVocab" v-on:switchVocabWords="switchVocabWords" />
    <router-view/>
  </div>
</template>

<script>
import Header from '@/components/Header'
import { mapActions } from 'vuex'

export default {
  components: {
    Header
  }, 
  data() {
    return {
      showVocab: true
    }
  },
  methods: {
    switchVocabWords() {
      this.showVocab = !this.showVocab;
      this.setShowVocab(this.showVocab);
    },
    ...mapActions([ 'fetchSections', 'fetchProgress', 'setShowVocab'])
  },
  created() {
    this.fetchSections();
    this.fetchProgress();
  }
}
</script>

<style>
:root {
  --main-shadow: 0 2px 0 rgba(0, 0, 0, 25%);
  --main-shadow-inset: inset 0 -2px 0 rgba(0, 0, 0, 25%);
  --big-card-shadow-inset: inset 0 -5px 0 rgb(0,0,0,0.2);
}

#app {
  /* font-family:  Roboto, "Helvetica Neue", Avenir, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-weight: 300;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  background-color: #f3f3f3 */
}
</style>
