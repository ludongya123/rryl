import './index'
import axios from 'axios'
import qs from 'qs'

export const api = {
    // 添加订阅套餐
    addSub : params =>{
        return axios.post(`/user/addUserSubscribeType`,params);
    },
    // 查询用户设置的订阅个数
    getSubcount : params =>{
        return axios.get(`/user/getUserSubscribeTypeListCount`,{params:params});
    },
    //查询用户设置的订阅类型
    getSubtype: params =>{
        return axios.get(`/user/getUserSubscribeTypeList`,{params: params});
    },
    //查询用户订阅状态
    getSubstatus : params =>{
        return axios.post(`/user/getUserSubscribeStatus`,params)
    },
    //订阅
    userSub: params =>{
        return axios.put(`/user/userSubscribe`,params).then(res => res.data)
    },
    //删除套餐
    deteleSub: params =>{
        return axios.post(`/user/deleteUserSubscribeType`,params)
    },
    //订阅支付
    subPay: params =>{
        return axios.post(`/pay/subscribePay`,params)
    }
}