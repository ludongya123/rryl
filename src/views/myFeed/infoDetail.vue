<template>
    <div class="wrapper" :class="isPreview?'padding-btm':''">
        <!-- 被限制 -->
        <div class="mask" v-if="hasRestrict"></div>
        <div class="mask-content" v-if="hasRestrict">
            <p class="content-title">账号异常</p>
            <p class="content-wxchat">请联系客服微信: renrenyouliao888</p>
            <p class="confire" @click="hasRestrict=false">确定</p>
        </div>

        <div class="preview-tip" v-show="isPreview">预览模式，暂未发布</div>
        <div class="floor-tip" v-if="period == 1"><i class="iconfont">&#xe6d1;</i> 包时段功能已下线，之后不再更新</div>
        <!-- 料的内容 -->
        <div v-if="isEnd!=1">
            <div class="head" >
                <div class="title">
                    <p class="date-time">{{createDate}}</p>
                    <div class="flex-wrap">
                        <div class="f-left">
                            <h2>{{title}}</h2>
                            <!-- 买家已购买 -->
                            <div class="desc" v-if="isAuthor!=1 && isCanRead===1">
                                <span style="color:#F34434;font-weight:bold;" v-if="isTk">不中必退</span>
                                <span v-if="collectType==1"><i class="iconfont">&#xe691;</i>{{remainDays>0?`剩余${remainDays}天到期`:'已到期'}}</span>
                                <span v-if="isFree!=1"><i class="iconfont">&#xe68e;</i>{{price}}元</span>
                                <span v-if="isFree==1"><i class="iconfont">&#xe68e;</i>免费</span>
                            </div>
                        </div>
                        <!-- 卖家 -->
                        <div class="f-right" v-if="isAuthor==1&&price!=0">
                            <i class="iconfont price">&#xe6a6;</i><span class="price">{{price}}</span>
                        </div>
                        <div class="f-right" v-if="isAuthor==1 &&price==0 ">
                            <span class="price">免费</span>
                        </div>
                    </div>
                </div>
                <p class="xiline" v-if="isAuthor==1 || isCanRead!=1"></p>
                <!-- 卖家或者买家未购买 -->
                <div class="count-info" v-if="isAuthor==1 || isCanRead!=1">
                    <div class="flex-wrap">
                        <!-- <div v-if="isAuthor==1">
                            <p class="count-title">浏览</p>
                            <p>{{seeCount}}</p>
                        </div>
                        <div v-if="isAuthor==1">
                            <p class="count-title">已售</p>
                            <p>{{sellCount}}</p>
                        </div> -->
                        <div v-show="collectType==1">
                            <p class="count-title">包时段 · 天</p>
                            <p>{{periodDays}}</p>
                        </div>
                        <div v-show="isLimitBuy && collectType==0">
                            <p class="count-title">限时售卖</p>
                            <p class="icon"><i class="iconfont">&#xe6a2;</i></p>
                        </div>
                        <div v-show="isTk && collectType==0">
                            <p class="count-title">不中必退</p>
                            <p class="icon"><i class="iconfont">&#xe6a2;</i></p>
                        </div>
                    </div>
                </div>
            </div>
            <p class="xiline" ></p>

            <!-- 关注作者区域 -->
            <div class="focus-area flex-wrap"  v-if="isAuthor!=1" @click="toAuthorHome()">
                <img :src="auther.headImgUrl" alt="">
                <div class="user-info">
                    <p class="nickname">{{auther.nickname}}</p>
                    <p class="is-vip" v-if="auther.qualitySeller==1"><img :src="require('../../assets/img/original_golden_seller.png')" alt=""> <span>金牌卖家</span></p>
                </div>
                
                <div class="statusbtn">
                    <button @click.stop="focus(isFan!=1?1:-1)" :class="isFan==1?'':'focus'"><i class="iconfont" v-if="isFan==1">&#xe699;</i> <i class="iconfont" v-if="isFan!=1">&#xe69a;</i>{{isFan==1?'已关注':'关注'}}</button>
                    <!-- <button class="gosub"  @click.stop="goSub" v-if="subList.length>0 && expired && period != 1"><i class="iconfont">&#xe6d6;</i>订阅</button> -->
                    <button class="hassub" v-if='!expired'><i class="iconfont">&#xe6d2;</i>已订阅</button>
                </div>
            </div>
            <!-- 料的信息 -->
            <div class="feed-info" >

               <template v-if="isCanRead!=1"> 
                    <p class="update-tip">更新于 {{sectionList.length!=0?sectionList[0].createDate:''}}</p>
                    <div class="free-area" v-show="sectionList.length!=0 && sectionList[0].freePart!='' ">
                        <div class="text-area"  v-html="sectionList.length!=0?sectionList[0].freePart:''">
                            
                        </div>
                    </div>    
               </template>
               <template v-if="isCanRead==1" v-for="(item , index) in sectionList" v-key="index"> 
                    <p class="update-tip">更新于 {{item.createDate}}</p> 
                     <div class="free-area" v-show="item.freePart!=''" >
                        <div class="text-area"  v-html="item.freePart">
                            
                        </div>
                    </div>
                    <!-- <h5>付费内容</h5> -->
                    <div class="buy-area" v-if="isCanRead==1"  >
                        <div class="text-area" v-html="item.payPart">
                            
                        </div>
                        <div class="imgs-area" >
                            <template v-for="(item_,index_) in item.pictureList"  v-key="index_ ">
                                <img :src="item_ " alt=""   >
                            </template>
                        </div>
                    </div>
               </template>

                <!-- 待支付简介 -->
                <div v-if="isCanRead!=1" class="need-payment">
                    <div class="flex-wrap">
                        <div class="text">
                            <div class="circle">
                                <i class="iconfont">&#xe6b3;</i>
                                <span>{{textCount>=1000?'999+':textCount}}</span>
                            </div>
                            <p>{{textCount}}文字</p>
                        </div>
                        <div class="space"></div>
                        <div class="picture">
                            <div class="circle">
                                <i class="iconfont">&#xe6ac;</i>
                                <span>{{picCount}}</span>
                            </div>
                            <p >{{picCount}}张图片</p>
                        </div>
                    </div>
                    <p class="lock"><i class="iconfont">&#xe6ae;</i><span>等待解锁</span></p>
                </div>
            </div>
        </div>

        

        <!-- 公众号引导关注 -->
        <div class="guide" v-show="subscribe=='0'" :class="isCanRead!=1?'padding-btm':''">
            <h3>关注人人有料公众号</h3>
            <img :src="require('../../assets/img/qr_code.jpg')" alt="">
            <p>第一时间获取作者最新消息，接收提现、退款等消息提醒</p>
        </div>

        <!-- 去赚佣金 单卖并且打开分销时显示 -->
        <!-- <div class="btns share-sell" @click="makeMoney()" v-if="isAuthor!=1">
            <button><i class="iconfont">&#xe6b4;</i>去赚佣金 · 2.5元</button>
        </div> -->

        <!-- 支付按钮 -->
        <div class="btns pay-area flex-wrap"  v-show="isCanRead!=1 && isEnd==0 && period !==1">
            <!-- <button v-if="subList.length>0 && expired && period != 1" class="sub-pay" @click="goSub">订阅免费看</button> -->
            <button class="ali-pay" @click="jumpAlipay()">支付宝 · {{price}}元</button><button  @click="(price>500&&!isSuggest)?paySuggest():wxPay()" class="wx-pay">微信 · {{price}}元</button>
        </div>
        <div class="btns"  v-show="period == 1">
            <button disabled='disabled' class="periodbtn">包时段功能已下线，已不可购买</button>
        </div>

        <!-- 纠纷投诉  -->
        <div class="complain"   @click="toOpenComplain" v-if="isAuthor!=1 && isCanRead==1">
            <button>纠纷投诉</button>
        </div>

        <!-- 关闭预览 -->
        <div class="btns pre-view" v-show="isPreview" @click="closePreview()">
            <button class="preview">关闭预览</button>
        </div>
        

        <!-- 返回首页 -->
        <div class="back-home" @click="$router.replace('/')" v-show="isShare">
            <img :src="require('../../assets/img/back_home.png')" alt="">
        </div>

        <!-- 过期图标 -->
        <!-- 如果是限时料 并且 过期 并且 不能读/未购买 -->
        <div v-if="isEnd==1" class="lose-effect">
            <img src="../../assets/img/loseEffect.png">
            <div>该料已经过期或者删除</div>
        </div>

    <!-- 付款成功弹出二维码 -->
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
        <!-- <v-marketsub :subuserid='auther.userId' v-if="hasSub" @setClose="getclose" @refrsh="refrsh"></v-marketsub> -->
        <!-- 订阅弹框样式 -->
        <div class="mark" @click="close" v-if='hasSub'></div>
        <div class="container">
            <div class="list-one" v-for="(item,index) in subList" :key="index">
                <div class="one-left">
                <div class="day">{{item.period}} <span>天</span> </div>
                <div class="type">无限制阅读</div>
                </div>
                <div class="one-right">
                <div class="mark-price"><i class="iconfont">&#xe6a6;</i>{{item.price/100}}</div>
                <div class="check" @click="check(index,item.id,item.price)" :class="index === checkindex? 'red' :'nored'">
                    <i class="iconfont">&#xe6a8;</i>
                </div>
                </div>
            </div>
            <div class="subnow">
                <div class="zfbpay" @click="jumpAlipay2()">支付宝支付</div>
                <div class="wechatpay"  @click="(subprice>500&&!isSuggest2)?paySuggest2():wxPay2()">微信支付</div>
            </div>
        </div>
    </div>
