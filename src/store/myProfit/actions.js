import {getUser} from "../../api/myProfit"

const actions = {
  getUserData ({commit}) {        //获取用户信息
    getUser().then(res => {
      const data = res.data
      if (data.code === '200') {
        commit('GET_USER',data.result)
      }
    })
  }
}

export default actions
