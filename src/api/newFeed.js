import './index'
import axios from 'axios'
import qs from 'qs'
import {login} from "./login"
// api 接口用例
//
// export const requestLogin = params => {
//   return axios.post(`/admin/toLoginNew`, qs.stringify(params)).then(res => res.data)
// } // 登录
// export const getVcode = params => {
//   return axios.get(`/admin/vcode`, {params: params})
// } // 发送验证码
export const api = {
	// 预加载id 
 	getPreId: params =>{
		return axios.put(`/topic/upload/inAdvance`, params)
	},
	// 用户提交数据生成料
	newPoster:params=>{
		return axios.post(`/topic/upload`, params)
	},
	// 更新海报
	updatePoster:params=>{
		return axios.post(`/topic/update`, params)
	},
	// 获取微信配置
	getWxConfig: params =>{
		return axios.get(`/mplogin/jsapi`,{params: params})
	},
	// 获取海报信息
	getPosterInfo:params=>{
		return axios.get(`/topic/posterContent`,{params: params})
	},

	// 登录
	wxLogin:params=>{
		return axios.post(`/mplogin`, params)
	},
	
	// 登录  新人人有料登录
	wxLogin2:params=>{
		return axios.post(`/mplogin/mpLogin2`, params)
	},
	// 上传图片
	upLoadPic:params=>{
		return axios.post(`/topic/uploadPic`, params);
	},

	// 通知粉丝
	notifyFans :params=>{
		return axios.post(`/message`, params);
	},
	// 提交海报类型
	putPosterType :params =>{
		return axios.post(`/topic/posterType`, params);
	},
	isRestrict :params =>{
		return axios.get(`/user/accountStatus`,{params: params})
	}
}

