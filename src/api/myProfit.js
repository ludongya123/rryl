import './index'
import axios from 'axios'
import qs from 'qs'

// api 接口用例
//
// export const requestLogin = params => {
//   return axios.post(`/admin/toLoginNew`, qs.stringify(params)).then(res => res.data)
// } // 登录
// export const getVcode = params => {
//   return axios.get(`/admin/vcode`, {params: params})
// } // 发送验证码

// 提现记录
export const cashRecord = params => {
  return axios.get('/user/cashRecord', {params: params})
}
// 账单明细
export const incomeBalance = params => {
  return axios.get('/user/balance', {params: params})
}
// 获取用户信息
export const getUser = params => {
  return axios.get('/user')
}
// 判断是否设置密码
export const checkPsd = params => {
  return axios.get('/user/hasPwd', {params: params})
}
// 获取短信验证码
export const getCodes = params => {
  return axios.get('/sms', {params: params})
}
// 设置密码
export const setPasswords = params => {
  return axios.post('/user/pwd', params)
}
// 修改密码
export const updatePsds = params => {
  return axios.post('/user/pwd2', params)
}
// 提现
export const drawCashs = params => {
  return axios.post('/user/cash', qs.stringify(params))
}
// 新版提现
export const drawCashNew = params => {
  return axios.post('/user/cash', params)
}
// 获取消息信息
export const getNews = params => {
  return axios.get('/user/message', {params: params})
}

// 获取用户支付宝账号信息
export const getAliInfo = params => {
  return axios.get('/user/cashInfo', {params: params})
}

// 获取粉丝或关注的用户列表
export const getUserList = params => {
  return axios.get('/user/fansList', {params: params})
}
// 获取粉丝或关注的料的列表
export const getWritingList = params => {
  return axios.get('/topic/topicList', {params: params})
}

// 关注、取消关注
export const setFocus = params => {
  return axios.put('/user/subscribe', params)
}

// 维护通知
export const getNotice = params => {
  return axios.get('/config/showMaintenanceInfo', params)
}
// 从料集市进入数据的埋点
export const marketPoint = params => {
  return axios.post('/view', params)
}
