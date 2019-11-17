// 引入Vue
import Vue from 'vue'

// 引入axios
import axios from 'axios'

// 引入路由模块
import router from '@/router/index.js'

// 引入json-bigint
import JSONBig from 'json-bigint'

// 公共根地址
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'

// 配置请求拦截器
axios.interceptors.request.use(function (config) {
  let userinfo = window.sessionStorage.getItem('userinfo')

  if (userinfo) {
    let token = JSON.parse(userinfo).token
    // 给axios请求头配置token
    config.headers.Authorization = 'Bearer ' + token
  }

  return config
}, function (error) {
  return Promise.reject(error)
})

// 配置响应拦截器
axios.interceptors.response.use(function (response) {
  // 成功请求完毕
  return response
}, function (error) {
  // 判断401出现
  if (error.response.status === 401) {
    // 强制用户登录

    router.push('/login')
  }
  return Promise.reject(error)
})

// 响应原生数据转换器
axios.defaults.transformResponse = [function (data) {
  if (data) {
    return JSONBig.parse(data)
  } else {
    return data
  }
}]

Vue.prototype.$http = axios
