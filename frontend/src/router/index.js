import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login.vue'
import Default from "@/layout/Default"

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
      }
    ]
  },
  {
    path: '/about',
    component: () => import('@/views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
