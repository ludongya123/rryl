<template>
  <div class="container">
    <div class="mark" @click="close"></div>
    <div class="container">
      <div class="list-one" v-for="(item,index) in Lists" :key="index">
        <div class="one-left">
          <div class="day">{{item.period}} <span>天</span> </div>
          <div class="type">无限制阅读</div>
        </div>
        <div class="one-right">
          <div class="price"><i class="iconfont">&#xe6a6;</i>{{item.price/100}}</div>
          <div class="check" @click="check(index,item.id,item.price)" :class="index === checkindex? 'red' :'nored'">
            <i class="iconfont">&#xe6a8;</i>
          </div>
        </div>
      </div>
      <div class="subnow">
          <div class="zfbpay" @click="jumpAlipay()">支付宝支付</div>
          <div class="wechatpay"  @click="(price>500&&!isSuggest)?paySuggest():wxPay()">微信支付</div>
      </div>
    </div>
  </div>
</template>
<script>
import { api } from "api/hasSub";
import {Toast,Indicator,MessageBox} from "mint-ui";
export default {
    props: ['subList'],
    data() {
        return {
            checkindex : 0, //选择项的index
            index: '',
            Lists:[],
            typeId: '', //订阅套餐的id
            // 是否已提示买家用支付宝支付
            isSuggest:false,
            price: '' //套餐的价格
        };
    },
    mounted(){
        // 查询订阅套餐信息
        // this.getSublist();
        console.log(this.subList)
    },
    methods:{
        close(){
            this.$emit('setClose', false)
        },
        //查询订阅套餐信息
        // getSublist(){
        //     api.getSubtype({userId: this.subuserid}).then(res=>{
        //         if(res.data.code == 200){
        //             this.Lists = res.data.result;
        //             this.typeId = res.data.result[0].id
        //             this.price = res.data.result[0].price/100
        //         }
        //     })
        // },
        check(index,typeId,price){
            if( index === this.checkindex ){
                this.checkindex = '';
                this.typeId = '';
                this.price ='';
            } else{
                this.checkindex = index
                this.typeId = typeId
                this.price = price
            }
        },
        // subnow(){
        //     if(this.checkindex === ''){
        //         console.log('请选择套餐')
        //     }else{
        //         api.userSub({subscriberId: this.subuserid,typeId:this.typeId}).then(res=>{
        //             if(res.code == 200){
        //             }
        //             this.$emit('refrsh')
        //         })
        //     }
        // },
        // 支付金额大于500元是的提示框
        paySuggest(){
            MessageBox({
                title: '温馨提示',
                message: '大金额资料，用支付宝付款更安全！',
                confirmButtonText:'支付宝支付',
                showCancelButton:true
            }).then(res=>{
                this.isSuggest = true;
                if(res=="confirm"){
                    this.jumpAlipay();
                }
            })
        },
        //支付宝支付
        jumpAlipay() {
            if(this.typeId == ''){
                Toast('请选择要订阅的套餐')
                return
            }
            window.location.href = `../alipay/sub.html?a=${encodeURIComponent(
                localStorage.getItem("Authorization")
            )}&b=${this.typeId}&c=${this.subuserid}&version=${localStorage.getItem('version')}`;
        },
        //微信支付
        wxPay(){
            if(this.typeId == ''){
                Toast('请选择要订阅的套餐')
                return
            }
            let that = this;
            api.subPay({'subscriberId':this.subuserid,"type":1,typeId:this.typeId}).then(res=>{
                if(res.data.code!=200&&res.data.code!=40006&&res.data.code!=50031){
                    Toast(res.data.message)
                    this.$emit('refrsh')
                    return;
                }
                if(res.data.code==40006){
                    login(api)
                    return;
                }
                // 1走ping++聚合
                if(res.data.result.type==1){
                    pingpp.createPayment(JSON.stringify(res.data.result.object), function(result, err){
                    // object 需是 Charge/Order/Recharge 的 JSON 字符串
                    // 可按需使用 alert 方法弹出 log
                        if (result == "success") {
                            // api.userSub({subscriberId: this.subuserid,typeId:this.typeId}).then(res=>{
                            //     if(res.code == 200){
                            //     }
                                
                            // })
                            this.$emit('refrsh')
                            // 只有微信公众号 (wx_pub)、微信小程序（wx_lite）、QQ 公众号 (qpay_pub)支付成功的结果会在这里返回，其他的支付结果都会跳转到 extra 中对应的 URL
                        } else if (result == "fail") {
                            Toast('支付失败');
                            // this.alignPay2();
                            // Ping++ 对象 object 不正确或者微信公众号/微信小程序/QQ公众号支付失败时会在此处返回
                        } else if (result == "cancel") {
                            Toast('你取消了支付')
                            // 微信公众号、微信小程序、QQ 公众号支付取消支付
                        }
                    });
                }else{
                    // 2 走火眼公众号支付
                    this.onBridgeReady(res.data.result.object);
                    
                }
            })
        },


    }
};
</script>
<style lang='scss' scoped>
.mark {
  width: 100%;
  height: 100%;
  position: fixed;
  opacity: 0.4;
  background-color: #333;
  top: 0;
  left: 0;
  z-index: 999;
}
.container {
  padding: 20px 0;
  background-color: #fff;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.list-one {
  display: flex;
  justify-content: space-between;
  height: 144px;
  padding: 0 40px;
  align-items: center;
  border-bottom: 1px solid #f3f3f3;
}
.day{
    color: #333;
    font-size: 48px;
}
.day span{
    font-size: 24px;
}
.type{
    color: #999;
    font-size: 24px;
}
.one-right{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.price{
    color: #f34434;
    font-size: 40px;
    margin-right: 32px;
}
.check{
    width: 56px;
    height: 56px;
    line-height: 56px;
    border-radius: 50%;
    text-align: center;
    
}
.nored{
    color: #999;
    background-color: #fff;
    border: 1px solid #ccc;
}
.red{
    color: #fff;
    background-color: #f34434;
    border: 1px solid #ccc;
}
.subnow{
    height: 96px;
    line-height: 96px;
    color: #fff;
    text-align: center;
    display: flex;
    justify-content: space-between;
    padding: 0 40px;
    margin-top: 20px;
}
.zfbpay{
    background-color: #407FE7;
    border-radius: 8px;
    flex: 1;
    margin-right: 20px;
}
.wechatpay{
    background-color: #58CC81;
    border-radius: 8px;
    flex: 1;
}
</style>


