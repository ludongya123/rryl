<template>
    <div class="wrapper" :style="{paddingTop:user.qualitySeller==1?'68%':'62%'}">
        <div class="fixed">
            <div class="flex-wrap1">
                <div class="img">
                    <img :src="user.headImgUrl" alt="">
                </div>
                <div class="user-info">
                    <p class="nickname">{{user.nickname}}</p>
                    <p class="is-vip"  v-if="user.qualitySeller==1"><img :src="require('../../assets/img/original_golden_seller.png')" alt=""> <span>金牌卖家</span></p>
                </div>
                <div class="btn-wrap">
                    <button v-show="isFan==-1" @click="focus(1)"><i class="iconfont">&#xe69a;</i><span>关注</span></button>
                    <button v-show="isFan==1" class="focus" @click="focus(-1)"><i class="iconfont">&#xe699;</i><span>已关注</span></button>
                    <button class="ask" @click="goAsk()"> <i class="iconfont">&#xe6dd;</i>提问</button>
                </div>
            </div>
            <p class="xiline"></p>
            <p class="text-center">ta的料 <span>{{count}}</span></p>
        </div>
        <div class="list-g"
            v-infinite-scroll="LoadMore"
            infinite-scroll-disabled="disLoading"
            infinite-scroll-distance="10">
            <div class="list-item" v-for="(item ,index) in list " :key="index" @click="jump(item.id,item.period)">
                <p class="date">{{item.updateDate}}</p>
                <div class="flex-wrap">
                    <!-- 添加分销 <span class="tip">分销</span>-->
                    <h3 class="title">{{item.prefix}}{{item.title}}</h3>
                    <span class="price" v-if="item.isPublic!=1"><i class="iconfont">&#xe6a6;</i>{{item.price/100}}</span>
                    <span class="open-tip" v-if="item.isPublic==1">已公开</span>
                </div>
                <p class="count flex-wrap" >
                    <span class="state" v-if="item.timeLimit==1"><i class="iconfont">&#xe694;</i>{{item.isEnd==1?'已过期':'未过期'}}</span>
                    <span class="original-cost" v-if="item.isPublic==1">原价：<i>{{item.price/100}}元</i></span>
                </p>

                <div class="item-mask" v-if="item.reviewStatus == -1">
                    <div>
                    <p class="item-title">已下架</p>
                    <p class="item-con">资料异常，暂被下架，请联系客服</p>
                    <p class="item-con">微信: renrenyouliao888</p>
                    </div>
                </div>
            </div>

        </div>
        <div class="nodata" v-show="list.length==0&&!isInit">
            <img :src="require('../../assets/img/nonews.png')" alt="">
            <p class="text-center">暂时还没有料~</p>
        </div>
        <div class="suball" v-if="!expired">
            <!-- <div class="subtab" v-if="expired" @click="goSub"><i class="iconfont">&#xe6d6;</i>订阅 · {{subList[0].price/100}}元/{{subList[0].period}}天起</div> -->
            <div class="subtab2" v-if="!expired"><i class="iconfont">&#xe6d2;</i>已订阅·{{remainingTime ==0?'今天':remainingTime +'天后'}}到期</div>
        </div>
        <v-loadmore v-show="isloading"></v-loadmore>
        <!-- <v-marketsub :subList='subList' v-show="hasSub" @setClose="getclose" @refrsh="refrsh"></v-marketsub> -->
        <div class="mark" @click="close" v-if='hasSub'></div>
        <div class="container">
            <div class="list-one" v-for="(item,index) in subList" :key="index">
                <div class="one-left">
                <div class="day">{{item.period}} <span>天</span> </div>
                <div class="type">无限制阅读</div>
                </div>
                <div class="one-right">
                <div class="price"><i class="iconfont">&#xe6a6;</i>{{item.price/100}}</div>
                <div class="check" @click="check(index,item.id,item.price,item.period)" :class="index === checkindex? 'red' :'nored'">
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
import LoadMore from "@/components/loading.vue";
// import maskSub from "@/components/market-sub.vue"
import { InfiniteScroll } from 'mint-ui';
import {getWritingList,setFocus,marketPoint} from 'api/myProfit'
import { MessageBox ,Toast,Indicator} from 'mint-ui';
import { api } from "api/hasSub"
export default {
    components: {
        "v-loadmore": LoadMore,
        // "v-marketsub": maskSub,
    },
    data(){
        return{
            id:'',
            page:1,
            isFan: 1,
            user:{},
            // 数量
            count:0,
            // 是否不允许上拉加载 false允许 true不允许
            disLoading:false,
            // 加载loading 是否显示
            isloading:true,
            list:[],
            isInit:true,
            hasSub: false, //弹框样式显示
            subList:[] ,//订阅套餐列表
            expired: '', //是否订阅
            remainingTime: 0, //剩余订阅的天数
            checkindex : 0, //选择项的index
            index: '',
            typeId: '', //订阅套餐的id
            // 是否已提示买家用支付宝支付
            isSuggest:false,
            price: '', //套餐的价格
            conheight: '' //弹框高度,
        }
    },
    mounted(){
        this.id = this.$route.query.id;
        this.getWritingListInfo()
        this.getSublist();
    },
    methods:{
        // 获取料的列表
        getWritingListInfo(){
            this.disLoading = true;
            getWritingList({"userId":this.id,"pageNum":this.page,"pageSize":10}).then(res=>{
                if(res.data.code==200){
                    this.isInit = false;
                    let list  = res.data.result.topicList;
                    this.user = res.data.result.auther;
                    this.isFan = res.data.result.isFan;
                    this.count = res.data.result.topicCount;
                    this.expired = res.data.result.userSubscriberDto.expired;
                    this.remainingTime = res.data.result.userSubscriberDto.remainingTime;
                    this.list = [...this.list , ...list];
                    if(list.length==10){
                        this.disLoading = false;
                        this.isloading = true;
                        this.page++;
                    }
                    if(list.length<10){
                        this.disLoading = true;
                        this.isloading = false;
                    }
                }
            })
        },
        LoadMore(){
            this.getWritingListInfo();
        },
        jump(id,t){
            this.$router.push({
                path:'/info-detail',
                query:{id:id}
            })
        },
        // 取消或设置关注
        focus(t){
            if(t==-1){
               MessageBox({
                    title: '提示',
                    message: '确定要取消关注吗?',
                    cancelButtonText:'点错了',
                    showCancelButton: true,
                }).then(res=>{
                   if(res=='confirm'){
                       Indicator.open();
                       setFocus({'userId':this.id,state:t}).then(res=>{
                           Indicator.close();
                            if(res.data.code==200){
                                this.isFan = -1;
                                Toast('已取消关注')
                                this.getWritingListInfo()
                            }else{
                                Toast(res.data.message)
                            }
                        }).catch(()=>{
                            Indicator.close();
                        })
                   }
                }) 
            }else{
                if(sessionStorage.getItem('isFeedMarketEnter') == 1){
                    // event 4 => 埋点统计料集市进来的 点击关注量
                    marketPoint({event:4}).then(res=>{})
                }
                Indicator.open();
                setFocus({'userId':this.id,state:t}).then(res=>{
                    Indicator.close();
                            if(res.data.code==200){
                                this.isFan = 1;
                                Toast('已关注')
                            }else{
                                Toast(res.data.message)
                            }
                        }).catch(()=>{
                            Indicator.close();
                        })
            }
            
        },
        // 去提问页面
        goAsk(){
            window.location.href = `../dist1/index.html#/market-s?type=${2}`;
        },
        close(){
            this.hasSub = false;
            this.hideAmite()
        },
        goSub(){
            this.hasSub = true;
            this.showAmite()
        },
        check(index,typeId,price,period){
            if( index === this.checkindex ){
                this.checkindex = '';
                this.typeId = '';
                this.price ='';
                this.period = '';
            } else{
                this.checkindex = index
                this.typeId = typeId
                this.price = price/100
                this.period = period
            }
        },
        //查询订阅套餐信息
        getSublist(){
            api.getSubtype({userId: this.id}).then(res=>{
                if(res.data.code == 200){
                    this.subList = res.data.result
                    this.typeId = res.data.result[0].id
                    this.price = res.data.result[0].price/100
                    this.period = res.data.result[0].period
                }
            })
        },
        // refrsh(){
        //     // this.getWritingListInfo();
        //     this.hasSub= false;
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
            )}&b=${this.typeId}&c=${this.id}&d=${-1}&version=${localStorage.getItem('version')}`;
        },
        //微信支付
        wxPay(){
            if(this.typeId == ''){
                Toast('请选择要订阅的套餐')
                return
            }
            let that = this;
            api.subPay({'subscriberId':this.id,"type":1,"typeId":this.typeId,"topicId":-1}).then(res=>{
                if(res.data.code!=200&&res.data.code!=40006&&res.data.code!=50031&&res.data.code != 50032){
                    Toast(res.data.message)
                    this.hasSub= false;
                    this.getWritingListInfo();
                    return;
                }
                if(res.data.code==40006){
                    login(api)
                    return;
                }
                if(res.data.code == 50032){ //重复订阅
                    this.hasSub= false;
                    this.expired = false;
                    return 
                }
                // 1走ping++聚合
                if(res.data.result.type==1){
                    pingpp.createPayment(JSON.stringify(res.data.result.object), function(result, err){
                        console.log(err)
                    // object 需是 Charge/Order/Recharge 的 JSON 字符串
                    // 可按需使用 alert 方法弹出 log
                        if (result == "success") {
                            that.expired = false;
                            that.remainingTime = that.period;
                            that.hasSub= false;
                            that.hideAmite();
                            that.isFan=1;
                            // that.getWritingListInfo();
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
        // 火焰支付
         onBridgeReady(obj){
             let that =this;
       
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest', {
                    "appId":obj.appId,     //公众号名称，由商户传入     
                    "timeStamp":obj.timeStamp,         //时间戳，自1970年以来的秒数     
                    "nonceStr": obj.nonceStr, //随机串     
                    "package":obj.packageStr,     
                    "signType":obj.signType,         //微信签名方式：     
                    "paySign":obj.paySign //微信签名 
                },
                function(res){
                    //  alert(JSON.stringify(res))
                    if(res.err_msg == "get_brand_wcpay_request:ok" ){
                        that.isCanRead = 1;
                        if(that.subscribe!=1){
                            that.inportShow = true;
                        }
                    } 
                    if(res.err_msg == "get_brand_wcpay_request:cancel"){
                        Toast('你取消了支付')
                    }
                    if(res.err_msg == "get_brand_wcpay_request:fail"){
                        Toast('支付失败')
                    }
            }); 
        },
        // 隐藏动画
        hideAmite(){
            this.$animate({
                targets: '.container',
                translateY: (378*window.innerWidth/375),
                elasticity: 4,
                duration: 800,
                delay: 100,
            })
        },
        showAmite(){ 
            this.$animate({
                targets: '.container',
                translateY: -(378*window.innerWidth/375),
                elasticity: 4,
                duration: 800,
                delay: 100,
            })
        },
    }
}
</script>
<style lang="scss" scoped>
    .wrapper{
        padding: 0 0 30px;
    }
    .fixed{
        position: fixed;
        top:0;
        left:0;
        width:100%;
        background: #fff;
        box-shadow: 0 20px 40px  rgba(0, 0, 0, 0.04);
        z-index:10;
        .flex-wrap1{
            padding:30px 40px;
            .img{
                width:120px;
                height:120px;
                border-radius: 50%;
                overflow: hidden;
                margin: 0 auto;
                img{
                    width:100%;
                }
            }
            .user-info{
                margin:12px 20px 0 20px;
                overflow: hidden;
                text-align: center;
                .nickname{
                    font-weight: bold;
                    @include singleEls;
                    @include fontStyle(46px,28px,#333 );
                }
                .is-vip{
                    margin-top: 10px;
                    @include fontStyle(34px,24px,#E9B30D );
                    font-weight: bold;
                    img{
                        width:36px;
                        height:36px;
                        vertical-align: middle;
                    }
                }
            }
            .btn-wrap{
                display: flex;
                justify-content: space-between;
                margin-top: 40px;
                .ask{
                    background-color: #58CC81;
                    margin-left: 32px;
                    font-weight: bold;
                }
                button{
                    flex: 1;
                    text-align: center;
                    font-size:28px;
                    border-radius: 8px;
                    height: 88px;
                    color: #fff;
                    background: #407FE7;
                    display: block;
                    i {
                        font-size:28px;
                        margin-right: 8px;
                    }
                    span{
                        line-height: 1;
                        font-weight: bold;
                    }
                }
                button.focus{
                    background: #fff ;
                    color:#666;
                    border: 1px solid rgba(0, 0, 0, 0.06);
                }
            }
        }
        p.text-center{
            line-height: 100px;
            color:#333;
            font-size:28px;
            font-weight: bold;
            span{
                color:#999;
                font-weight: normal;
            }
        }
    }
    
    .list-g{
        padding: 0 20px 145px;
        .list-item{
            margin-top:20px;
            border-radius: 8px;
            box-shadow: 0 20px 40px  rgba(0, 0, 0, 0.04);
            padding:36px 40px;
            box-sizing:border-box;
            background: #fff;
            position: relative;
            .date{
                color:#999;
                font-size:24px;
            }
            .item-mask {
                width: 100%;
                height: 100%;
                background-color: #fff;
                z-index: 2;
                position: absolute;
                opacity: 0.96;
                text-align: center;
                border-radius: 8px;
                padding-top:20px;
                box-sizing: border-box;
                left:0;
                top:0;
                .item-title { 
                    font-size: 30px;
                    color: #333;
                }
                .item-con {
                    color: #999;
                    font-size: 26px;
                    padding-top: 20px;
                }
            }
            .flex-wrap{
                justify-content: space-between;
                color:#333;
                font-size:28px;
                padding: 10px 0;
                align-items: center;
                .title{
                    overflow: hidden;
                    flex: 1;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    margin-right:20px;
                    line-height: 46px;
                    font-weight: bold;
                    
                    .tip{
                        color:#fff;
                        display: inline-block;
                        background: #F88629 ;
                        border-radius: 6px;
                        font-size: 24px;
                        // position: relative;
                        // top:-4px;
                        width:70px;
                        height:36px;
                        text-align: center;
                        line-height: 46px;
                        margin-right: 10px;
                    }
                }
                .price{
                    font-size:40px;
                    color:#F34434 ;
                    font-weight: bold;
                }
                .open-tip{
                    color:$font-red;
                    font-weight: bold;
                }
            }
            .count{
                color:#999;
                font-size:24px;
                justify-content: space-between;
                align-items: center;
                padding:0;
                .state{
                    i{
                        font-size:24px;
                        color:#999;
                        margin-right: 10px;
                    }
                }
                .original-cost{
                    flex:1;
                    text-align: right;
                    font-size:28px;
                    i{
                        font-size:24px;
                        font-style: normal;
                        text-decoration:line-through;
                    }
                }
                
            }
        }
    }

    .nodata{
        padding-top:100px;
        img{
            width:100%;
        }
        p{
            color:#999;
            margin-top:20px;
        }
    }
    .suball{
        background-color: #fff;
        width: 100%;
        height: 120px;
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 888;
        padding: 10px 0 20px 0;
    }
    .subtab{
        background-color: #F34434;
        height: 96px;
        line-height: 96px;
        text-align: center;
        color: #fff;
        margin: 10px 20px;
        border-radius: 8px;
        font-size: 28px;
        i{
            margin-right: 8px;
            font-size: 26px
        }
    }
    .subtab2{
        height: 90px;
        line-height: 90px;
        text-align: center;
        color: #666;
        margin: 16px 20px;
        border-radius: 8px;
        font-size: 28px;
        border: 2px solid rgba(51,51,51,0.12);
        i{
            margin-right: 8px;
            font-size: 26px
        }
    }
    // 弹框样式
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
        padding: 20px 0 40px 0;
        background-color: #fff;
        position: fixed;
        left: 0;
        z-index: 1000;
        width: 100%;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        bottom:-756px;
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
            font-size: 26px;
            font-weight: bold;
        }
        .wechatpay{
            background-color: #58CC81;
            border-radius: 8px;
            flex: 1;
            font-size: 26px;
            font-weight: bold;
        }
    }
</style>
