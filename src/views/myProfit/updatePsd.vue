<template>
  <div class="updatePsdBox">
      <div>
        <div class="input-group">
          <h3>老密码</h3>
          <input type="password" maxlength='6' placeholder='请输入老密码' v-model="params.password">
        </div>
        <div class="xiline"></div>
        <div class=" input-group">
          <h3>新密码</h3>
          <input placeholder='密码必须为6位数，且不能连续。' type="password" maxlength='6' v-model="params.newPassword">
        </div>
        <div class="xiline"></div>
        <div class=" input-group">
          <h3>确认新密码</h3>
          <input placeholder='请确认新密码' type="password" maxlength='6' v-model="params.newPassword2">
        </div>
      </div>
      
      <div class="btn">
        <button class="button" @click="savePassword">保存</button>
      </div>
      <p @click="toSetPsd()" class="forget">忘记密码<i class="iconfont">&#xe68d;</i></p>
  </div>
</template>

<script>
  import {MessageBox,Toast} from 'mint-ui'
  import {updatePsds} from 'api/myProfit'

  export default {
    data () {
      return {
        params: {
          password: '',           // 老密码
          newPassword: '',        // 新密码
          newPassword2: ''        // 确认新密码
        }
      }
    },
    methods: {
      savePassword () {
        let {password, newPassword, newPassword2} = this.params
        
        if (password === '' || password.length !== 6) {
          Toast('请输入六位老密码')
          return;
        }
        if (newPassword === '' || newPassword.length !== 6) {
          Toast('请输入六位新密码')
          return;
        }
        if (newPassword !== newPassword2) {
          Toast('新密码和确认密码不一致')
          return ;
        }
        if(isNaN(newPassword)||isNaN(newPassword2)){
          Toast('密码为纯数字')
          return;
        }
        updatePsds(this.params).then(res => {
          const data = res.data
          if(data.code === '200'){
            Toast('修改成功')
            this.$router.go(-1)
          }else{
            Toast(data.message)
          }
        })
      }
      ,
      /**跳转到从新设置密码 */
      toSetPsd(){
        this.$router.push({
          path:'/setPsd',
          query:{source:true}
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .updatePsdBox {
    box-sizing: border-box;
    background-color: #fff;
    height: 100vh;
  }

  .input-group {
    justify-content: space-between;
    align-items: center;
    color: #101010;
    font-size: 32px;
    background: #fff;
    padding: 0 40px;
    h3{
      color:#333;
      font-size: 28px;
      font-weight: bold;
      padding: 30px 0 8px;
    }
    input{
      width:100%;
      font-size: 28px;
      color:#333;
      line-height: 40px;
      padding: 26px 0;
    }
  }
  input::-webkit-input-placeholder{
      font-size:28px;
      color:#c8c8c8;
  }

  .tip {
    color: #888;
    font-size: 26px;
    padding: 0 40px;
    margin-top: 30px;
  }

  .forget {
    display: block;
    color: #666;
    margin-top: 50px;
    padding: 0 40px;
    font-size: 26px;
    text-align: center; 
    i{
      font-size: 26px;
    }
  }

  .btn {
    padding: 40px 40px 0;
  }

  .btn button {
    width: 100%;
    border-radius: 8px;
    color: #fff;
    background-color: #ff0b04;
    font-size: 28px;
    text-align: center;
    padding: 30px 0;
    font-weight: bold;
  }


</style>
