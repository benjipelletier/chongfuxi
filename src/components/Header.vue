<template>
    <nav id="header" class="bg-gray-800 border-b-2 border-gray-700 fixed w-full z-10">
        <div class="mx-auto px-4">
            <div class="relative flex items-center justify-between h-16">
                <div class="w-1/5 inset-y-0 left-0 flex items-center">
                    <!-- menu button -->
                    <button type="button" class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white md:hidden" aria-controls="movile-menu" aria-expanded="false">
                        <span class="sr-only">Open main menu</span>
                        <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        <svg class="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="flex-1 w-3/5 flex items-center justify-center md:items-stretch">
                    <div class="flex-shrink-0 flex items-center">
                        <span id="title" class="text-4xl text-white">重复习</span>
                    </div>
                </div>
                <!-- Login -->
                <div class="flex w-1/5 justify-end items-center h-14 space-x-4">
                    <button v-if="user.loggedIn" type="button" class="dark:bg-gray-800 flex text-sm rounded-full focus:outline-none ring-2 ring-offset-2 ring-offset-gray-800 ring-gray-200">
                        <img class="h-8 w-8 rounded-full" :src="user.data.photo" alt="">
                    </button>
                    <button v-if="user.loggedIn" @click="clickGoogleSignOut" class="flex justify-center rounded items-center w-16 h-10 text-white bg-indigo-500 hover:bg-opacity-80 focus:outline-none">
                        Logout
                    </button>
                    <button v-if="!user.loggedIn" @click="clickGoogleSignIn" class="flex justify-center rounded items-center w-16 h-10 text-white bg-indigo-500 hover:bg-opacity-80 focus:outline-none">
                        Login
                    </button>
                </div>
            </div>
        </div>
    </nav>
</template>

<script>
import { googleSignIn, googleSignOut } from '@/util/google-signin.js'
// import LoginModal from  '@/components/LoginModal'
import { mapGetters } from 'vuex'

export default {
    name: "Header",
    components: {
        // LoginModal,
    },
    props: [
    ],
    data() {
        return {
            form: {
                email: "",
                password: ""
            }
        }
    },
    computed: {
        ...mapGetters({
            user: 'getUser'
        })
    }, 
    methods: {
        clickGoogleSignIn() { googleSignIn() },
        clickGoogleSignOut() { googleSignOut() },
    }
}
</script>

<style scoped>
#header {
    /* backdrop-filter: blur(20px); */
    
}
#title {
    font-family: 'ZCOOL QingKe HuangYou', cursive;
}

@import url('https://fonts.googleapis.com/css2?family=ZCOOL+QingKe+HuangYou&display=swap');
</style>