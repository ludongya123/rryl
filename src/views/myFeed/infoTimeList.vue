<template>
    <div class="wrapper">
        <div class="head">
            <div class="title">
                <p class="date-time">{{createDate}}</p>
                <div class="flex-wrap">
                    <div class="f-left">
                        <h2>{{title}}</h2>
                        <!-- 买家已购买 -->
                        <div class="desc" v-if="isAuthor!=1 && isCanRead==1">
                            <span><i class="iconfont">&#xe691;</i>{{remainDays>0?`剩余${remainDays}天到期`:'已到期'}}</span>
                            <span><i class="iconfont">&#xe68e;</i>{{price}}元</span>
                        </div>
                    </div>
                    <!-- 卖家 -->
                    <div class="f-right" v-if="isAuthor==1">
                       <i class="iconfont price">&#xe6a6;</i><span class="price">{{price}}</span>
                    </div>
                    <!-- 买家 -->
                    <!-- <div class="f-right" v-if="isAuthor!=1" @click="focus(isFan!=1?1:-1)">
                       <i class="iconfont focus" v-show="isFan!=1">&#xe69e;</i>
                       <i class="iconfont focus_" v-show="isFan==1">&#xe6a2;</i>
                       <img :src="auther.headImgUrl" alt="">
                    </div> -->
                </div>
            </div>
            <p class="xiline" v-if="isAuthor==1 || isCanRead!=1"></p>
            <!-- 卖家或者买家未购买 -->
            <div class="count-info" v-if="isAuthor==1 || isCanRead!=1">
                <div class="flex-wrap">
                    <!-- <div v-if="isAuthor==1">
                        <p class="count-title">浏览</p>
                        <p>{{readTimes}}</p>
                    </div>
                    <div v-if="isAuthor==1">
                        <p class="count-title">已售</p>
                        <p>{{sellCount}}</p>
                    </div> -->
                    <div>
                        <p class="count-title">包时段 · 天</p>
                        <p>{{periodDays}}</p>
                    </div>
                </div>
            </div>
        </div>
        <p class="xiline"></p> 
        <!-- 关注作者区域  -->
        <div class="focus-area flex-wrap"  v-if="isAuthor!=1"  @click="toAuthorHome()">
            <img :src="auther.headImgUrl" alt="">
            <span>{{auther.nickname}}</span>
            <div>
                <button @click.stop="focus(isFan!=1?1:-1)" :class="isFan==1?'':'focus'"><i class="iconfont" v-if="isFan==1">&#xe699;</i> <i class="iconfont" v-if="isFan!=1">&#xe69a;</i>{{isFan==1?'已关注':'关注'}}</button>
            </div>
        </div>
        <!-- 料的列表 -->
        <div class="group" v-if="isCanRead==1">
            <template v-for="(item,index) in list" v-key="index">
                <div class="list-item"  @click="toDetail(item.id)" :key="index">
                    <p class="date-time flex-wrap">
                        <span>{{item.writeLatestTime}}</span>
                        <i class="iconfont">&#xe68d;</i>
                    </p>
                    <div class="flex-wrap content">
                        <span class="new-icon" v-if="item.isNew==1"></span>
                        <h3 :class="item.isNew==1?'new':''">
                            <p v-if="item.freePart!=''||item.payPart!=''" class="show-part">{{item.freePart||item.payPart}}</p>
                            <p class="show-part" v-else> 
                                <template v-for="i in item.picNum" >
                                「图片」
                                </template>
                            </p>
                        </h3>
                        <div class="cover" v-if="item.imgUrl"><img :src="item.imgUrl" alt=""></div>
                    </div>
                </div>
                <p class="xiline" ></p>
            </template>
            <div class="tip" v-if="isCanRead==1&&list.length==0">你已购买，请等待卖家更新~</div>
        </div>
        
        <!-- 等待解锁 -->
        <p class="lock" v-if="isCanRead!=1"><i class="iconfont">&#xe6ae;</i><span>等待解锁</span></p>

        <!-- 纠纷投诉  -->
        <div class="complain"   @click="toOpenComplain" v-if="isAuthor!=1 && isCanRead==1">
            <button>纠纷投诉</button>
        </div>
         <!-- 返回首页 -->
        <div class="back-home" @click="$router.replace('/')" v-show="isShare">
            <img :src="require('../../assets/img/back_home.png')" alt="">
        </div>
        <!-- 公众号引导关注 -->
        <div class="guide" v-if="subscribe!='1'">
            <h3>关注人人有料公众号</h3>
            <img :src="require('../../assets/img/qr_code.jpg')" alt="">
            <p>第一时间获取作者最新消息，接收提现、退款等消息提醒</p>
        </div>

        <!-- 支付按钮 -->
        <p class="xiline"></p>
        <div class="btns flex-wrap" v-show="isCanRead!=1 && isAuthor!=1" >
            <button class="ali-pay" @click="jumpAlipay()">支付宝 · {{price}}元</button><button  @click='wxPay()' class="wx-pay">微信 · {{price}}元</button>
        </div>

      

        <div class="qr-code-modal" v-show="inportShow">
            <div class="content">
                <h2>付款成功</h2>
                <p>长按识别二维码关注，一手好料不错过</p>
                <div class="img">
                    <img :src="require('../../assets/img/qr_code.jpg')" alt="">
                </div>
                <p style="text-align:left">关注公众号，你可以比别人更早知道：大神新料更新提醒；提现、退款提醒</p>
                <div class="btn" @click="inportShow=false"><button>确定</button></div>
            </div>
        </div>
    </div>
