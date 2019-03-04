const mutations = {
  GET_USER (state, obj) {             //更新用户信息
    state.userInfo = {...state.userInfo, ...obj}
  }
}

export default mutations
