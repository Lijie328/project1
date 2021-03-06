import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login/index.vue'
import Home from '../views/home/index.vue'
import Welcom from '../views/home/welcome/index.vue'
import Article from '../views/article/index.vue'
import Articleadd from '../views/articleadd/index.vue'
import Articleedit from '../views/articleedit/index.vue'
import Account from '../views/account/account.vue'
import Material from '../views/material/index.vue'
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
      { path: '/welcome', name: 'welcome', component: Welcom },
      { path: '/material', name: 'material', component: Material },
      { path: '/article', name: 'article', component: Article },
      { path: '/articleadd', name: 'articleadd', component: Articleadd },
      { path: '/articleedit/:aid', name: 'articleedit', component: Articleedit },
      { path: '/account', name: 'account', component: Account }
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
