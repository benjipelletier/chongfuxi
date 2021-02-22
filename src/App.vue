<template>
  <div id="app">
    <Header />
    <router-view/>
  </div>
</template>

<script>
import Header from '@/components/Header'
export default {
  components: {
    Header
  }
}
</script>

<style>
#app {
  font-family:  Roboto, "Helvetica Neue", Avenir, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-weight: 300;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  background-color: #f3f3f3
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.page {
  background-color: hsl(0, 0%, 95%);
  height: 100%;
  min-height: 100%;
  height: auto !important;
}

body {
  background-color: #f3f3f3 !important;
}

</style>
