<template>
  <b-navbar class="nav-container" fixed="top">
    <b-navbar-brand class="title-container" href="#"><span id="title">重复习</span><p id="subtitle">ChongFuXi</p></b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>


  </b-navbar>
</template>

<script>
export default {
    name: "Header"
}
</script>

<style scoped>
.title-container {
    margin-top: 0;
    margin-bottom: 0;
}
.nav-container {
    background-color: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(5px);
    box-shadow: 0 1px 0 rgb(212, 212, 212);
    display: flex;
    align-items: center;
    justify-content: center;
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