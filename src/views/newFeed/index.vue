<template>
    <div class="container">
        <div class="wrapper-all"  v-if="false">
            <div class="mask" v-if="hasRestrict"></div>
            <div class="mask-content" v-if="hasRestrict">
                <p class="content-title">账号异常</p>
                <p class="content-wxchat">请联系客服微信: renrenyouliao888</p>
                <p class="confire" @click="confire">确定</p>
            </div>
            <div class="wrapper" >

                <v-noticebar @showbar="showNoticeBar"></v-noticebar>

                <div :class="isShowNoticeBar==1?'container1':'container'">
                    <div class="notice flex-wrap" @click="showHelp(3)" v-show="isNew">
                        <i class="iconfont">&#xe6a5;</i>
                        <span>标题规范 - 如何稳定拥有收入</span>
                        <i class="iconfont">&#xe68d;</i>
                    </div>
                    <!-- 更新料的标题 -->
                    <div class="update-title flex-wrap" v-show="!isNew">
                        <div class="left">
                            <p>{{updateTitle}}</p>
                            <p class="icon" v-show="period==1"><i class="iconfont">&#xe691;</i>包 {{periodDays}} 天</p>
                        </div>
                        <div class="right">
                            <i class="iconfont">&#xe6a6;</i>{{updatePrice}}
                        </div>
                    </div>
                    <div class="info-content">
                        <div class="title" v-show="isNew">
                            <h3>主标题</h3>
                            <input type="text" name=""  v-model="title" placeholder="加个标题吧~（不超过18个字符）" maxlength="18">
                        </div>
                        
                        <p class="xiline" v-show="isNew"></p>
                        <!-- 免费区 -->
                        <div class="full-content">
                            <h3 class="flex-wrap"><span>免费内容</span> <i class="iconfont" @click="isShowFreeT = !isShowFreeT">{{isShowFreeT?'&#xe68a;':'&#xe68b;'}}</i> </h3>
                            <textarea placeholder="尽情发挥吧" rows="6" v-model="freeT"  v-show="isShowFreeT"></textarea>
                        </div>
                        <p class="xiline"></p>
                        <!-- 付费区 -->
                        <div class="full-content">
                            <h3 class="flex-wrap"><span>付费内容</span>  </h3>
                            <textarea placeholder="尽情发挥吧" rows="6" v-model="buyT"></textarea>
                            <div class="img-area">
                                <div class="img-group flex-wrap" v-show="buyImgs.localId.length!=0">
                                    <template v-for="(src,index) in buyImgs.localId" v-key="index">
                                        <div class="img-item" :key="index">
                                            <img :src="src" alt="" >
                                            <span @click="delImg(index)"><i class="iconfont">&#xe693;</i></span>
                                        </div>
                                    </template>
                                </div>
                                <p class="add-icon" @click="chooseImg()">
                                    <i class="iconfont">&#xe69e;</i>
                                    <span>添加图片</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- 付费方式 -->
                    <div class="pay-type-area" v-show="isNew">
                        <p class="tip">付费方式 · 2选1</p>
                        <div class="pay-content">
                            <div class="select flex-wrap">
                                <div class="select-option" :class="collectType=='0'?'cur':''" @click="chooseCollect('0')">
                                    <span>单卖</span>
                                </div>

                                <div class="select-option" :class="collectType=='1'?'cur':''" @click="chooseCollect('1')">
                                    <span>包时段</span>
                                </div>
                            </div>
                            <p class="xiline"></p>
                            <!-- 单卖 -->
                            <div class="single-selling" v-show="collectType=='0'">
                                <h4 class="title">金额</h4>
                                <input type="number" placeholder="填写金额 · 元，0则为免费" @input="inputMoney($event,'sign')"  v-model="signMoney">
                                <p class="xiline"></p>
                                <!-- 分销 -->
                                <!-- <div class="distribution">
                                    <h4 class="title">分销</h4>
                                    <div class="flex-wrap">
                                        <p class="desc">
                                            开启后其他用户可分销此料，每成交1单平台收取30%（待定）的服务费，佣金可自由设置，最低15%.
                                        </p>
                                        <mt-switch v-model="isDistribution"></mt-switch>
                                    </div>
                                    <input v-show="isDistribution" type="number" v-model="distributionMoney" placeholder="填写金额 · 元">
                                </div> -->

                                <p class="xiline"></p>
                                <h4 class="title flex-wrap limit-switch">
                                    <p>
                                        <span>限时售卖</span>
                                        <i class="iconfont" @click="showHelp(2)">&#xe6a1;</i>
                                    </p>
                                    <mt-switch v-model="limitBuy"></mt-switch>
                                </h4>
                                
                                <!-- <h4 class="title"> -->
                                    
                                        <!-- <span>到期时间</span> -->
                                        <!-- <i class="iconfont" @click="showHelp(2)">&#xe6a1;</i> -->
                                    
                                    <!-- <mt-switch v-model="limitBuy"></mt-switch> -->
                                <!-- </h4> -->

                                <p class="xiline" v-show="limitBuy"></p>
                                <!-- <p class="xiline"></p> -->
                                <div class="limit flex-wrap faster" v-show="limitBuy">
                                    <div class="limit-date  flex-wrap" @click="showChooseDate">
                                        <span>{{chooseDateStr==''?'购买截止日期':chooseDateStr}}</span>
                                        <i class="iconfont">&#xe68b;</i>
                                    </div>
                                    <div class="limit-time  flex-wrap" @click="showChooseTime">
                                        <span>{{chooseTimeStr==''?'购买截止时间':chooseTimeStr}}</span>
                                        <i class="iconfont">&#xe68b;</i>
                                    </div>
                                </div>

                                <p class="xiline"></p>
                                <div class="tk flex-wrap">
                                    <h4 class="title">不中必退</h4>
                                    <div class="flex-wrap">
                                        <p>需要买家在比赛结束后确认中或不中才可手动退款</p>
                                        <mt-switch v-model="isAllowTk"></mt-switch>
                                    </div>
                                </div>
                            </div>

                        <!-- 包时段 -->
                        <!-- <div class="packet-period" v-show="collectType=='1'">
                            <div class="packet-period-condition">
                                <p class="desc">支持资源更新，卖家从支付日起，在包时段内可以看到卖家的更新内容</p>
                                <h4>时长</h4>
                                <div class="flex-wrap">
                                    <span @click="choosePeriodType(7)" :class="customDay==7?'active':''">包周</span>
                                    <span @click="choosePeriodType(30)" :class="customDay==30?'active':''">包月</span>
                                    <span :class="customDay!=7&&customDay!=30?'active':''" @click="choosePeriodType('')">自定义</span>
                                </div>
                            </div>
                        </div> -->
                        <div class="packer-period" v-show="collectType=='1'">
                            <div class="packer-title"><i class="iconfont">&#xe6d1;</i></div>
                            <div class="pakcer-main"><div class="main-main">订阅与包时段功能均已下线，套餐将无法订阅，已订阅的用户可继续在有效期内查看订阅内容，不受影响，过期后不可续订。</div></div>
                        </div>
                    </div>
                </div>
                <!-- 提交按钮 -->
                <div class="btn-area flex-wrap" v-show="collectType!='1'">
                    <button class="create-btn" v-show="isNew" @click="putPosterData(1)">创建</button>
                    <button class="preview-btn" v-show="isNew" @click="putPosterData(2)"> <i class="iconfont">&#xe697;</i> 预览</button>
                    <button class="update-btn" v-show="!isNew" @click="updatePoster()">更新</button>
                </div>


                    <div class="modal" v-show="modalShow">
                        <div class="modal-content" >
                            <div class="modal-title" v-show="modalShowType==2">限时售卖</div>
                            <div class="modal-title" v-show="modalShowType==1">包时段说明</div>
                                <div class="modal-title" v-show="modalShowType==3">提示</div>
                            <div class="modal-list-g" v-show="modalShowType==1">
                                <div class="modal-list">· 卖家设置的时长是卖家可读取料的时长。</div>
                                <div class="modal-list">· 不同买家，在不同时间购买此料，会在各自对应的时长内有效。</div>
                                <div class="modal-list">· 卖家创建包时段料后，不可修改价格。</div>
                                <div class="modal-list">· 卖家可在【我的料】中找到包时段的料进行内容的更新。</div>
                                <div class="modal-list">· 卖家可在收益明细中看到买家买入的时间，并且保证买家买到的料在有效期内获得更新。</div>
                            </div>

                            <div class="modal-list-g" v-show="modalShowType==2">
                                <div class="modal-list">· 卖家设定为【否】时，买家对于购买的料的内容读取无时间限制。</div>
                                <div class="modal-list">· 卖家设定为【是】并选择了限时打开，买家只能在设定的时间内付款打开，过了设定的时间，买家无法购买。</div>
                                <div class="modal-list">举个例子：卖家设定单料读取的时间是2018年5月14日8点30分，那么买家在2018年5月14日8点30分前都可以购买此料，超过8点30分无法购买。</div>
                                <div class="modal-list">· 该设定只对单卖有效。</div>
                            </div>
                            <div class="modal-list-g" v-show="modalShowType==3">
                                <div class="modal-list">· 敬请大家在新建料的标题中严禁使用且包含“ <span>足彩</span> 、<span>竞彩</span>、<span>彩票</span>、<span>亚盘</span>、<span>足球</span>、<span>大小球</span>、<span>盘口</span>”等敏感词汇。</div>
                                <div class="modal-list">· 如有发现，人人有料平台有权对其料进行下架和删除处理，感谢大家的配合。</div>
                            </div>
                            <div class="btn"><button @click="modalShow=false">确定</button></div>
                        </div>
                    </div>


                        <!--时间日期组件 -->
                    <mt-datetime-picker
                    @confirm="chooseDate"
                    type="date"
                    ref="datapicker"
                    year-format="{value} 年"
                    month-format="{value} 月"
                    date-format="{value} 日"
                    :startDate="curDate"
                    >
                    </mt-datetime-picker>
                    <mt-datetime-picker 
                        @confirm="chooseTime"
                    type="time"
                    ref="timepicker"
                    hour-format="{value} 时"
                    minute-format="{value} 分"
                    :startHour="(chooseDateStamp==''||chooseDateStamp==getCurStamp)?curDate.getHours()+1:0"
                    >
                    </mt-datetime-picker>
                    <v-footer></v-footer>
                </div>
            </div>
        </div>

        <p class="notice_close">人人有料已关闭服务器，请关注【有料推荐】，不定时派送免费球料福利。祝大家新春大吉！</p>
    </div>
