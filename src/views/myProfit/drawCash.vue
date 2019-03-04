<template>
    <div class="wrapper">
        <!-- 提现手续费通知 -->
        <div class="notice" @click="inportShow=true">
          <div class="content flex-wrap">
            <div class="left">
              <h3 class="title">
                <i class="iconfont">&#xe6a5;</i>
                <span>提现费率调整</span>
              </h3>
              <p class="desc">普通用户5%，金牌卖家3%，申请金牌卖家请添加客服微信</p>
            </div>
            <div class="right">
              <button>联系客服</button>
            </div>
          </div>
        </div>
        <!-- 客服二维码弹层 -->
        <div class="qr-code-modal" v-show="inportShow">
            <div class="content">
                <h2>联系客服</h2>
                <p>申请金牌卖家，请添加客服微信咨询</p>
                <div class="img">
                    <img :src="require('../../assets/img/kf.jpg')" alt="">
                </div>
                <div class="btn" @click="inportShow=false"><button>确定</button></div>
            </div>
        </div>
        <div class="item">
            <h3 class="title">提现方式</h3>
            <div class="flex-wrap cash-type"  @click="isShowCashChooseType=true">
                <template v-for="(item,index) in cashTypeArr" v-key="index" >
                    <div class="left" v-if="item.type==currCashType"  >
                        <i class="iconfont" :style="{color:item.iconColor}" v-html="item.iconText"></i> 
                        <span>{{item.name}}</span> 
                    </div>
                </template>
                <div class="right"><i class="iconfont">&#xe68b;</i></div>
            </div>
        </div>
        <div v-show="currCashType==2">
            <div class="item">
                <h3 class="title">支付宝账号</h3>
                <input type="text" placeholder="请输入支付宝账号" v-model="aliAmount">
            </div>
            <p class="xiline"></p>
        </div>

        <div v-show="currCashType==2||currCashType==3">
            <div class="item">
                <h3 class="title">{{currCashType==2?'真实姓名':'银行卡户名'}}</h3>
                <input type="text" v-show="currCashType==2" placeholder="请输入你的真实姓名" v-model="realname">
                <input type="text" v-show="currCashType==3" placeholder="请输入你的银行卡户名" v-model="bankUserName">
            </div>
            <p class="xiline"></p>
        </div>
        <!-- <div v-show="currCashType==3">
            <div class="item">
                <h3 class="title">身份证号</h3>
                <input type="text" placeholder="请输入你的身份证号" maxlength='18' v-model="idNumber">
            </div>
            <p class="xiline"></p>
        </div>
        <div v-show="currCashType==3">
            <div class="item">
                <h3 class="title">银行卡号</h3>
                <input type="number" placeholder="请输入你的银行卡号" maxlength='19' v-model="bankAmount">
            </div>
            <p class="xiline"></p>
        </div>

        <div v-show="currCashType==3">
            <div class="item">
                <h3 class="title">银行</h3>
                
                <div class="flex-wrap">
                    <input class="placeholder" placeholder="请输入银行名称" v-model="bankName" >
                </div>
            </div>
            <p class="xiline"></p>
        </div> -->
        <div class="item">
            <h3 class="title">提现金额 <span class="real-cash" v-show="reallyCash&&reallyCash>0">实际到账：{{reallyCash}}元</span></h3>
            <div class="flex-wrap cash-money">
                <i class="iconfont">&#xe6a6;</i>
                <input type="number" :placeholder="`可提取金额 ${money} 元`" v-model="inputMoney" @input="checkMoney">
                <mt-button type="default" size="small" @click="money==inputMoney?cancelAllMoney():choossAllMoney()">{{money==inputMoney?'取消':'全部'}}</mt-button>
            </div>
        </div>
        <p class="xiline"></p>
        <p class="tip"> 24小时到账，由于各银行处理时间不同，以实际到账时间为准。
        </p>
        <p class="xiline"></p>
        <div class="btn">
            <mt-button size="large" v-if="!cashBtnActive" disabled class="default">立即提现</mt-button>
            <mt-button type="danger" v-if="cashBtnActive" class="active" size="large" @click.native="cashBtnActive?keyBordAnimate():''">立即提现</mt-button>
        </div>



        <!-- 遮罩层 -->
        <div class="shade" v-show="isShowCashChooseType"  @click="hideModal(1)"></div>
        <div class="shade" v-show="isShowPsdInput"  @click="hideModal(2)"></div>


        <!-- 提现方式 -->
        <div class="cash-type-container" :class="isShowCashChooseType?'':'hide'">
            <template v-for="(item,index) in cashTypeArr" v-key="index">
                <p class="cash-type-item flex-wrap"   @click="chooseCashType(item.type)">
                    <i class="iconfont" :style="{color:item.iconColor}" v-html="item.iconText"></i> 
                    <span >{{item.name}}</span>
                </p>
                <p class="xiline"  ></p>
            </template>
            <p class="cancel" @click="isShowCashChooseType=false">取消</p>
        </div>



        <!-- 密码输入 -->
      <div class="psd-com"  >
        <h5>输入提现密码</h5>
        <div class="input flex-wrap" >
          <span :class="psdShow.length==0?'active':''">{{psdShow[0]}}</span>
          <span :class="psdShow.length==1?'active':''">{{psdShow[1]}}</span>
          <span :class="psdShow.length==2?'active':''">{{psdShow[2]}}</span>
          <span :class="psdShow.length==3?'active':''">{{psdShow[3]}}</span>
          <span :class="psdShow.length==4?'active':''">{{psdShow[4]}}</span>
          <span :class="psdShow.length==5?'active':''">{{psdShow[5]}}</span>
        </div>
        <div class="btns">
          <button class="cancle" @click="hidePsdArea()">取消</button>
          <button class="ok" @click="checkPsd()">确定</button>
        </div>
      </div>

      <!-- 模拟键盘 -->
      <div class="keybord" >
        <h3><i class="iconfont">&#xe6d4;</i>&nbsp;&nbsp;安全键盘</h3>
        <div class="keys flex-wrap">
          <template v-for="(item,index) in inputKeys">
            <a @click="clickKey(item)" ontouchstart="" onmouseover="" :key="index" :disabled="item===''" :class="(index==9||index==10)?'btm':''">{{item}}</a>
          </template>
          <a @click="delKey()" class="btm del-icon" ontouchstart="" onmouseover="" ><i class="iconfont">&#xe6d5;</i></a>
        </div>
      </div>

      <!-- 提现记录 -->
      <div class="tx-record">
        <router-link class="seeRecord" to="/record">查看提现记录></router-link>
      </div>
    </div>
