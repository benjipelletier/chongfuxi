import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import firebase from "firebase/app";
import VTooltip from 'v-tooltip'

// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'typeface-roboto/index.css';
// import 'swiper/swiper-bundle.css'
import "firebase/auth";
import "firebase/firestore";
import './assets/tailwind.css'
import VueScrollactive from 'vue-scrollactive';
import Chartkick from 'vue-chartkick'
import Chart from 'chart.js'
import VueVirtualScroller from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import VCalendar from 'v-calendar';



Vue.config.productionTip = false

Vue.use(VTooltip)
Vue.use(VueScrollactive);
Vue.use(Chartkick.use(Chart))
Vue.use(VueVirtualScroller)
Vue.use(VCalendar);


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
  store.dispatch("fetchUser", user).then(() => {
    // post user update fetches
    store.dispatch("fetchSections")
  })
});

// Vue.use(BootstrapVue)
// Vue.use(BootstrapVueIcons)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
