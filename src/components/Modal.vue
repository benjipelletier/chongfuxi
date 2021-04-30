<template>
    <div class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <!--
            Background overlay, show/hide based on modal state.

            Entering: "ease-out duration-300"
                From: "opacity-0"
                To: "opacity-100"
            Leaving: "ease-in duration-200"
                From: "opacity-100"
                To: "opacity-0"
            -->
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

            <!-- This element is to trick the browser into centering the modal contents. -->
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <!--
            Modal panel, show/hide based on modal state.

            Entering: "ease-out duration-300"
                From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                To: "opacity-100 translate-y-0 sm:scale-100"
            Leaving: "ease-in duration-200"
                From: "opacity-100 translate-y-0 sm:scale-100"
                To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            -->
            <div class="inline-block align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <form id="form" @submit="confirm">
                    <div class="bg-gray-900 px-4 py-2">
                        <div class="my-2">
                            <span class="text-3xl font-light text-gray-500">{{header}}</span>
                        </div>
                        <div class="sm:flex sm:items-start">
                            <input v-model.trim="titleInput" type="text" placeholder="title" class="w-full h-12 rounded bg-gray-800 text-white p-2 outline-none text-3xl font-light focus:ring-2 ring-gray-700">
                        </div>
                        <div class="mt-4">
                            <p v-if="errors.length">
                                <ul>
                                <li v-for="(error, i) in errors" 
                                    :key="i"
                                    class="text-red-500">{{ error }}</li>
                                </ul>
                            </p>
                        </div>
                    </div>
                    <div class="bg-gray-800 px-4 py-4 sm:flex sm:flex-row-reverse">
                        <button type="submit" class="w-full inline-flex justify-center rounded-md shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-gray-50 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-gray-600 sm:ml-3 sm:w-auto sm:text-sm">
                        Confirm
                        </button>
                        <button type="button" @click="close" class="mt-3 w-full inline-flex justify-center rounded-md shadow-sm px-4 py-2 bg-gray-600 text-base font-medium text-gray-300 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-700 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                        Cancel
                        </button>
                        <button v-show="isEditSection" type="button" @click="deleteSection" class="mr-auto mt-3 w-full inline-flex justify-center rounded-md shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-gray-300 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-gray-600 sm:mt-0 sm:w-auto sm:text-sm">
                        Delete
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
// import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Modal',
  components: {
  },
  data() {
    return {
        errors: [],
        titleInput: this.title,
   }
  },
  props: {
      header: {},
      isEditSection: {
          default: false,
      },
      title: {
          default: null
      },
      idx: {
          default: null
      }
  },
  methods: {
      close() {
          this.$emit('close')
          this.errors = []
          this.titleInput = this.title
      },
      confirm(e) {
          e.preventDefault()
          this.errors = []
          if (!this.titleInput) {
              this.errors.push("Title required")
              return
          }
          if (this.isEditSection) {
            this.$emit('confirm', {title: this.titleInput, idx: this.idx})
          } else {
            this.$emit('confirm', this.titleInput)
          }
          this.close()
      },
      deleteSection() {
          this.$emit('delete', this.idx)
          this.close()
      },
  },
  watch: {
      title(val) {
            this.titleInput = val
      }
  }
}
</script>

<style scoped>
</style>
