import {
  createRouter,
  createWebHashHistory,
  RouteRecordRaw
} from 'vue-router'
import DefaultLayout from '../DefaultLayout.vue'
import Login from '@/views/Login.vue'
import store from '@/store'

const validateUnlock = (to, from, next) => {
  if (store.state.isUnlocked) {
    next()
  } else {
    router.replace({name: 'Login'})
  }
}
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Root',
    component: DefaultLayout,
    redirect: {
      name: 'Login'
    },
    children: [
      {
        path: 'login',
        name: 'Login',
        component: Login
      },
      {
        path: 'home',
        name: 'Home',
        beforeEnter: validateUnlock,
        component: () => import('@/views/Home.vue')
      },
      {
        path: 'detail',
        name: 'Detail',
        beforeEnter: validateUnlock,
        component: () => import('@/views/Detail.vue')
      },
      {
        path: '/about',
        name: 'About',
        component: () => import('@/views/About.vue')
      }
    ]
  },
  {
    path: "/:catchAll(.*)",
    component: () => import('@/views/404.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})


export default router
