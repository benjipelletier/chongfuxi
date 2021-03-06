<template>
    <section class="page section">
      <div class="container">
        <div class="character-section rounded" v-for="section in getSections" :key="section.title">
          <CharacterSection v-bind:section="section" />
        </div>
      </div>
    </section>
</template>

<script>
import CharacterSection from '@/components/CharacterSection'
import { mapGetters } from 'vuex'

export default {
  name: 'Home',
  components: {
    CharacterSection,
  },
  computed: mapGetters(['getSections']),
}
</script>

<style scoped>
.character-section {
  margin: 10px 0 10px 0;
  background-color: white;
  padding: 0;
  box-shadow: 0 2px 2px rgb(204 197 185 / 50%);
}
</style>