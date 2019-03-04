<template>
  <div class="stateBox">
    <div class="flex-wrap state-box">
      <div class="left">
        <div class="img-icon">
          <img v-if="stateObj.state==0||stateObj.state==1||stateObj.state==2||stateObj.state==9" :src="txIng" alt="">
          <img v-if="stateObj.state==-1||stateObj.state==-2||stateObj.state==-9" :src="txResult" alt="">
        </div>
        <div class="icon-top icon">
          <i class="iconfont">&#xe691;</i>
        </div>
        <div class="icon-btm icon">
          <i class="iconfont" v-if="stateObj.state==0||stateObj.state==1||stateObj.state==2||stateObj.state==9">&#xe68c;</i>
          <i class="iconfont" v-if="stateObj.state==-1||stateObj.state==-2||stateObj.state==-9">&#xe6ab;</i>
        </div>
      </div>
      <div class="right">
        <div class="content-top">
          <h3 v-if="stateObj.state!=2&&stateObj.state!=9">提现已提交平台，正在审核中</h3>
          <h3 v-if="stateObj.state==9">提现处理中</h3>
          <h3 v-if="stateObj.state==2" class="res-ok">提现已成功</h3>
          <p>金额：{{stateObj.totalAmount / 100}}元</p>
          <p>账号： {{stateObj.bankCardNumber||stateObj.aliAccountNumber}}</p>
        </div>
        <div class="content-btm">
          <h3 v-if="stateObj.state==0||stateObj.state==1">预计24小时内到账，请耐心等待</h3>
          <h3 v-if="stateObj.state==9">请耐心等待</h3>
          <h3 v-if="stateObj.state==-1||stateObj.state==-2" class="res-err">提现失败</h3>
          <h3 v-if="stateObj.state==-9" class="res-err">提现异常</h3>
          <p v-if="stateObj.state==-1||stateObj.state==-2">{{stateObj.description}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        stateObj: null,
        // 提现中
        txIng:require('../../assets/img/transfer_blob_waiting.png'),
        // 提现有结果
        txResult:require('../../assets/img/transfer_blob_failed.png')
      }
    },
    created () {
      this.stateObj = this.$route.query
    }
  }
</script>

<style scoped lang="scss">
  .stateBox {
    padding-top: 16px;
    height:100vh;
    background: #fff;
    box-sizing: border-box;
  }
  .state-box{
    padding: 40px;
    background-color: #fff;
    
    .left{
      position: relative;
      .icon{
        position:absolute;
        color:#fff;
      }
      .icon-top{
        left:20px;
        top:20px;
      }
      .icon-btm{
        top: 250px;
        left:20px;
      }
      img{
        height:304px;
        width:72px;
      }
    }
    .right{
        flex:1;
        margin-left:40px;
        position: relative;
        h3{
          font-size: 30px;
          color:#333;
          font-weight: bold;
          line-height: 42px;
        }
        .res-ok{
          color:#F34434;
        }
        .res-err{
          color:#F88629;
        }
        p{
          color:#666;
          font-size: 28px;
          line-height: 40px;
          margin-top:10px;
        }
        .content-top{
          top:20px;
          position: absolute;
          width:100%;
        }
        .content-btm{
          top:250px;
          position: absolute;
          width:100%;
        }
    }
  }
</style>