</template>
<script>
import { Toast,Indicator } from "mint-ui";
import {drawCashNew,getAliInfo} from '@/api/myProfit.js' ;
var BIN = require("@/api/checkBank.js");
var idNumberReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; 
//
export default {
  data() {
    return {
      // 客服二维码
      inportShow:false,
      // 可提现金额
      money: '',
      // 实际到账
      reallyCash:'0',
      // 阿里账号
      aliAmount: "",
      // 支付宝真实姓名
      realname: "",
      // 银行卡户名
      bankUserName:'',
      // 身份证号
      idNumber:'',
      // 银行账号
      bankAmount: "",
      //  银行卡归属
      bankName: "",
      //   提现金额
      inputMoney: "",
      // 提现费率   默认5   金牌3
      cashRate:5,
      // 提现类型
      cashTypeArr: [
        // { type: 1, name: "微信", iconColor: "#50B674", iconText: "&#xe6ce;" },
        { type: 2, name: "支付宝", iconColor: "#4292ED", iconText: "&#xe6cc;" },
        // { type: 3, name: "银行卡", iconColor: "#004787", iconText: "&#xe6d0;" }
      ],
      // 当前提现方式  1:微信   2:支付宝  3:银行卡
      currCashType: 2,
      // 提现按钮是否激活
      cashBtnActive: false,
      // 是否显示选择提现类型的区域
      isShowCashChooseType: false,
      // 输入键
      inputKeys:[1,2,3,4,5,6,7,8,9,'',0],
        // 真实的密码
      psd:[],
      // 现实的密码
      psdShow:[],
      // 是否显示密码输入组件
      isShowPsdInput:false,
      // 确定密码是否可点击、
      isAllowOK:true
    };
  },
  watch: {
    // 金额输入
    inputMoney(val) {
      if (this.currCashType == 1) {
          this.cashBtnActive = this.inputMoney != "" && this.inputMoney > 0 ? true : false;
      }
      if (this.currCashType == 2) {
            this.checkDrawCash(2)
      }
      if (this.currCashType == 3) {
            this.checkDrawCash(3)
      }

      if(this.inputMoney!=''){
        let reallyCash = ((this.inputMoney*100 - this.inputMoney*this.cashRate) / 100).toFixed(3);
        this.reallyCash = reallyCash.substring(0,reallyCash.length-1);
      }else{
        this.reallyCash = 0;
      }
    },
    // 阿里支付宝账号
    aliAmount(val) {
      if (this.currCashType == 2) {
        this.checkDrawCash(2)
      }
    },
    // 真实姓名
    realname(val) {
      if (this.currCashType == 2) {
            this.checkDrawCash(2)
      }
    },
    // 银行卡户名
    bankUserName(){
       if (this.currCashType == 3) {
            this.checkDrawCash(3)
      }
    },
    // 银行卡账号
    bankAmount(val) {
      if (this.currCashType == 3) {
        this.checkDrawCash(3)
      }
      if (val && val.length >= 16 ) {
        BIN.getBankBin(val)
          .then( (data) =>{
              this.bankName = data.bankName;
          })
          .catch( (err) =>{
               this.bankName = '';
          });
      }
    },
    // 银行卡名称
    bankName(val) {
      if (this.currCashType == 3) {
        this.checkDrawCash(3)
      }
    },
    // 银行卡号
    idNumber(){
      if (this.currCashType == 3) {
        this.checkDrawCash(3)
      }
    }
  },

  created(){
      this.money = this.$route.query.money
      this.getUserInfo()
  },
  methods: {
    // check提现状态
    checkDrawCash(t){
      if(t==2){
        this.cashBtnActive =
          this.aliAmount != "" &&
          this.realname != "" &&
          this.inputMoney > 0
            ? true
            : false;
            
      }
      if(t==3){
        this.cashBtnActive =
          this.bankName != "" &&
          this.inputMoney > 0 &&
          this.bankUserName != "" &&
          this.bankAmount != "" && 
          idNumberReg.test(this.idNumber)            
          ? true
            : false;
      }
    },
    // 点击背景模态框
    hideModal(t){  
      if(t==1){
        this.isShowCashChooseType = false;
      }else{
        this.hidePsdArea();
      }
    },
     // 键盘动画
      keyBordAnimate(){
        this.$animate({
          targets: '.keybord',
          translateY: -(303*window.innerWidth/375),
          elasticity: 5,
          duration: 800,
          delay: 100,
        });
        this.$animate({
          targets: '.psd-com',
          scale: ['0', '1'],
          elasticity: 10,
          duration: 800,
          delay: 100,
          opacity: ['0', '1'],
        })
        this.isShowPsdInput = true;
      },
      // 隐藏动画
      hidePsdArea(){
        this.$animate({
          targets: '.keybord',
          translateY: (303*window.innerWidth/375),
          elasticity: 10,
          duration: 800,
          delay: 0,
        });
        this.$animate({
          targets: '.psd-com',
          duration: 600,
          delay: 0,
          opacity: ['1', '0'],
          scale: [{ value: [1, 0], delay: 600 }]
        })
        this.isShowPsdInput = false;
      },

    // 获取支付宝账号
      getUserInfo(){
        Indicator.open();
        getAliInfo().then(res=>{
          Indicator.close();
          if(res.data.code==200){
            let {aliAccountNumber,aliUserName,bankCardNumber,cardUserName,idNumber,poundage} = res.data.result ;
                this.aliAmount =  aliAccountNumber|| '' ;
                this.realname =  aliUserName ||'';
                this.idNumber = idNumber ||'';
                this.bankUserName = cardUserName ||'';
                this.bankAmount = bankCardNumber || '';
                this.cashRate = poundage;
          }
        }).catch(err=>{
          Indicator.close();
        })
      },

    //  选择提现方式
    chooseCashType(type) {
      this.isShowCashChooseType = false;

      if (this.currCashType == type) return;
      this.currCashType = type;

      if(this.currCashType==1){
        // 微信
        this.cashBtnActive = this.inputMoney >= 30 ? true : false;
      }
      if(this.currCashType==2){
        // 支付宝
          this.checkDrawCash(2)
      }
      if(this.currCashType==3){
        // 银行卡
          this.checkDrawCash(3)
      }
      
    },
    // 检查输入的金额是否合法
    checkMoney(e) {
      let val = e.target.value;
   
      if (val == "") {
        e.target.value = "";
      } else {
        if (val.indexOf(".") >= 0) {
          if (val.split(".")[1].length > 2) {
            this.inputMoney = `${val.split(".")[0]}.${val.split(".")[1].substring(0, 2)}`;
          }
          if (val >= 1) {
            if (val[0] == "0" && val != "0") {
              this.inputMoney = val.substring(1, val.length);
            }
          }
        } else {
          if (val[0] == "0" && val != "0") {
            this.inputMoney = val.substring(1, val.length);
          }
        }
        if (parseFloat(val) > parseFloat(this.money)) {
          Toast(`最多可提现${this.money}元`);
          this.inputMoney = this.money;
        }
      }
    },
    // 全部金额
    choossAllMoney() {
      this.inputMoney = this.money;
    },
    // 取消全部
    cancelAllMoney() {
      this.inputMoney = "";
    },

    // 密码输入
    clickKey(item){
      if(this.psd.length==6 )return;
      this.isKeyClick = false;
      this.psd.push(item);
      this.psdShow.push('·');
    },
    // 删除输入的密码
    delKey(){
      this.psdShow.shift()
      this.psd.shift()
    },
    // 提现密码校验 并提交数据
    checkPsd(){
      if(!this.isAllowOK)return;
      this.isAllowOK = false
      Indicator.open();
        drawCashNew({
          type:this.currCashType,
          totalAmount:this.inputMoney,
          password:this.psd.join(''),
          userName:this.currCashType==2?this.realname:this.currCashType==3?this.bankUserName:null,
          aliAccountNumber:this.aliAmount,
          idNumber:this.idNumber,
          bankCardNumber:this.bankAmount, 
        }).then((res)=>{
          Indicator.close();
          this.isAllowOK = true;
          if(res.data.code==200){
            this.hidePsdArea();
            this.$router.replace({
              path: '/result',
              query: {state: 0,aliAccountNumber: this.currCashType==1?'微信零钱':this.currCashType==2?this.aliAmount:this.bankAmount,totalAmount: this.inputMoney*100}
            })
          }else{
            this.psd = [];
            this.psdShow = [];
            Toast(res.data.message)
          }
        })
    }
  }
};
</script>