</template>
<script>
import { api } from "api/myFeed";
// import maskSub from "@/components/market-sub.vue"
import { setFocus,marketPoint } from "api/myProfit";
import {Toast,Indicator,MessageBox} from "mint-ui";
import {login} from "@/api/login_hy.js"
export default {
    components: {
        // "v-marketsub": maskSub,
    },
    data(){
        return{
            // 二维码付款成功后的弹层
            inportShow:false,
            // 料id
            id:'',
            // 是否通过二维码进来
            isShare:false,
            // 是否作者
            isAuthor:0,
            // 是否可读
            isCanRead:0,
            // 是否关注公众号 0未关注 1已关注
            subscribe:1,
            // 更新日期
            createDate:'',
            // 标题
            title:'',
            // 价格
            price:'',
            // 是不是免费料
            isFree:0,
            // 作者信息
            user:{},
            // 是否关注作者】
            isFan:0,
            // 限时料是否已经过期
            isEnd:0,
            // 是否是预览模式
            isPreview:false,
            // 浏览量
            // seeCount:0,
            // // 已售量
            // sellCount:0,
            // 0 单卖 1：包时段
            collectType:0,
            // 包时段天数
            periodDays:0,
            // 剩余多少天到期
            remainDays:0,
            // 是否限时购买
            isLimitBuy:false,
            // 是否退款
            isTk:false,
            // 文字个数
            textCount:0,
            // 图片个数
            picCount:0,
            // 卖家信息
            auther:{},
            // 投诉用的key
            topicKey:'',
            // 内容更新列表
            sectionList:[],
            // 是否已提示买家用支付宝支付
            isSuggest:false,
            // 是否已提示买家用支付宝支付
            isSuggest2:false,
            // 是否被限制
            hasRestrict:false,
            // 弹框样式显示
            hasSub: false,
            // 是否是包时段
            period: '',
            subList:'' ,//订阅套餐列表
            userSubscriberDto: {}, //是否已经订阅
            expired: false,
            checkindex : 0, //选择项的index
            index: '',
            typeId: '', //订阅套餐的id
            // 是否已提示买家用支付宝支付
            isSuggest:false,
            subprice: '' //套餐的价格
        }
    },
    mounted() {
        
        let id, isShare;
        let url = window.location.href;
        
        // 如果扫描二维码进入此页的
        if (url.indexOf("qrCode") >= 0) {

            id = this.$route.query.id;
            isShare = true;

        } else {
        // 如果其他方式进入的 跳转进入此页
            id = this.$route.query.id ||null;
            isShare = false;
            if(!id){
                let { title , collectType , periodDays , price ,  sectionList, isTk , isLimitBuy , createDate , isPreview ,isFree } = this.$route.query;
                this.isAuthor = 1;
                this.isCanRead = 1;
                this.isPreview = true;
                this.title = title;
                this.collectType = collectType;
                this.periodDays = periodDays;
                this.isTk = isTk;
                this.price = price;
                this.isLimitBuy = isLimitBuy;
                this.createDate = this.formatDateTime(createDate);
                this.isFree= isFree;
                for(let i in sectionList){
                    sectionList[i].freePart = sectionList[i].freePart.replace(/(\r\n)|(\n)/g, "<br>");
                    sectionList[i].payPart = sectionList[i].payPart.replace(/(\r\n)|(\n)/g, "<br>");
                    sectionList[i].createDate = this.formatDateTime(sectionList[i].createDate);
                }
                this.sectionList = sectionList;
            }
        }

        this.id = id;
        this.isShare = isShare;
        if(!this.isPreview){
            this.getInfoDetail(id);
        }

        this.checkMarketPoint(2)
    },
    methods:{
        /**
         * 料集市进来的埋点
         * evnet  1 进入料集市  2 进入料详情  3 购买操作  4 点击关注
         * */
        checkMarketPoint(event){
            // 料集市进来的埋点
            if(sessionStorage.getItem('isFeedMarketEnter') == 1){
                // event 2 =>  进入料详情
                marketPoint({event:event}).then(res=>{})
            }
        },
        // 转换时间
        formatDateTime(inputTime) {  
            var date = new Date(inputTime);
            var y = date.getFullYear();  
            var m = date.getMonth() + 1;  
            m = m < 10 ? ('0' + m) : m;  
            var d = date.getDate();  
            d = d < 10 ? ('0' + d) : d;  
            var h = date.getHours();
            h = h < 10 ? ('0' + h) : h;
            var minute = date.getMinutes();
            var second = date.getSeconds();
            minute = minute < 10 ? ('0' + minute) : minute;  
            second = second < 10 ? ('0' + second) : second; 
            return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;  
        },
     /**
     * 获取料信息详情
     */
        async getInfoDetail(id) {
            Indicator.open({  text: "加载中..." });
            try {
                var res = await api.writingInfo({
                    id: id
                });
                setTimeout(() => {
                    Indicator.close();
                }, 600);
                if (res.code == 200) {
                    let { createDate,canRead,isAuther,period,periodDays,isFree,auther ,timeLimit,isEnd,picNum,wordNum,moneyBack,isFan, title ,subscribe,price,sectionList,remainDays,topicKey,userSubscriberDto} = res.result;
                    this.createDate = createDate;
                    this.title = title;
                    this.price = price/100;
                    this.isFan = isFan;
                    this.isCanRead = canRead;
                    this.isAuthor = isAuther;
                    this.isTk = moneyBack==1?true:false;
                    this.textCount = wordNum;
                    this.picCount = picNum;
                    this.auther = auther;
                    this.isFree = isFree;
                    this.collectType = period;
                    this.periodDays = periodDays;
                    this.isLimitBuy = timeLimit==1?true:false;
                    this.subscribe = subscribe;
                    this.topicKey = topicKey;
                    this.remainDays = remainDays;
                    this.period =  period;
                    this.userSubscriberDto = userSubscriberDto;
                    this.expired = userSubscriberDto.expired;
                    
                    for(let i in sectionList){
                        sectionList[i].freePart = sectionList[i].freePart.replace(/(\r\n)|(\n)/g, "<br>");
                        sectionList[i].payPart = sectionList[i].payPart.replace(/(\r\n)|(\n)/g, "<br>");
                    }
                    this.sectionList = sectionList;
                    // this.getSublist();
                }
                if (res.code == 50005) {
                    this.isEnd = 1;
                }
            } catch (e) {
                Indicator.close();
            }
        },

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
        } ,
        //支付金额大于500的订阅弹框
        paySuggest2(){
            MessageBox({
                title: '温馨提示',
                message: '大金额订阅，用支付宝付款更安全！',
                confirmButtonText:'支付宝支付',
                showCancelButton:true
            }).then(res=>{
                this.isSuggest2 = true;
                if(res=="confirm"){
                    this.jumpAlipay2();
                }
            })
        },

        /**
         * 微信支付
         */
        wxPay(){
            MessageBox.alert('购买功能已停止使用')
            return;
            let that = this;
            this.checkMarketPoint(3)
            api.pingPay({'id':this.id,"type":1}).then(res=>{
                if(res.data.code!=200&&res.data.code!=40006&&res.data.code!=50031){
                    Toast(res.data.message)
                    return;
                }
                if(res.data.code==50031){
                    this.hasRestrict = true;
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
                            that.isCanRead = 1;

                            if(that.subscribe!=1){
                                that.inportShow = true;
                            }
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
        
        // ping++支付失败调用聚合支付
        alignPay2(){
            api.alignPay({id:this.id}).then(res=>{
                if(res.data.code==200){
                    this.onBridgeReady(res.data.result.object)
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

        // 支付宝支付
        jumpAlipay() {
            MessageBox.alert('购买功能已停止使用')
            return;
            this.checkMarketPoint(3)
            window.location.href = `../alipay/index.html?a=${encodeURIComponent(
                localStorage.getItem("Authorization")
            )}&b=${this.id}&version=${localStorage.getItem('version')}`;
        },
       //订阅支付宝支付
        jumpAlipay2() {
            if(this.typeId == ''){
                Toast('请选择要订阅的套餐')
                return
            }
            window.location.href = `../alipay/sub.html?a=${encodeURIComponent(
                localStorage.getItem("Authorization")
            )}&b=${this.typeId}&c=${this.auther.userId}&d=${this.id}&version=${localStorage.getItem('version')}`;
        },
        //订阅弹框关闭
        close(){
            this.hasSub = false
            this.hideAmite()
        },
        // 微信支付
        wxPay2(){
            if(this.typeId == ''){
                Toast('请选择要订阅的套餐')
                return
            }
            let that = this;
            api.subPay({'subscriberId':this.auther.userId,"type":1,"typeId":this.typeId,"topicId":this.id}).then(res=>{
                if(res.data.code!=200&&res.data.code!=40006&&res.data.code!=50031&&res.data.code != 50032){
                    Toast(res.data.message)
                    this.hasSub= false;
                    return;
                }
                if(res.data.code==40006){
                    login(api)
                    return;
                }
                if(res.data.code == 50032){ //重复订阅
                        this.hasSub= false;
                        this.expired = false;
                        this.isFan=1
                        return 
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
                            that.hasSub= false;
                            that.expired = false;
                            that.hideAmite();
                            that.isCanRead = 1;
                            that.isFan=1
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
        //订阅按钮
        goSub(){
            this.hasSub = true;
            this.showAmite();
        },
        //弹框选择
        check(index,typeId,subprice){
            if( index === this.checkindex ){
                this.checkindex = '';
                this.typeId = '';
                this.subprice ='';
            } else{
                this.checkindex = index
                this.typeId = typeId
                this.subprice = subprice/100
            }
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
                this.checkMarketPoint(4)
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
        /**
        * 跳转纠纷投诉
        */
        toOpenComplain() {
            this.$router.push({
                path: `/complain`,
                query: { key: this.topicKey }
            });
        },
        /**跳转到作者主页 */
        toAuthorHome(){
            this.$router.push({
                path:'/userhome',
                query:{id:this.auther.userId}
            })
        },
        // 关闭预览
        closePreview(){
            this.$router.back()
        },
        // // 刷新
        // refrsh(){
        //     this.getInfoDetail(this.id);
        //     this.hasSub= false
        // },
        // 赚佣金
        makeMoney(){
            if(this.isCanRead!=1){
                Toast('请先购买该料，再分享并获得佣金')
                return;
            }
            this.$router.push({
                path:'/newposter',
                query:{
                    isDistribution:true,
                    id:this.id
                }
            })
        },
        //查询订阅套餐信息
        getSublist(){
            api.getSubtype({userId: this.auther.userId}).then(res=>{
                if(res.data.code == 200){
                    this.subList = res.data.result
                    this.typeId = res.data.result[0].id
                    this.subprice = res.data.result[0].subprice/100
                }
            })
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
        // 显示动画
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
        background-color: #fff;
        min-height: 100vh;
    }
    .wrapper.padding-btm{
        padding-bottom: 130px;
    }
    .floor-tip{
        background-color: rgba(243,68,52,0.1);
        height: 80px;
        line-height: 80px;
        color: #F34434;
        font-size: 26px;
        padding-left: 26px;
    }
    // 限制说明
    .mask {
        width: 100%;
        height: 100vh;
        position: fixed;
        opacity: 0.4;
        top: 0;
        left: 0;
        background-color: #000;
        z-index: 99;
    }
    .mask-content {
        background-color: #fff;
        height: 318px;
        width: 630px;
        z-index: 100;
        position: fixed;
        top: 35%;
        left: 8%;
        border-radius: 8px;
        box-shadow: 0 40px 80px rgba(0, 0, 0, 0.25);
    }
    .preview-tip{
        line-height: 80px;
        font-size: 26px;
        color:#E8914E ;
        background-color: rgb(246,240,219);
        border-bottom:1px solid rgb(231,226,210);
        text-align: center;
        font-weight: bold;
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
            
            .flex-wrap{
                justify-content: flex-start;
                align-items: center;
                text-align: center;
                
                div{
                    margin-right: 40px;
                    padding:40px 0 30px;
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
        border:1px solid rgba(0,0,0,0.06);
        background-color: rgba(244,244,248,1);
        margin: 24px 20px 14px;
        border-radius: 8px;
        img{
            width:72px;
            height: 72px;
            border-radius: 50%;
        }
        .user-info{
            flex:1;
            margin:0 20px;
            overflow: hidden;
            .nickname{
                font-weight: bold;
                @include singleEls;
                @include fontStyle(46px,28px,#333 );
            }
            .is-vip{
                @include fontStyle(34px,24px,#E9B30D );
                font-weight: bold;
                img{
                    width:36px;
                    height:36px;
                    vertical-align: middle;
                }
            }
        }
        .statusbtn{
            display: flex;
            .gosub{
                background-color: #F34434;
                margin-left: 16px;
                color: #fff;
            }
            .hassub{
                margin-left: 16px;
            }
        }
        
        button{
            height:72px;
            padding: 0 26px;
            background: #fff;
            border-radius: 8px;
            font-size: 28px;
            // border:1px solid rgba(0,0,0,0.06);
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
    // 料信息
    .feed-info{
        padding: 0 40px 30px;
        background-color: #fff;
        .update-tip{
            color:#333;
            font-size: 28px;
            font-weight: bold;
            line-height: 46px;
            padding: 30px  0 10px;
        }
        
        h5{
            color:#999;
            font-size: 24px;
            padding-top:26px;
            line-height: 34px;
        }
        .free-area,.buy-area{
            .text-area{
                color:#666;
                font-size:28px;
                line-height: 52px;
                word-break: break-all;
            }
            .imgs-area{
                img{
                    width:100%;
                    border-radius: 8px;
                }
            }
        }
        .free-area{
            margin-bottom:60px;
        }
        .need-payment{
            padding: 20px 60px 50px;
            .flex-wrap{
                padding: 50px 0;
                justify-content: space-around;
                align-items: center;
                .space{
                    width:1px ;
                    border-left:1px solid #eee;
                    height:100px;
                }
                p{
                    text-align: center;
                    color:#407FE7;
                    font-size:28px;
                    line-height: 46px;
                    margin-top:16px;
                }
                .circle{
                    width:160px;
                    height:160px;
                    border-radius: 80px;
                    background: #407FE7;
                    position: relative;
                    text-align: center;
                    span{
                        position: absolute;
                        top:0;
                        height:60px;
                        padding: 0 20px;
                        line-height: 60px;
                        border-radius: 30px;
                        font-size:28px;
                        border:6px solid #fff;
                        box-sizing: border-box;
                        left:120px;
                    }
                    i{
                        line-height: 160px;
                        color:#fff;
                        font-size: 55px;
                    }
                }
                .text{
                    .circle{
                        span{
                            background: #ECF2FD ;
                            color:#407FE7;
                        }
                    }
                }
                .picture{
                    .circle{
                        background-color: #F88629 ;
                        span{
                            color:#F88629;
                            background-color: #FFF3EA ;
                        }
                    }
                    p{
                        color:#F88629;
                    }
                    
                }
            }
            .lock{
                text-align: center;
                color:#666;
                font-size:28px;
                i{
                    font-size: 28px;
                    margin-right: 10px;
                }
                margin :20px 0 100px;
            }
        }
    }
    // 关注公众号引导
    .guide{
        text-align: center;
        padding: 80px;
        background-color: #fff;
        // box-shadow: 0 -0.5px 0 0 rgba(0,0,0,0.2);
        border-top:1px solid rgba(0,0,0,0.06);
        &.padding-btm{
            padding-bottom:180px;
        }
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
        padding: 0 20px 100px;
        background-color: #fff;
        button{
            font-size: 26px;
            color:#666;
            background: #fff;
            width:100%;
            height:88px;
            border:1px solid rgba(0,0,0,0.06);
            border-radius: 8px;
            font-weight: bold;
        }
    }
    .btns{
        padding: 20px  20px 40px 20px;
        background-color: #fff;
        border-top:1px solid rgba(0,0,0,0.06);
        border-bottom:1px solid rgba(0,0,0,0.06);
    }
    // 预览底部按钮
    .pre-view{
        position: fixed;
        width:100%;
        bottom:0;
        left:0;
        box-sizing: border-box;
        .preview{
            color:#666;
            background-color: #fff;
            border:1px solid rgba(0,0,0,0.06);
            font-weight: bold;
            width:100%;
            border-radius: 8px;
            height: 88px;
            font-size: 26px;
        }
    }
    //包时段功能下线按钮
    .periodbtn{
        width: 100%;
        height: 88px;
        background-color: #fff;
        border: 1px solid #f3f3f3;
        color: #666;
        font-size: 26px;
    }
    // 支付按钮
    .pay-area{
        justify-content: space-between;
        position: fixed;
        bottom:0;
        width:100%;
        border-bottom:none;
        padding-bottom:40px;
        button{
            height:88px;
            border-radius: 8px;
            flex: 1;
            color:#fff;
            font-weight: bold;
            &:nth-child(2){
                margin-left: 20px;
            }
            &:nth-child(3){
                margin-left: 20px;
            }
        }
        .ali-pay{
            background-color: #407FE7 ;
        }
        .wx-pay{
            background-color: #58CC81 ;
        }
        .sub-pay{
            background-color: #F34434;
        }
    }
    // 去赚佣金按钮
    .share-sell{ 
        border-bottom:none;
        button{
            width:100%;
            height: 88px;
            border-radius: 8px;
            background: #F34434 ;
            color:#fff;
            font-size: 28px;
            font-weight: bold;
            i{
                font-weight: normal;
                font-size: 28px;
                margin-right: 10px;
            }
        }
    }
    // 过期提示
    .lose-effect {
        padding : 200px 0 60px;
        font-size: 30px;
        color: #999;
        text-align: center;
        img {
            width: 570px;
            height: 333px;
        }
    }
    // 返回首页
    .back-home{
        position: fixed;
        right:0;
        top:60%;
        width:74px;
        height: 150px;
        z-index:5;
        img{
            width:100%;
        }
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
        bottom:-756px;
        left: 0;
        z-index: 1000;
        width: 100%;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
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
        .mark-price{
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

