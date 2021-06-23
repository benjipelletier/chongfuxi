<template>
    <div class="pt-20 h-screen bg-gray-900">
        <Timeline />
        <div class="w-20 h-28 m-4">
            <CharacterCard 
            character="+"
            :addCharType="true" />
        </div>
    </div>
</template>

<script>
import Timeline from '@/components/Timeline.vue'
import CharacterCard from '@/components/CharacterCard.vue'

export default {
    name: "Time",
  components: {
      Timeline,
      CharacterCard
  }
}
</script>

<style>

</style>