</template>
<script>
import { api } from "api/myFeed";
import { setFocus } from "api/myProfit";
import {Toast,Indicator,MessageBox} from "mint-ui";
export default {
    data(){
        return{
            // 付款成功后的弹层
            inportShow:false,

            // 日期
            createDate:'',
            // 是否为作者
            isAuthor:0,
            // 作者信息
            auther:{},
            // 是否能读
            isCanRead:0,
            // 是否关注作者
            isFan:1,
            // 价格
            price:'',
            // 料的id 
            id:'',
            // 料的标题
            title:'',
            // 分时间段料的列表
            list:[],
            // 是否通过二维码分享进入
            isShare:false,
            // 是否关注公众号
            subscribe:1,
            // 阅读量
            readTimes:0,
            // 销量
            sellCount:0,
            // 包时段天数
            periodDays:0,
            // 买家剩余包时段时间
            remainDays:0
        }
    },
    mounted(){
        let url=window.location.href;
        if(url.indexOf('qrCode')>=0){
            this.isShare = true;
        }
        this.id = this.$route.query.id;
        this.getPeriodInfo(this.$route.query.id);
    },
    methods:{
        /***
         * 获取料的包时间段信息
         */
      async getPeriodInfo(id){
        Indicator.open({
          text: '加载中...'
        })
        try {
          var res = await api.period({
            'id': id
          })
          Indicator.close()
          if(res.code==200){
              
            let {auther,canRead,isAuther,isFan,price,readTimes,sellCount,subscribe,title,writeLatestTime,writingList,periodDays,remainDays} = res.result;
  
            this.list = writingList;
            this.auther = auther;
            this.isAuthor = isAuther;
            this.isCanRead = canRead;
            this.isFan = isFan;
            this.price =  price/100;
            this.subscribe = subscribe;
            this.sellCount = sellCount;
            this.readTimes = readTimes;
            this.title = title;
            this.periodDays = periodDays;
            this.remainDays = remainDays;
            this.createDate = writeLatestTime;
          }
        } catch (e) {
          Indicator.close()
        }
      },
      /**
         * 微信支付
         */
        wxPay(){
            let that = this;
            api.pingPay({'id':this.id,"type":1}).then(res=>{
                if(res.data.code!=200){
                    Toast(res.data.message);
                    return;
                }
                pingpp.createPayment(JSON.stringify(res.data.result), function(result, err){
                // object 需是 Charge/Order/Recharge 的 JSON 字符串
                // 可按需使用 alert 方法弹出 log
                    if (result == "success") {
                        that.isCanRead = 1;
                        that.getPeriodInfo(that.id);
                        if(that.subscribe!=1){
                            that.inportShow = true;
                        }
                        // 只有微信公众号 (wx_pub)、微信小程序（wx_lite）、QQ 公众号 (qpay_pub)支付成功的结果会在这里返回，其他的支付结果都会跳转到 extra 中对应的 URL
                    } else if (result == "fail") {
                        Toast('支付失败');
                        // Ping++ 对象 object 不正确或者微信公众号/微信小程序/QQ公众号支付失败时会在此处返回
                    } else if (result == "cancel") {
                        // 微信公众号、微信小程序、QQ 公众号支付取消支付
                    }
                });
            })
        },

        // 支付宝支付
        jumpAlipay() {
            window.location.href = `../alipay/index.html?a=${encodeURIComponent(
                localStorage.getItem("Authorization")
            )}&b=${this.id}`;
        },
      // 取消或设置关注
        focus(t) {
            if (t == -1) {
               MessageBox({
                    title: "提示",
                    message: "确定要取消关注吗?",
                    cancelButtonText: "点错了",
                    showCancelButton: true
                }).then(res => {
                    if (res == "confirm") {
                        Indicator.open();
                        
                        setFocus({ userId: this.auther.userId, state: t })
                            .then(res => {
                        Indicator.close();
                            if (res.data.code == 200) {
                                this.isFan = 0;
                            Toast("已取消关注");
                            } else {
                                Toast(res.data.message);
                            }
                        }).catch(() => {
                            Indicator.close();
                        });
                    }
                });
            } else {
                Indicator.open();
                setFocus({ userId: this.auther.userId, state: t })
                    .then(res => {
                Indicator.close();
                    if (res.data.code == 200) {
                        this.isFan = 1;
                        Toast("已关注");
                    } else {
                        Toast(res.data.message);
                    }
                }).catch(() => {
                    Indicator.close();
                });
            }
        },
        //  跳转到包时段详情
        toDetail(id){
            this.$router.push({
                path:'/info-time-list-detail',
                query:{id:id}
            })
        },
        /**跳转到作者主页 */
        toAuthorHome(){
            this.$router.push({
                path:'/userhome',
                query:{id:this.auther.userId}
            })
        },
        /**
        * 跳转纠纷投诉
        */
        toOpenComplain() {
            this.$router.push({
                path: `/complain`,
                query: { id: this.id }
            });
        },
    }
}
</script>
<style lang="scss" scoped>
    .wrapper{
        background-color: #fff;
    }
    // 二维码弹层
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
    // 头部
    .head{
        padding:  30px  40px 0;
        background: #fff;
        .title{
            padding-bottom: 25px;
            .date-time{
                color:#333;
                opacity: 0.4;
                font-size: 24px;
                line-height: 40px;
            }
            .flex-wrap{
                justify-content: space-between;
                align-items: center;
                .f-left{
                    flex:1;
                    overflow: hidden;
                    h2{
                        color:#333;
                        font-size: 36px;
                        line-height: 50px;
                        font-weight: bold;
                        margin-right: 16px;
                    }
                    .desc{
                        color:#999;
                        line-height: 34px;
                        font-size:24px;
                        span{
                            margin-right: 20px;
                        }
                        i{
                            font-size: 24px;
                            margin-right: 8px;
                        }
                    }
                }
                .f-right{
                    position: relative;
                    i.price{
                        font-size:30px;
                        color:#F34434;
                    }
                    span.price{
                        color:#F34434;
                        font-size: 40px;
                        font-weight: bold;
                    }
                    i.focus{
                        position: absolute;
                        bottom:0;
                        right:-8px;
                        color:#407FE7;
                        background: #fff;
                        border-radius: 50%;
                        font-size:32px;
                        border:2px solid #fff;
                    }
                    i.focus_{
                        position: absolute;
                        bottom:0;
                        right:-8px;
                        color:#b3b3b3;
                        background: #fff;
                        border:2px solid #fff;
                        border-radius: 50%;
                        font-size:32px;  
                        display: block;
                    }
                    img{
                        width:72px;
                        height:72px;
                        border-radius: 50%;
                    }
                }
            }
        }
        .count-info{
            padding:40px 0 30px;
            .flex-wrap{
                justify-content: flex-start;
                align-items: center;
                text-align: center;
                div{
                    margin-right: 40px;
                }
                p{
                    color:#333;
                    font-size: 32px;
                    font-weight: bold;
                    line-height: 52px;
                    text-align: left;
                    i{
                        color:#333;
                        font-size:30px;
                    }
                }
                p.icon{
                    line-height: 44px;
                    
                }
                p.count-title{
                    color:#999;
                    font-size:24px;
                    font-weight: normal;
                    line-height: 34px;
                    margin-bottom:6px;
                }
            }
        }
    }
    // 关注区域
    .focus-area{
        align-items: center;
        padding: 16px;
        border:1px solid rgba(51,51,51,0.12);
        background-color: rgba(244,244,248,1);
        margin: 24px 20px 14px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.06);
        border-radius: 8px;
        img{
            width:72px;
            height: 72px;
            border-radius: 50%;
        }
        span{
            flex:1;
            margin: 0 20px;
            font-size: 26px;
            color:#333;
        }
        button{
            height:72px;
            padding: 0 26px;
            background: #fff;
            border-radius: 8px;
            font-size: 28px;
            border:1px solid rgba(51,51,51,0.12);
            color:#666;
            i{
                font-size: 28px;
                margin-right: 10px;
            }
        }
        .focus{
            background-color: #407FE7 ;
            color:#fff;
            i{
                color:#fff;
            }
        }
    }
    // 料列表
    .group{
        background-color: #fff;
        .list-item{
            padding: 30px 40px;
            .date-time{
                line-height: 40px;
                justify-content: space-between;
                align-items: center;
                span{
                    color:#999;
                    font-size:24px;
                }
                i{
                    font-size:26px;
                    color:#666;
                }
            }
            .content{
                justify-content: space-between;
                align-items: flex-start;
                position: relative;
                span.new-icon{
                        position: absolute;
                        width:10px;
                        height: 10px;
                        background-color: #F34434;
                        border-radius: 50%;
                        top:14px;
                        left:0;
                }
                h3{
                    flex:1;
                    color:#666;
                    font-size: 28px;
                    line-height: 48px;
                    margin-right: 20px;
                    overflow: hidden;
                    .show-part{ 
                        overflow : hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box ;
                        -webkit-line-clamp: 2;
                        /*! autoprefixer: off */
                        -webkit-box-orient: vertical;
                        word-break: break-all;
                        /* autoprefixer: on */
                    }
                    
                }
                h3.new{
                    padding-left:20px;
                    color:#333;
                }
                .cover{
                    width:88px;
                    height: 88px;
                    border-radius: 8px;
                    overflow: hidden;
                    img{
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
                }
            }
        }
        .tip{
            text-align: center;
            padding: 50px 0;
            background: #fff;
            font-size: 28px;
            color:#999;
        }
    }
    // 关注公众号引导
    .guide{
        text-align: center;
        padding: 80px ;
        background-color: #fff;
        box-shadow: 0 -0.5px 0 0 rgba(0,0,0,0.2);
        h3{
            color:#333;
            font-size:36px;
            line-height: 50px;
            font-weight: bold;
        }
        img{
            width:360px;
            margin: 20px 0;
        }
        p{
            color:#666;
            font-size:30px;
            line-height: 50px;
        }
    }
    // 纠纷投诉
    .complain{
        padding: 40px 40px 60px;
        background-color: #fff;
        button{
            font-size: 26px;
            color:#666;
            background: #fff;
            width:100%;
            height:88px;
            border:1px solid rgba(51,51,51,0.12);
            border-radius: 8px;
        }
    }
    // 底部按钮
    .btns{
        padding: 20px;
        background-color: #fff;
        justify-content: space-between;
        button{
            border-radius: 8px;
            font-size: 26px;
            height: 88px;
            width:340px;
            color:#fff;
            font-weight: bold;
        }
        .ali-pay{
            background-color: #407FE7 ;
        }
        .wx-pay{
            background-color: #58CC81 ;
        }
    }

    // 等待解锁
    .lock{
        text-align:  center;
        color:#666;
        padding: 60px;
        font-size:28px;
        background-color: #fff;
        i{
            font-size:28px;
        }
    }
    // 返回首页
    .back-home{
        position: fixed;
        right:0;
        top:60%;
        width:74px;
        height: 150px;
        z-index:50;
        img{
            width:100%;
        }
    }

</style>