</template>
<script>
import Footer from "com/footer";
import { Indicator, DatetimePicker, Toast,MessageBox } from "mint-ui";
import { api } from "api/newFeed.js";
import {login } from "@/api/login.js"
import {GetQueryString} from "@/api/getCode.js"

import  noticeBar  from "@/components/noticeBar.vue"

export default {
    components:{
        "v-footer": Footer,
        'v-noticebar':noticeBar
    },
    data(){
        return{
            // 预加载id
            preId:'',
            // 模态框
            modalShow:false,
            // 模态框提示 1包时段说明  2限时售卖  3注意事项
            modalShowType:1,
            // 是否是新建料
            isNew:true,
            // 标题
            title:'',
            // 免费输入的内容
            freeT:'',
            // 隐藏免费输入区域
            isShowFreeT:false,
            // 付费区域
            buyT:'',
            buyImgs: {
                localId: [],
                serverId: []
            },
            // 是否开启分销
            isDistribution:false,
            // 是否限时售卖
            limitBuy:false,
            // 是否不中退款
            isAllowTk:false,
            // 收费方式
            collectType:0,
            // 单卖金额
            signMoney:'',
            // 自定义天数
            customDay:'',
            // 包时段金额
            periodMoney:'',
            // 当前时间
            curDate:new Date(),
            // 选择的日期字符串
            chooseDateStr: "",
            // 选择的日期时间戳
            chooseDateStamp: "",
            // 选择的时间
            chooseTimeStr: "",
            // 更新料的标题
            updateTitle:'',
            // 更新料的id
            parentId:'',
            // 更新料的价格
            updatePrice:0,
            // 更新料包时间段的天数
            periodDays:0,
            // 料的类型、 0单卖   1包时段
            period:0,
            // 分销佣金
            distributionMoney:'',
            // 维护通知的内容和状态
            isShowNoticeBar:0,
            hasRestrict: false

        }
    },
    computed: {
        // 获取当前时间戳
        getCurStamp: () => {
            var nowDate = new Date();
            var year = nowDate.getFullYear();
            var month =
                nowDate.getMonth() + 1 < 10
                ? "0" + (nowDate.getMonth() + 1)
                : nowDate.getMonth() + 1;
            var day =
                nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
            return new Date(`${year}-${month}-${day}`).getTime();
        }
        ,
    },
    watch:{
         
    },
    created(){
        // this.isRestrict();
        if (this.$route.query.updateId) {
            this.updateTitle = this.$route.query.updateTitle;
            this.isNew = false;
            this.parentId = this.$route.query.updateId;
            this.updatePrice = this.$route.query.updatePrice/100;
            this.periodDays = this.$route.query.updataDay;
            this.period = this.$route.query.period;
        } else {
            this.isNew = true;
        }
        
        // login(api).then(res=>{
        //     this.getWxConfig();
        //     this.getPreId(res);
        // }).catch(err=>{
        //    this.getWxConfig();
        //    this.getPreId(''); 
        // })
    },

    beforeRouteEnter(to, from, next) {
        console.log(from.path)
        // 如果从详情页、默认首页、料的列表页跳回来 需要缓存此页面
        if(from.path=="/info-detail"||from.path=="/"||from.path=="/info-detail-list"){
            to.meta.keepAlive = true;
        }else{
            to.meta.keepAlive = false;
        }
            
        next();
    },
    
    methods:{
    isRestrict() {
      //是否被限制
      api.isRestrict().then(res => {
        if (res.data.result.accountStatus == -2) {
          this.hasRestrict = true;
        }
      });
    },
    confire() {
      this.$router.replace('/myInfo');
    },
        // 监听是否显示维护公告
        showNoticeBar(val){
            this.isShowNoticeBar =  val;
        },
        // 监听输入金额
        inputMoney(e,t){
             
            let val  = e.target.value
            if(val == '') {
                 e.target.value = '';
            } else {
                // 如果有小数点
                if(val.indexOf('.')>=0){
                    if(val.split(".")[1].length>2){
                       if(t=='sign') {this.signMoney = `${val.split(".")[0]}.${val.split(".")[1].substring(0,2)}`;}  
                       if(t=='period' ) {this.periodMoney = `${val.split(".")[0]}.${val.split(".")[1].substring(0,2)}`;} 
                    }
                    if(val>=1){
                        if(val[0]=="0" && val!="0"){
                            if(t=='sign') {this.signMoney = val.substring(1,val.length);}  
                            if(t=='period' ) {this.periodMoney = val.substring(1,val.length);}
                        }
                    }
                    // if(val<=1&&val!='0'){
                    //     if(t=='sign') {this.signMoney = '';}  
                    //     if(t=='period' ) {this.periodMoney ='';}
                    //     Toast('应微信平台管控要求，定价请大于1元。');
                    // }
                }else{
                    // 如果没有小数点
                    if(val[0]=="0" && val!="0"){
                        if(t=='sign') {this.signMoney = val.substring(1,val.length);}  
                        if(t=='period' ) {this.periodMoney = val.substring(1,val.length);}
                    }

                }

            }
            
        },
         // 获取预加载id
        getPreId(url='') {
            Indicator.open();
            api.getPreId().then(res => {
                Indicator.close();
                if (res.data.code != 200) {
                    return;
                }
                this.preId = res.data.result;

                if(url!=''){
                    window.location.replace(url);
                    return;
                }

                // 登录火眼公众号
                let reloadUrl = sessionStorage.getItem('reload_url');
                if(!reloadUrl){return;}
                let code = GetQueryString('code');
                if(code&&code!=''){
                    api.wxLogin2({code:code}).then(res=>{
                        if(res.data.code==200){
                            sessionStorage.removeItem('reload_url');
                            window.location.replace(reloadUrl);
                        }
                    })
                } 
            })
            .catch(err => {
                Indicator.close();
            });
        },
        // 获取当前地址栏地址
        getLocationHref() {
            let href = window.location.href;
            let sliceIndex = href.indexOf("#");

            if (sliceIndex >= 0) {
                href = href.slice(0, sliceIndex);
            }
            return href;
        },
        // 获取微信配置api
        getWxConfig() {
            Indicator.open();
            api.getWxConfig({ url: this.getLocationHref() }).then(res => {
                Indicator.close();
                if (res.data.code == 200) {
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: res.data.result.appid, // 必填，公众号的唯一标识
                    timestamp: res.data.result.timestamp, // 必填，生成签名的时间戳
                    nonceStr: res.data.result.nonceStr, // 必填，生成签名的随机串
                    signature: res.data.result.signature, // 必填，签名
                    jsApiList: [
                    "chooseImage",
                    "previewImage",
                    "uploadImage",
                    "downloadImage",
                    "getLocalImgData"
                    ] // 必填，需要使用的JS接口列表
                });
                }
            }).catch(()=>{
                Indicator.close();
            });
        },
        // 选取图片
        chooseImg() {
            wx.chooseImage({
                count: 9, // 默认9
                sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
                success: res => {
                var localIds = res.localIds;
                // alert(localIds[0]) // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                    if (this.buyImgs.localId.length + res.localIds.length > 9) {
                        Toast(`你最多还可上传${9 - this.buyImgs.localId.length}张图片`);
                        return;
                    }
                    this.buyImgs.localId = [...this.buyImgs.localId, ...res.localIds];

                    this.uploadImg(res.localIds);

                },
                fail: err => {
                    console.log(err);
                }
            });
        },
        // 上传图片
        uploadImg( serverIds) {
            let i = 0;
            var upload = () => {
                wx.uploadImage({
                    localId: serverIds[i],
                    success: res => {
                        this.buyImgs.serverId.push(res.serverId);
                        i++;
                        i < serverIds.length && upload();
                    },
                    fail: function(res) {
                        Toast(JSON.stringify(res));
                    }
                });
            };
            upload();
        },


        /**上传图片serverId到后台
         * @first 是否是上传第一张图片
         * @serverIds  图片的服务器id数组
         * @sectionId 创建料返回的 料的sectionId
         * @isNew  是否是新建料 true：是   false：更新料
         * @feedId:料的id
         */
        uploadServerImgId(first, serverIds ,sectionId ,isNew,feedId='') {
            api.upLoadPic({
                id: sectionId,
                type:   1,
                mediaId: serverIds
            }).then(res => {
                if (res.data.code == 200) {
                    if(first){
                        this.buyImgs.serverId.shift();
                        if(this.buyImgs.serverId.length!=0){
                            this.uploadServerImgId(false, this.buyImgs.serverId,sectionId,isNew,feedId )
                        }else{
                            if(isNew){
                                this.$router.push({
                                    path:'/newposter',
                                    query:{id:feedId}
                                })
                            }else{
                                this.$router.replace("/myInfo");
                            }
                        }
                    }else{
                      this.$router.push({
                            path:'/newposter',
                            query:{id:feedId}
                        })
                    }
                }else{
                    Toast(res.data.message)
                }
            }).catch(err => {});

        },


        // 检验数据 / 预览       // 生成海报 t:1 创建 t:2预览
        putPosterData(t){
            MessageBox.alert('建料功能已停止使用')
            return;
            if(this.title.replace(/(^\s*)|(\s*$)/g, "")==''){
                Toast('请输入主标题')
                return;
            }
            if(this.buyT.replace(/(^\s*)|(\s*$)/g, "")==''&&this.buyImgs.serverId.length==0){
                Toast('请添加付费内容或图片')
                return;
            }
            // 单卖
            if(this.collectType==0){
                if(this.signMoney===''){
                    Toast('请输入单卖金额')
                    return;
                }
                if(this.signMoney<=1 && this.signMoney!='0'){
                    this.signMoney = '';   
                    Toast('应微信平台管控要求，定价请大于1元。');
                    return;
                }
                if(this.signMoney>=1000){
                    this.signMoney = '';   
                    Toast('单价不可超过1000元。');
                    return;
                }
                // 限时售
                if(this.limitBuy){
                    if(this.chooseDateStr=='' || this.chooseTimeStr==''){
                        Toast("请选择限时售卖的日期和时间");
                        return;
                    }
                }
                // 开启佣金
                // if(this.isDistribution){
                //     if(this.distributionMoney===''){
                //         Toast('请输入分销佣金')
                //         return;
                //     }
                //     if(isNaN(this.distributionMoney)){
                //         Toast('请输入正确的分销佣金')
                //         return;
                //     }
                //     if (this.distributionMoney < 0) {
                //         Toast("分销佣金不能小于0元");
                //         return;
                //     }
                //     let dotIndex = this.distributionMoney.indexOf(".");
                //     if (dotIndex >= 0 && this.distributionMoney.slice(dotIndex + 1).length > 2) {
                //         Toast("金额最多有两位小数");
                //         return;
                //     }
                // }
            }
            // 包时间段
            if(this.collectType == 1){
                let reg=/^[1-9]\d*$/;
                if(!reg.test(this.customDay)){
                    Toast('请选择或输入正确的包时段天数');
                    return;
                }
                // if(this.customDay==''){
                //     Toast('请选择或输入包时段天数');
                //     return;
                // }
                // if(isNaN(this.customDay)){
                //     Toast('请选择或输入正确的包时段天数');
                //     return;
                // }
                // if(this.customDay%1!=0){
                //     Toast('天数只能为整数');
                //     return;
                // }
                if(this.periodMoney==''||this.periodMoney==0){
                    Toast('请输入包时段金额')
                    return;
                }
                if(this.periodMoney<=1 && this.periodMoney!='0'){
                    this.periodMoney = '';   
                    Toast('应微信平台管控要求，定价请大于1元。');
                    return;
                }
            }
            if(t==2) {
                
                this.$route.meta.keepAlive = true;
                this.$router.push({
                    path: '/info-detail',
                    query:{
                        title:this.title,
                        collectType:this.collectType,
                        periodDays:this.collectType==1?this.customDay:'',
                        price:this.collectType=="0"?this.signMoney:this.collectType==1?this.periodMoney:'0',
                        isTk:this.isAllowTk,
                        isLimitBuy:this.limitBuy,
                        createDate:new Date().getTime(),
                        sectionList:[{createDate:new Date().getTime(),freePart:this.freeT,payPart:this.buyT,pictureList:this.buyImgs.localId}],
                        isPreview:true,
                        isFree:(this.collectType=='0'&&this.signMoney=="0")?1:0
                    }
                })
            } else {
                this.createPoster();
            }
        },

        // 提交海报
        createPoster(){
            this.$route.meta.keepAlive = false;

            Indicator.open('正在提交');
            api.newPoster({
                id: this.preId,
                title: this.title,
                freePart: this.freeT,
                payPart: this.buyT,
                price: this.collectType==0?(this.signMoney * 100).toFixed(0):this.collectType==1?(this.periodMoney * 100).toFixed(0):0,
                period: this.collectType,
                periodDays: this.customDay,
                timeLimit: this.limitBuy?1:0,
                timeLimitTime: (this.limitBuy && this.collectType==0)  ? `${this.chooseDateStr} ${this.chooseTimeStr}:00` : null,
                moneyBack: this.isAllowTk ? 1 : 0,
                isFree:(this.collectType=='0'&&this.signMoney=="0")?1:0,
                isDistribution:this.isDistribution?1:0,
                commission:this.isDistribution ? this.distributionMoney : null
            }).then(res=>{
                Indicator.close();
                if(res.data.code==200){
                    if(this.buyImgs.serverId.length!=0){
                        this.uploadServerImgId(true, [this.buyImgs.serverId[0]] ,res.data.result.sectionId,true,res.data.result.id)
                    }else{
                        this.$router.push({
                            path:'/newposter',
                            query:{id:res.data.result.id}
                        })
                    }
                    
                }else{
                    Toast(res.data.message)
                }
            }).catch(err=>{
                Indicator.close();
            })
        },

        // 更新海报
        updatePoster(){
            MessageBox.alert('追加更新功能已停止使用')
            return;
            if(this.buyT==''&&this.buyImgs.localId.length==0){
                Toast('付费内容不能为空');
                return;
            }
            api.updatePoster({
                freePart: this.freeT,
                payPart: this.buyT,
                id: this.parentId
            }).then(res => {
                Indicator.close();
                if (res.data.code == 200) {
                    Toast("更新成功");
                    if(this.buyImgs.serverId.length!=0){
                        this.uploadServerImgId(true, [this.buyImgs.serverId[0]] ,res.data.result.sectionId,false,res.data.result.id)
                    }else{
                        this.$router.push({
                            path:'/newposter',
                            query:{id:res.data.result.id}
                        })
                    }
                } else {
                    Toast(res.data.message);
                }
            }).catch(err => {
                Indicator.close();
            });
        },
        // 删除付费的预览图片
        delImg(type, index) {
            this.buyImgs.localId.splice(index, 1);
            this.buyImgs.serverId.splice(index, 1);
        },

        // 选择售卖方式
        chooseCollect(t){
            this.$route.meta.keepAlive = false;
            this.collectType = t;
        },
        // 点击选择比赛时间 弹出日期组件
        showChooseDate() {
            this.$refs.datapicker.open();
        },
        showChooseTime() {
            this.$refs.timepicker.open();
        },
        // 选择开始日期
        chooseDate(date) {
            this.chooseDateStamp = this.getDate(date).datestamp;
            this.chooseDateStr = this.getDate(date).date;
            this.chooseTimeStr = "";
        },
        // 选择开始时间
        chooseTime(time) {
            this.chooseTimeStr = time;
        },
        // 获取选择的时间的时间戳
        getDate(nowDate) {
            var year = nowDate.getFullYear();
            var month =
                nowDate.getMonth() + 1 < 10
                ? "0" + (nowDate.getMonth() + 1)
                : nowDate.getMonth() + 1;
            var day =
                nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
            var dateStr = year + "-" + month + "-" + day;
            return { date: dateStr, datestamp: new Date(dateStr).getTime() };
        },

        // 选择包时间段那类型
        choosePeriodType(d){
           this.customDay =  d&&d!=''? d:'';
        },
        // 显示帮助
        showHelp(n) {
            this.modalShow = true;
            this.modalShowType = n;
        },
    },
    beforeDestroy(){
        Indicator.close();
    }
}
</script>
<style lang="scss" scoped>
/* 弹框样式 */
.mask {
  width: 100%;
  height: 100%;
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
        .desce-info{
                font-size:28px;
                color:$font-red;
                line-height: 46px;
            }
    input::-webkit-input-placeholder ,textarea::-webkit-input-placeholder{
        color: #c8c8c8;
        font-size: 28px;
    }
    .container{
        padding: 20px ;
        padding-bottom:130px;
    }
    .container1{
        padding: 100px 20px 20px ;
        padding-bottom:130px;
    }
    .update-title{
        justify-content: space-between;
        align-items: center;
        padding:  30px 40px;;
        .left{
            color: #333;
            font-size: 30px;
            line-height: 48px;
            font-weight: bold;
            .icon{
                color:#999;
                font-size:24px;
                line-height: 40px;
                font-weight: normal;
                i{
                    font-size: 26px;
                    margin-right: 10px;
                }
            }
        }
        .right{
            color:#F34434;
            font-size: 40px;
            font-weight: bold;
            i{
                font-weight: normal;
            }
        }
    }
    .notice{
        color:#E8914E;
        border-radius: 8px;
        padding:20px 25px;
        background: #F6F0DB ;
        border:0.5px solid #E7E2D2 ;
        justify-content: space-between;
        align-items: center;
        font-size:26px;
        height: 80px;
        box-sizing: border-box;
        span{
            flex:1;
            line-height: 36px;
            position: relative;
            top:5px;
            left:10px;
            font-weight: bold;
        }
    }
    .info-content{
        box-shadow: 0 20px 40px rgba(0,0,0,0.04); 
        background: #fff;
        border-radius: 8px;
        margin-top:20px;
        padding-top: 8px;
        .title{
            padding:0 40px ;
            input{
                padding: 0;
                padding-bottom:28px;
                font-size:28px;
                color:#333;
                width: 100%;
                line-height: 1.5;
            }
        }
        h3{
            padding:30px 0;
            font-size:28px;
            color:#333;
            line-height: 40px;
            font-weight: bold;
            justify-content: space-between;
            align-items: center;
        }
        .full-content{
            padding: 0 40px;
            textarea{
                resize:none;
                border:none;
                width:100%;
                line-height: 1.3;
                padding:0;
                font-size: 28px;
            }
            .add-icon{
                padding-bottom:40px;
                color:#666;
                font-size:28px;
                i{
                    font-size:28px;
                }
            }
            .img-group{
                justify-content: flex-start;
                flex-wrap: wrap;
                // box-sizing: border-box;
                // background: red;
                .img-item{
                    width:184px;
                    height:184px;
                    box-sizing: border-box;
                    border-radius: 8px;
                    overflow: hidden;
                    position: relative;
                    margin-left:39px;
                    margin-bottom:39px;
                    span{
                        position: absolute;
                        width:40px;
                        height:40px;
                        border-radius: 6px;
                        background: rgba(0,0,0,0.5);
                        text-align: center;
                        line-height: 40px;
                        color:#fff;
                        top:6px;
                        right:6px;
                    }
                    img{
                        width: 100%;
                        height: 100%;
                    }
                }
                .img-item:nth-child(3n-2){
                    margin-left:0 ;
                }
            }
        }
    }

    .pay-type-area{
        .pay-content{
            box-shadow: 0 20px 40px rgba(0,0,0,0.04);
            background: #fff;
            border-radius: 8px;
        }
        
        .tip{
            padding:40px 20px 30px;
            color:#999;
        }
        .select{
            align-items: center;
            .select-option{
                width:50%;
                text-align: center;
                font-size:28px;
                color:#999;
                line-height: 96px;
                span{
                  line-height: 28px;  
                  font-size:28px;
                  position: relative;
                  top:2px;
                  font-weight: bold;
                }
                i{
                    font-size:32px;
                    color:#666;
                    padding:10px;
                }
            }
            .select-option.cur{
                color:#333;
                span{
                    border-bottom:4px solid #333;
                    padding-bottom:20px;
                    font-weight: bold;
                }
            }
        }
        // 单卖
        .single-selling{
            padding-top:12px;
            .title{
                padding: 30px 40px;
                color:#333;
                font-size:28px;
                font-weight: bold;
                // line-height: 40px;
                justify-content: space-between;
                align-items: center;
                
                p{
                    i{
                        font-size:32px;
                        vertical-align: middle;
                    }
                }
                .mint-switch{
                    transform: scale(0.76);
                    margin-right: -16px;
                }
            }
            .limit-switch{
                height:96px;
            }
        
            input{
                font-size: 28px;
                color:#333;
                padding: 0 40px 15px;
                width:100%;
                box-sizing: border-box;
                line-height: 1.5;
            }
            //分销
            .distribution{
                .flex-wrap{
                    justify-content: space-between;
                    padding: 0 40px 30px;
                    align-items: flex-start;
                    p{
                        flex:1;
                        line-height: 36px;
                        font-size:26px;
                        color:#999;
                    }
                    .mint-switch{
                        transform: scale(0.76);
                        margin-right:-16px;
                    }
                }
            }
            // 限时
            .limit{
                padding: 30px 0;
                color:#666;
                font-size:28px;
                justify-content: space-between;
                align-items: center;
                height:96px;
                .flex-wrap{
                    justify-content: space-between;
                    align-items: center;
                    width:50%;
                    padding: 0 40px;
                    box-sizing: border-box;
                }
                .limit-date {
                    border-right: 0.5px solid rgba(0, 0, 0,0.07);
                }
                i{
                    vertical-align:middle;
                    color:#666;
                }
                span{
                    position: relative;
                    top:4px;
                }
            }
            // 不中必退
            .tk{
                padding-bottom:30px;
                .flex-wrap{
                    padding: 0 40px;
                    flex-wrap:nowrap;
                    align-items: flex-start;
                    margin-top:-10px;
                    p{
                        flex:1;
                        margin-right:20px;
                        line-height: 36px;
                        font-size:26px;
                        color:#999;
                    }
                    .mint-switch{
                        transform: scale(0.76);
                        margin-right:-16px;
                    }
                }
            }
        }

        // 包时段
        // .packet-period{
        //     padding-bottom:12px;
        //     h4{
        //         padding: 30px 0;
        //         color:#333;
        //         font-size:28px;
        //         font-weight: bold;
        //     }
        //     .packet-period-condition{
        //         padding: 0 40px;
        //         .desc{
        //             color:#999;
        //             font-size:26px;
        //             line-height: 36px;
        //             margin-top: 40px;
        //         }
                
        //         .flex-wrap{
        //             justify-content: space-around;
        //             color:#999;
        //             font-size:26px;
        //             background-color:rgba(51,51,51,0.06);
        //             padding:13px  0 11px;
        //             border-radius: 8px;
        //             span{
        //                 width:190px;
        //                 height:72px;
        //                 border-radius: 8px;
        //                 text-align: center;
        //                 line-height: 80px;
        //                 font-weight: bold;
        //             }
        //             .active{
        //                 background-color:#fff;
        //                 color:#666;
        //                 box-shadow: 0 4px 16px rgba(0,0,0,0.06);
        //             }
        //         }
        //         input{
        //                 padding:40px 0 20px;
        //                 line-height: 1.5;
        //                 width:100%;
        //                 box-sizing: border-box;
        //                 font-size: 28px;
        //         }
        //     }
        //     .price{
        //         padding: 0 40px;
        //         input{
        //             padding:10px 0 10px;
        //             width:100%;
        //             font-size: 28px;
        //             line-height: 1.5;
        //         }
        //     }
        // }
        .packer-period{
            padding: 164px 120px 216px 120px;
            text-align: center;
            font-size: 28px;
            background-color: #fff;
            .packer-title{
                margin-bottom: 28px;
                i{
                    font-size: 56px;
                    color: #666;
                }
            }
            .pakcer-main{
                line-height: 44px;
                color: #666;
                .main-main{
                    text-align: left;
                }
            }
        }
    }
    .btn-area{
        margin :50px 0 30px;
        button{
            height:96px;
            border-radius: 8px;
            font-size:26px;
            font-weight: bold;
        }
        .create-btn{
            flex:1;
            margin-right:20px;
            background-color: #F34434;
            color:#fff; 
            box-shadow:  0 20px 40px  rgba(0,0,0,0.08);
        }
        .preview-btn{
            width:200px;
            color:#666;
            background: #fff;
            box-shadow:  0 20px 40px  rgba(0,0,0,0.04);
            i{
                font-size: 28px;
            }
        }
        .update-btn{
            width:100%;
            color:#fff;
            background-color: #F34434;
        }
    }

    /* 模态框 */

.modal {
  position: fixed;
  z-index: 100000;
  width: 100%;
  height: 100%;
  left:0;
  background: rgba(1, 1, 1, 0.8);
  top: 0;
}

.modal-content {
    width: 550px;
    position: absolute;
    left: 65px;
    top: 200px;
    background: #fff;
    border-radius: 8px;
    padding: 50px 40px;
    .modal-title {
        text-align: left;
        font-size: 30px;
        margin-bottom: 20px;
        color: #333;
        font-weight: bold;
    }
    .modal-list {
        line-height: 50px;
        font-size: 28px;
        color:#666;
        margin-bottom:20px;
        span{
            color:#F34434;
        }
    }
     .btn {
        text-align: right;
    }
    button {
        color: #fff;
        background: #F34434;
        border-radius: 8px;
        height:72px;
        width: 144px;
        margin-top: 20px;
        border: none;
        font-size: 28px;
    }
}

.notice_close{
    text-align: center;
    padding: 0 100px;
    font-size:36px;
    line-height: 2;
    font-weight: 600;
    color:#444;
    padding-top:50%;
}
</style>
