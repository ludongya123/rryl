
import './index'
import axios from 'axios'
import qs from 'qs'

export const api = {
    // 查询料集市料推荐列表
    getFeed:params =>{
        return axios.get(`/topicMarket/getRecommendTopicList`,{params:params})
    },
    // 查询大神
    getFeedPerson:params =>{
        return axios.get(`/topicMarket/getRecommendUserList`,{params:params})
    },
    // 意见反馈
    getOpinion:params =>{
        return axios.post(`/topicMarket/opinion`,params)
    }
}