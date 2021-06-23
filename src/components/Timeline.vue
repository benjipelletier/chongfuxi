<template>
    <div class="w-full h-20 bg-gray-800 flex">
        <!-- due -->
        <div class="flex items-center h-full text-white font-bold text-3xl space-x-2 px-2">
            <span>123</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
            </svg>
        </div>
        <div class="w-px bg-gray-400 h-full"></div>
        <!-- future -->
        <div v-for="i in 4" :key="i" class="px-2 text-gray-400 text-xl font-light flex flex-row">
          <!-- time -->
          <div class="h-full relative">
            <div class="w-px bg-current h-full"></div>
              <div class="absolute top-0 w-auto h-auto">
                <div class="relative w-auto h-auto">
                  <div class="absolute -top-1/2 flex flex-row w-auto items-center">
                    <div class="w-4 h-px bg-current"></div>
                    <span class="whitespace-nowrap">12:00</span>
                  </div>
                  <div class="opacity-0 flex flex-row w-auto items-center">
                    <div class="w-4 h-px bg-current"></div>
                    <span class="whitespace-nowrap">12:00</span>
                  </div>
                </div>
            </div>
          </div>
          <!-- block -->
          <div class="h-full py-4 pl-2">
            <div class="w-20 h-full rounded bg-red-600">
            </div>
          </div>
        </div>

    </div>
    
</template>

<script>

export default {
  name: 'Timeline',
  components: {
  },
  data() {
  }
}
</script>

<style scoped>

</style>