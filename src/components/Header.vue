<template>
  <header id="header" class="h-18 fixed top-0 left-0 w-full overflow-hidden z-50 bg-white">
    <div class="w-full h-full flex justify-between items-center max-w-container m-auto px-4">
        <div id="header-left" class="left">
            <button class="button" @click="$emit('switchVocabWords')" :disabled="showVocab">Words</button>
            <button class="button" @click="$emit('switchVocabWords')" :disabled="!showVocab">Vocab</button>
        </div>
        <div id="header-center" class="" href="#">
            <span id="title">重复习</span>
            <p id="subtitle">ChongFuXi</p>
        </div>
        <div id="header-right" class="right">
            <button class="button" v-b-modal.sign-in v-if="!user.loggedIn">Sign in</button>
            <!-- <avatar variant="secondary" v-if="user.loggedIn"></avatar> -->
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