import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login.vue'
import Home from '@/views/Home/index.vue'
import Default from '@/layout/Default'
import store from '@/store'

const validateUnlock = (to, from, next) => {
  if (store.getters.isUnlocked) {
    next()
  } else {
    router.replace({name: 'Login'})
  }
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Root',
    component: Default,
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
        component: Home
      },
      {
        path: 'detail/:uuid',
        name: 'Detail',
        beforeEnter: validateUnlock,
        component: () => import('@/views/Detail.vue')
      },
      {
        path: 'about',
        name: 'About',
        component: () => import('@/views/About.vue')
      }
    ]
  },
  {
    path: '*',
    component: () => import('@/views/404.vue')
  }
]

const router = new VueRouter({
  mode: 'hash',
  routes
})

export default router
