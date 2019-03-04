import './index'
import axios from 'axios'
import qs from 'qs'

// api 接口用例
//
// export const getted = params => {
//   return axios.get(`/writing/getted`, qs.stringify(params)).then(res => res.data)
// } // 登录
// export const getVcode = params => {
//   return axios.get(`/admin/vcode`, {params: params})
// } // 发送验证码

export const api = {
    // 我买的料
    getted : params => {
        return axios.get(`/topic/boughtList?${qs.stringify(params)}`).then(res => res.data)
    },
    // 我卖的料
    sellOff : params => {
        return axios.get(`/topic/sellList?${qs.stringify(params)}`).then(res => res.data)
    },
    // 有没有猜中
    moneyGet : params => {
        return axios.put(`/topic/handleMoneyBack`, params).then(res => res.data)
    },
    // 卖家删除料
    del : params => {
        
        return axios.delete(`/topic/delSell`, {data: params}).then(res => res.data)
    },

    // 海报信息
    writingPoster : params => {
        return axios.get(`/topic/posterContent?${qs.stringify(params)}`).then(res => res.data)
    },

   // 提交海报类型
	putPosterType :params =>{
		return axios.post(`/topic/posterType`, params);
	},
    
    // 购买记录
    buyRecord : params => {
        return axios.get(`/topic/buyRecord?${qs.stringify(params)}`).then(res => res.data)
    },
    // 投诉选项
    appealGet : params => {
        return axios.get(`/appeal?${params}`).then(res => res.data)
    },
    // 提交投诉
    appealPut : params => {
        return axios.put(`/appeal`, params).then(res => res.data)
    },
    // 料的详情   单卖的
    writingInfo : params => {
        return axios.get(`/topic/topicInfo?${qs.stringify(params)}`).then(res => res.data)
    },
    // 料的详情  包时段的
    writingInfo2 : params => {
        return axios.get(`/writing/writingInfo`,{params:params}).then(res => res.data)
    },
    
    // 微信sdk配置 微信sdk配置  人人有料主体
    jsapiConfig : params => {
        return axios.get(`/mplogin/jsapi?${qs.stringify(params)}`).then(res => res.data)
    },
    // 微信sdk配置  
    jsapi : params => {
        return axios.get(`/pay/jsapi?${qs.stringify(params)}`).then(res => res.data)
    },
    // 火眼主体微信sdk配置  新人人有料
    jsapiConfig2:params=>{
        return axios.get(`/mplogin/jsapi2`,{params:params})
    },
    // 包时段料的详情列表
    period : params => {
        return axios.get(`/writing/period`, {params: params}).then(res => res.data)
    },
    // ping++支付
    pingPay : params => {
        return axios.post(`/pay/pingPay`,  params)
    },
    // 通知粉丝
	notifyFans :params=>{
		return axios.post(`/message`, params);
    },
    // 登录  新人人有料登录
	wxLogin2:params=>{
		return axios.post(`/mplogin/mpLogin2`, params)
    },
    // 公开、关闭 料
    openFeed:params=>{
        return axios.put(`/topic/isPublic`,params)
    },
    // 支付失败回调
    alignPay:params =>{
        return axios.post('/pay/yijifuPay',params)
    },
    //查询用户设置的订阅类型
    getSubtype: params =>{
        return axios.get(`/user/getUserSubscribeTypeList`,{params: params});
    },
    //订阅支付
    subPay: params =>{
        return axios.post(`/pay/subscribePay`,params)
    }
}
