<template>
    <section class="section">
      <div class="container">
        <div class="character-section rounded" v-for="charSet in zh" :key="charSet.name">
          <CharacterSection v-bind:charSet="charSet"/>
        </div>
      </div>
    </section>
</template>

<script>
import CharacterSection from '@/components/CharacterSection'
import hsk1 from '@/config/hsk1.json'

let hsk1_flat = hsk1.reduce((x, y) => {
  let chars = y.split("");
  return [...x, ...chars];
}, [])

let hsk1_score = hsk1_flat.map(x => { 
  return { 
    char: x, 
    lvl: Math.floor(Math.random() * 5) }
})

export default {
  name: 'Home',
  components: {
    CharacterSection,
  },
  data() {
    return {
      zh: [
        {
          name: "Radicals",
          chars: ["中", "了", "是", "为", "破", "士", "中", "了", "是", "为", "破", "士", "中", "了", "是", "为", "破", "士"]
        },
        {
          name: "HSK 1",
          chars: hsk1_score,
        },
      ]
    }
  }
}
</script>

<style scoped>
.section {
  height: 100%;
  /* padding: 3rem; */
  padding-top: 5rem;
  padding-bottom: 3rem;
}
.character-section {
  margin: 10px 0 10px 0;
  background-color: white;
  padding: 0;
  box-shadow: 0 2px 2px rgb(204 197 185 / 50%);
}
</style>