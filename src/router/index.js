import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import Time from '@/views/Time.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/time',
    name: 'Time',
    component: Time
  },
  {
    path: '/review',
    name: 'Review',
    component: () => import(/* webpackChunkName: "about" */ '../views/Review.vue')

  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
