import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{
    path: '/',
    name: 'Home',
    component: () => HomeView,
  }, {
    path: '/research',
    name: 'Research',
    component: () => import('../views/ResearchTrack.vue')
  },{
    path: '/city',
    name: 'Place',
    component: () => import('../views/City.vue')
  }, {
    path: '/world',
    name: 'Govern',
    component: () => import('../views/World.vue')
  }]
})

export default router
