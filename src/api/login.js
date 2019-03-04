
import { Indicator } from 'mint-ui'
const GetQueryString = (key) => {
  let href = window.location.search.substr(1)
  let obj = {}
  href.split('&').forEach(function (t) {
    let str = t.split('=')
    obj[str[0]] = str[1]
  })
  return obj[key]
}

export const login = (api) => {
  return new Promise((resolve, reject) => {
    const Authorization = localStorage.getItem('Authorization')
    const code = GetQueryString('code')
    if (!Authorization || Authorization === '') {
      if (!code || code === '') {
        var url = window.location.href.split('#')[0]
        url = encodeURIComponent(url)
        // var appid = 'wx105b2bcb881a31db' // 测试
        var appid = 'wx0cef159bed2efa8e' // 正式
        sessionStorage.setItem('url', window.location.href)
        window.location.replace('https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid + '&redirect_uri=' +
          url +
          '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect')
      } else {
        Indicator.open('登录中...')
        api.wxLogin({ code: code }).then(res => {
          if (res.data.code == 200) {
            let { type, userId, token } = res.data.result
            localStorage.setItem(
              'Authorization',
              `${type}_&&_${userId}_&&_${token}`
            )

            Indicator.close()
            resolve(sessionStorage.getItem('url'))
          }
        })
      }
    } else {
      reject('1')
    }
  })
}
