<template>
  <b-navbar class="nav" fixed="top">
    <div class="nav-container">
        <div class="left">
            <b-button class="button" @click="$emit('switchVocabWords')" :disabled="showVocab">Words</b-button>
            <b-button class="button" @click="$emit('switchVocabWords')" :disabled="!showVocab">Vocab</b-button>
        </div>
        <b-navbar-brand class="my-auto order-0 title-container" href="#"><span id="title">重复习</span><p id="subtitle">ChongFuXi</p></b-navbar-brand>
        <div class="right">
            <b-button class="button" v-b-modal.sign-in v-if="!user.loggedIn">Sign in</b-button>
            <b-avatar variant="secondary" v-if="user.loggedIn"></b-avatar>
        </div>
    </div>
      <b-modal id="sign-in" centered title="BootstrapVue">
        <div class="row">
            <div class="google-sign-in"> 
                <a class="btn btn-outline-dark" @click="clickGoogleSignIn" role="button" style="text-transform:none">
                <img width="20px" style="margin-bottom:3px; margin-right:5px" alt="Google sign-in" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png" />
                Login with Google
                </a>
            </div>
        </div>
    </b-modal>
  </b-navbar>
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
.nav {
    background-color: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(5px);
    display: flex;
    justify-content: center;
    align-content: center;
}

.nav-container {
    width: 100%;
    max-width: 1110px;
    display: flex;
    justify-content: space-between;
    align-content: center;

}

.title-container {
    margin: 0;
    width: 100%;
}

.left, .right {
    width: 20%;
    display: flex;
    flex-direction: row;
    align-items: center;
}

.left {
    justify-content:flex-start;
}

.right {
    justify-content: flex-end;
}

.button {
    margin-right: 0.5rem;
}

.switch-label {
    width: 70px;
    height: 40px;
    margin: auto;
    background-color: white;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

#title {
    font-weight: bold;
}

#subtitle {
    font-size: 0.8rem;
    font-weight: 300;
    margin: 0;
}

.google-sign-in {
    width: 200px;
    margin: 0.5rem;
}
</style>