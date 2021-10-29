import Login from '@/views/Login.vue'
import Home from '@/views/Home/index.vue'
import Default from '@/layout/Default.vue'

const validateUnlock = (to, from, next) => {
  // if (store.state.isUnlocked) {
    next()
  // } else {
  //   console.error('router.replace({name: \'Login\'})')
    // router.replace({name: 'Login'})
  // }
}


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



export default routes
