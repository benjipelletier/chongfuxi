<template>
  <div id="app" class="dark">
    <Header />
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
    }
  },
  methods: {
    ...mapActions([ 'fetchSections', 'fetchProgress'])
  },
  created() {
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
  font-family:  Roboto, "Helvetica Neue", Avenir, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
