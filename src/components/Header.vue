<template>
    <nav class="dark:bg-gray-700 fixed w-full z-10">
        <div class="mx-auto px-2 md:px-6 lg:px-8">
            <div class="relative flex items-center justify-between h-16">
                <div class="absolute inset-y-0 left-0 flex items-center md:hidden">
                    <!-- menu button -->
                    <button type="button" class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="movile-menu" aria-expanded="false">
                        <span class="sr-only">Open main menu</span>
                        <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        <svg class="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="flex-1 flex items-center justify-center md:items-stretch">
                    <div class="flex-shrink-0 flex items-center">
                        <span id="title" class="text-4xl text-white">重复习</span>
                    </div>
                </div>
                        <div class="ml-3 relative">
                <div>
                    <button type="button" class="dark:bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                    <span class="sr-only">Open user menu</span>
                    <img class="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="">
                    </button>
                </div>

                <!--
                    Dropdown menu, show/hide based on menu state.

                    Entering: "transition ease-out duration-100"
                    From: "transform opacity-0 scale-95"
                    To: "transform opacity-100 scale-100"
                    Leaving: "transition ease-in duration-75"
                    From: "transform opacity-100 scale-100"
                    To: "transform opacity-0 scale-95"
                -->
                <!-- <div class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabindex="-1"> -->
                    <!-- Active: "bg-gray-100", Not Active: "" -->
                    <!-- <a href="#" class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="user-menu-item-0">Your Profile</a>
                    <a href="#" class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="user-menu-item-1">Settings</a>
                    <a href="#" class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="user-menu-item-2">Sign out</a> -->
                <!-- </div> -->
                </div>
            </div>
        </div>
    </nav>
    <!-- <header id="header" class="h-16 fixed top-0 left-0 w-full overflow-hidden z-50 bg-gray-100 shadow-lg">
        sdf
        <div class="w-full h-full flex justify-between items-center max-w-container m-auto px-4">
            <div id="header-left" class="left w-1/5 flex justify-start">
            </div>
            <div id="header-center" class="w-3/5 flex flex-col items-center" href="#">
                <span id="title" class="font-bold text-2xl leading-5 pt-2">重复习</span>
                <p id="subtitle" class="font-light text-m">ChongFuXi</p>
            </div>
            <div id="header-right" class="right w-1/5 flex justify-end">
                <button class="button" v-b-modal.sign-in v-if="!user.loggedIn">Sign in</button>
                <avatar variant="secondary" v-if="user.loggedIn"></avatar>
                <div id="avatar">
                    <img class="inline-block h-10 w-10 rounded-full ring-2 ring-indigo-500" :src="user.data.photo" alt="">
                </div>
            </div>
        </div>
    </header> -->

</template>

<script>
import { googleSignIn } from '@/util/google-signin.js';
import { mapGetters } from 'vuex';

export default {
    name: "Header",
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
        getVocabWords() {
            return this.showVocab ? "Vocab" : "Words"
        },
        ...mapGetters({
            user: 'getUser'
        })
    }, 
    methods: {
        clickGoogleSignIn() { googleSignIn() },
    }
}
</script>

<style scoped>
#header {
    backdrop-filter: blur(15px);
    background-color: rgba(255,255,255,0.3);
}
#title {
    font-family: 'ZCOOL QingKe HuangYou', cursive;
}

@import url('https://fonts.googleapis.com/css2?family=ZCOOL+QingKe+HuangYou&display=swap');
</style>