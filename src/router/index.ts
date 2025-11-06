import { createRouter, createWebHistory  } from 'vue-router'
import type {RouteRecordRaw} from 'vue-router'
import HomePage from '@/pages/HomePage.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/pages/SearchPage.vue')
  },
  {
    path: '/predict',
    name: 'predict',
    component: () => import('@/pages/PredictPage.vue')
  },
  {
    path: '/add-match',
    name: 'add-match',
    component: () => import('@/pages/AddMatchPage.vue')
  },
  {
    path: '/match/:id',
    name: 'match-details',
    component: () => import('@/pages/MatchDetailsPage.vue')
  },
  {
    // 404 page
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/NotFoundPage.vue')
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})