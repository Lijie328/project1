import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login/index.vue'
import Home from '../views/home/index.vue'
import Welcom from '../views/home/welcome/index.vue'

Vue.use(VueRouter)

const routes = [
  // { path: '/login', name: 'login', component: () => import('@/views/login/index.vue') }
  { path: '/login', name: 'login', component: Login },
  {
    path: '/home',
    name: 'home',
    component: Home,
    redirect: '/welcome', // 路由重定向
    children: [
      // 欢迎页面子路由配置
      { path: '/welcome', name: 'welcome', component: Welcom }
    ]
  }

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
