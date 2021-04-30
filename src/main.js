import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import firebase from "firebase/app";

// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'typeface-roboto/index.css';
// import 'swiper/swiper-bundle.css'
import "firebase/auth";
import './assets/tailwind.css'

Vue.config.productionTip = false

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAQVyDTLZvp6T4l3lAi0ASVS59WjHENC44",
  authDomain: "chongfuxi.firebaseapp.com",
  projectId: "chongfuxi",
  storageBucket: "chongfuxi.appspot.com",
  messagingSenderId: "854305120803",
  appId: "1:854305120803:web:76ddfc87c1c30e106c4796",
  measurementId: "G-4XJVL36RQT"
};

firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged(user => {
  store.dispatch("fetchUser", user);
});

// Vue.use(BootstrapVue)
// Vue.use(BootstrapVueIcons)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
