<template>
  <div class="setPsdWrapper">
    <div class="form">
        <div class="input-wrap psd">
          <h3 class="title">新密码</h3>
          <input placeholder='请输入密码,密码为6位纯数字。' maxlength='6' type="password" v-model="fromData.password">
        </div>
        <div class="xiline"></div>
        <div class="input-wrap">
          <h3 class="title">确定密码</h3>
          <input type="password" placeholder='请确认密码' maxlength='6' v-model="fromData.password2">
        </div>
        <div class="xiline"></div>
        <p class="tip">验证身份</p>
        <div class="input-wrap">
          <h3 class="title">手机号码</h3>
          <input type="number" maxlength='11' placeholder='输入手机号码' v-model="fromData.phone">
        </div>
        <div class="xiline"></div>
        <div class="input-wrap" >
          <h3 class="title">验证码</h3>
          <div class="flex-wrap">
            <input type="number" placeholder='输入验证码' v-model="fromData.code">
            <button class="get-code" @click="isGetCode?getCode():''">{{isGetCode ? '获取验证码' : time + 's重新获取'}}</button>
          </div>
        </div>
        
        <div class="notice"></div>
        <div class="set-psd">
          <button class="button" @click="savePassword">保存</button>
        </div>
    </div>
  </div>
</template>

<script>
  import {MessageBox, Toast,Indicator} from 'mint-ui'
  import {getCodes, setPasswords} from 'api/myProfit'

  let telreg = /^[1][3,4,5,7,8][0-9]{9}$/;

  export default {
    data () {
      return {
        time: 60,
        timer: null,
        isGetCode: true,
        fromData: {
          phone: '',
          code: '',
          password: '',
          password2: ''
        },
        money:0
      }
    },
    watch: {
      time:function (value) {
        if(value <= 0){
          clearInterval(this.timer)
          this.isGetCode = true
          this.time = 60
        }
      }
    },
    mounted(){
      this.money = this.$route.query.money
    },
    methods: {
      countTime() {
        const _this = this
        this.isGetCode = false
        this.timer = setInterval( ()=> {
          _this.time--
        }, 1000)
      },
      getCode () {      // 获取验证码
        const {phone, code} = this.fromData
        if (!telreg.test(phone)) {
          Toast('手机号格式不正确')
          return false
        }
        this.countTime()           // 验证码重置倒计时
        getCodes({phone:phone}).then(res => {
          if(Number(res.data.code) === 200){
            Toast('发送成功，注意查收')
          }else {
            Toast(res.data.message)
          }
        })
      },
      
      savePassword () {   // 提交密码
         const {phone, code, password, password2} = this.fromData
         if (password === '' || password.length !== 6) {
          Toast('请输入六位密码')
          return
        }
        if (password !== password2) {
          Toast('两次输入密码不相同')
          return false
        }
        if(isNaN(password)||isNaN(password2)){
          Toast('密码为纯数字')
          return;
        }
        if (!telreg.test(phone)) {
          Toast('手机号码格式不正确')
          return
        }
        if (code === '') {
          Toast('请输入验证码')
          return
        }
        Indicator.open('提交中...')
        setPasswords(this.fromData).then(res => {       //提交设置新密码
          const data = res.data;
          Indicator.close();
          if(Number(data.code) === 200 && data.result === 'SUCCESS'){
            Toast('保存成功');

            if(this.$route.query.source){
              this.$router.replace('/personal')
            }else {
              this.$router.replace({
                path: '/drawCash',
                query:{money:this.money}
              })
            }
          }else{
            Toast(res.data.message)
          }
        })
      }
    },
    destroyed(){
      // 组件卸载，清除定时器
      clearInterval(this.timer)
    }
  }
</script>

<style scoped lang="scss">
  input {
    outline: none;
  }

  
  .input-wrap {
    color: #101010;
    font-size: 32px;
    justify-content: space-between;
    padding: 0 40px;
    background-color: #fff;
    align-items: center;
    .title{
      color:#333;
      font-size: 28px;
      font-weight: bold;
      padding: 30px 0 8px;
    }
    input{
      color:#333;
      font-size: 28px;
      line-height: 40px;
      padding: 30px 0;
      width:100%;
    }
    .flex-wrap{
      justify-content: space-between;
      align-items: center;
      input{
        flex:1;
      }
      button{
        height:72px;
        padding: 0 ;
        background: #fff;
        border:1px  solid rgba(51,51,51,0.12);
        padding: 0 36px;
        color:#666;
        font-size: 26px;
        border-radius: 8px;
      }
    }
  }
  input::-webkit-input-placeholder{
		font-size:28px;
    color:#c8c8c8;
  }
  
  .tip{
    font-size: 24px;
    color:#999;
    padding:40px 40px 10px;
    background-color: #fff;
  }

  .get-code.dis {
    color: #aaa;
  }

  .flex-wrap.psd {
    margin-top: 20px;
  }

  .notice {
    padding: 20px 40px;
    color: #aaa;
    font-size: 26px;
  }

  .set-psd {
    padding: 40px;
  }

  .set-psd .button {
    width: 100%;
    border-radius: 8;
    color: #fff;
    background-color: #ff0b04;
    font-size: 28px;
    text-align: center;
    height:96px;
    font-weight: bold;
    border-radius: 8px;
  }

</style>