<style lang="scss" scoped>


.wrapper {
  background: #fff;
  padding-bottom: 50px;
}

// 提现通知
.notice{
  padding: 20px;
  .content{
    padding:30px;
    border-radius:8px;
    background-color:#F6F0DB;
    border: 1px solid #E7E2D2;
    align-items:center;
    .left{
      flex:1;
      .title{
        color:#E8914E ;
        i{
          font-size:30px; 
        }
        span{
          font-size:26px;
          font-weight:bold;
          line-height:36px;
          margin-left:6px;
        }
      }
      .desc{
        @include fontStyle(40px,26px,#E8914E );
        margin-top:10px;
      }
      margin-right:20px;
    }
    .right{
      button{
        padding: 0 20px;
        height:56px;
        color:#fff;
        font-size:24px;
        background-color:#E8914E ;
        border-radius:6px;
      }
    }
  }
}
// 二维码
.qr-code-modal{
        top:0;
        position: fixed;
        width:100%;
        height:100vh;
        z-index:500;
        background-color: rgba(0,0,0,0.6);
        .content{
            background: #fff;
            border-radius: 8px;
            padding: 48px;
            text-align: center;
            width:550px;
            left:50px;
            top:100px;
            position: absolute;
            h2{
                color:#333;
                font-weight: bold;
                font-size: 30px;
                line-height: 42px;
            }
            p{
                line-height: 50px;
                font-size: 28px;
                color:#666;
                margin: 16px 0 0;
            }
            img{
                width:100%;
            }
            .btn{
                margin-top:20px;
                text-align: right;
                button{
                    width:144px;
                    height:72px;
                    color:#fff;
                    font-size: 28px;
                    background-color: #F34434 ;
                    border-radius: 8px;
                }
            }
        }
    }
.item {
  padding: 0 40px;
  .title {
    @include fontStyle(40px, 28px, #333);
    padding: 30px 0 8px;
    font-weight: bold;
    .real-cash{
      @include fontStyle(36px, 26px, $font-red);
      font-weight: normal;
      padding-left:8px;
    }
  }
  input {
    @include fontStyle(40px, 28px, #333);
    padding: 25px 0;
    width: 100%;
  }
  .flex-wrap {
    justify-content: space-between;
    align-items: center;
  }
  .cash-type {
    padding: 30px;
    border: 1px solid rgba(244, 244, 248, 1);
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.02);
    margin: 20px 0;
    border-radius: 8px;
    .left {
      @include fontStyle(40px, 28px, #333);
      i {
        font-size: 36px;
        vertical-align: middle;
        margin-right: 10px;
      }
    }
    .right {
      i {
        font-size: 32px;
        color: #999;
      }
    }
  }
 
  .cash-money {
    input {
      flex: 1;
      font-size: 40px;
      color: $font-red;
      // font-weight: bold;
      font-family: "Hind-Medium";
      margin-left: 20px;
    }
    input::-webkit-input-placeholder {
      font-size: 40px;
      font-weight: normal;
    }
    i {
      font-size: 32px;
      color: #333;
    }
    .mint-button {
      font-size: 28px;
      background: #fff;
      color: #666;
      border-radius: 8px;
    }
  }
}
.tip {
  @include fontStyle(36px, 24px, #999);
  padding: 25px 40px;
}
// 提现按钮
.btn {
  padding: 20px;
  .mint-button {
    font-size: 28px;
    color: #fff;
    border-radius: 8px;
    font-weight: bold;
    height: 96px;
    &.default {
      background: #d6d6d6;
    }
    &.active {
      background-color: #f34434;
    }
  }
}
// 遮罩
.shade {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 100;
}

// 提现选项
.cash-type-container {
  &.hide {
    bottom: -500px;
  }
  transition: all 0.12s ease;
  position: fixed;
  bottom: 0;
  width: 100%;
  left: 0;
  z-index: 200;
  background-color: #d6d6d6;

  .cash-type-item {
    justify-content: center;
    align-items: center;
    padding: 30px 0;
    background-color: #fff;
    span {
      flex: 1;
      @include fontStyle(40px, 28px, #666);
    }
    i {
      flex: 1;
      text-align: right;
      padding-right: 20px;
      font-size: 36px;
    }
  }
  .cancel {
    text-align: center;
    padding: 30px 0;
    background-color: #fff;
    margin-top: 20px;
    @include fontStyle(40px, 28px, #999);
  }
}

 // 输入密码区域
  .psd-com{
    width:630px;
    position: fixed;
    top:100px;
    background: #fff;
    z-index:101;
    left:60px;
    box-sizing: border-box;
    padding : 50px 0 32px ;
    border-radius: 8px;
    opacity: 0;
    transform: scale(0);
    h5{
      @include fontStyle(40px ,30px,#333);
      text-align:left;
      font-weight:bold;
      padding: 0 50px;
    }
    .input{
      padding:16px 50px ;
      justify-content: space-between;
      span{
        width:72px;
        height:88px;
        border-bottom:2px solid rgba(0,0,0,0.1);
        line-height:100px;
        text-align:center;
        font-size:100px;
        background:#fff;
        color:#333;
        &.active{
          border-bottom: 6px solid  #333;
        }
      }
    }
    .btns{
      text-align:right;
      margin-top:40px;
      padding: 0 32px;
      button{
        width:144px;
        height:72px;
        display: inline-block;
        border-radius:8px;
        font-size:28px;
        margin-left:24px;
        font-family:'Hind-Regular';
        &.cancle{
          border:1px solid rgba(51,51,51,0.12);
          background:#fff;
        }
        &.ok{
          border:1px solid $font-red;
          background:$font-red;
          color:#fff;
        }
      }
    }
  }
  // 键盘区域
  .keybord{
    position: fixed;
    bottom:0;
    width:100%;
    background:#333;
    z-index:101;
    color:#fff;
    text-align:center;
    bottom:-606px;
    -webkit-backface-visibility: hidden;   
    -moz-backface-visibility: hidden;   
    -ms-backface-visibility: hidden;  
    backface-visibility: hidden;   
    -webkit-perspective: 1000;   
    -moz-perspective: 1000;  
    -ms-perspective: 1000;   
    perspective: 1000;   /* Other transform properties here */
    // transition:all 0.15s ease;
    // &.hide{
    //   bottom:-600px;
    // }
    h3{
      font-size:32px;
      box-shadow: 0 2px 0 0 rgba(0,0,0,0.06);
      padding: 30px 0;
      i{
        font-size:36px;
        vertical-align:middle;
      }
    }
    .keys{
      a{
        width:calc(100% / 3);
        background:transparent;
        height:120px;
        font-size:56px;
        line-height:120px;
        color:#fff;
        -webkit-user-select: none;
        user-select: none;
        box-sizing:border-box;
        box-shadow:2px 2px 0 0 rgba(0,0,0,0.06);
        &.btm{
          height:150px;
          // padding-bottom:30px;
          line-height:120px;
          i{
            line-height:120px;
            font-size:48px;
          }
        }
        // box-shadow:0 2px 0 0 rgba(0,0,0,0.06);
        &:active{
          color:#999;
          background:#222;
        }
      }
    }
  }

  /* 查看提现记录 */
  .tx-record {
    font-size: 28px;
    color: #ff0b04;
    margin-top: 50px;
    padding: 20px;
    text-align: center;
    .seeRecord {
      color: #ff0b04;
      border-bottom: 2px solid #ff0b04;
    }
  }

</style>
