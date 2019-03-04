import axios from 'axios'
import { login } from './login'
import { Toast } from 'mint-ui'
import router from '@/router'
axios.defaults.timeout = 5000
// 在request header中添加token信息用于当前用户的校验''USERTOKEN_&&_20180905112425617181770065152318_&&_5dd2ec5ff8ab41b69df5f09ff04fac43'//
axios.interceptors.request.use(config => {
  console.log(config)
  // 添加请求头
  config.headers['Authorization'] = localStorage.getItem('Authorization')
  // config.headers['Authorization'] =  'USERTOKEN_&&_20181116102505419412761759162820_&&_9156b7aee6ea4f06872289df25b65352'
  config.headers['RrylVersion'] = localStorage.getItem('version')
  return config
}, error => {
  return Promise.reject(error)
})

if (process.env.NODE_ENV === 'development') {
  // 研发环境
  axios.defaults.baseURL = 'https://rryl.zixianzi.com/showSomething'
} else {
  // 生产环境
  axios.defaults.baseURL = 'https://rryl.zixianzi.com/showSomething'
}

// 判断后端是否颁发了新的token

const api = {
  wxLogin: params => {
    return axios.post(`/mplogin`, params)
  }
}
axios.interceptors.response.use(res => {
  if (res.data.code == '40001') { // 登录过期
    localStorage.removeItem('Authorization')
    setTimeout(() => {
      login(api).then(url => {
        window.location.replace(url)
      })
    }, 100)
  }

  // 提示更新版本
  if (res.data.code == '10010') {
    router.push({
      path: '/personal'
    })
    sessionStorage.setItem('updateVersion', true)
  } else {
    sessionStorage.removeItem('updateVersion')
  }

  // 维护页开启
  if (res.data.code == '10011') {
    router.replace({
      path: '/personal',
      query: {msg: res.data.message}
    })
    sessionStorage.setItem('servicing', true)
  } else {
    sessionStorage.removeItem('servicing')
  }
  // 被封禁
  if (res.data.code == '50030') {
    router.push({
      path: '/blocked'
    })
  }

  return res
}, error => {
  Toast('网络不太好~')
  return Promise.reject(error)
})
