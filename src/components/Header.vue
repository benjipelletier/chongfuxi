<template>
  <header id="header" class="h-16 fixed top-0 left-0 w-full overflow-hidden z-50 bg-gray-100 shadow-lg">
    <div class="w-full h-full flex justify-between items-center max-w-container m-auto px-4">
        <div id="header-left" class="left w-1/5 flex justify-start">
        </div>
        <div id="header-center" class="w-3/5 flex flex-col items-center" href="#">
            <span id="title" class="font-bold text-2xl leading-5 pt-2">重复习</span>
            <p id="subtitle" class="font-light text-m">ChongFuXi</p>
        </div>
        <div id="header-right" class="right w-1/5 flex justify-end">
            <button class="button" v-b-modal.sign-in v-if="!user.loggedIn">Sign in</button>
            <!-- <avatar variant="secondary" v-if="user.loggedIn"></avatar> -->
            <div id="avatar">
                <img class="inline-block h-10 w-10 rounded-full ring-2 ring-indigo-500" :src="user.data.photo" alt="">
            </div>
        </div>
    </div>
      <!-- <b-modal id="sign-in" centered title="BootstrapVue">
        <div class="row">
            <div class="google-sign-in"> 
                <a class="btn btn-outline-dark" @click="clickGoogleSignIn" role="button" style="text-transform:none">
                <img width="20px" style="margin-bottom:3px; margin-right:5px" alt="Google sign-in" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png" />
                Login with Google
                </a>
            </div>
        </div>
    </b-modal> -->
  </header>
</template>

<script>
import { googleSignIn } from '@/util/google-signin.js';
import { mapGetters } from 'vuex';

export default {
    name: "Header",
    props: [
        'showVocab'
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
</style>