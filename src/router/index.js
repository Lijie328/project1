import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login/index.vue'
import Home from '../views/home/index.vue'

Vue.use(VueRouter)

const routes = [
  // { path: '/login', name: 'login', component: () => import('@/views/login/index.vue') }
  { path: '/login', name: 'login', component: Login },
  { path: '/home', name: 'home', component: Home }
]

const router = new VueRouter({
  routes

})

// 设置全局守卫
router.beforeEach((to, from, next) => {
  var userinfo = window.sessionStorage.getItem('userinfo')
  if (!userinfo && to.path !== '/login') {
    return next('/login')
  }
  next()
})
export default router
