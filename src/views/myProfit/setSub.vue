<template>
    <div class="wrapper">
        <div class="header"><i class="iconfont">&#xe6d3;</i></div>
        <div class="title">设置订阅套餐</div>
        <div class="main">
            <p>· 订阅功能已下线，套餐将无法订阅，已订阅的用户可继续在有效期内查看订阅内容，不受影响，过期后不可续订。</p>
            <!-- <p>· 如需更改价格，请先删除该套餐再新建新价格的套餐</p>
            <p>· 删除的套餐，不会影响到已订阅的用户</p>
            <p>· 修改或删除套餐，实时生效，刷新即可查看</p> -->
        </div>
        <div class="your">我的套餐</div>
        <div class="combo-main" v-if="subList.length>0">
            <div class="combo-one" v-for="(item,index) in subList" :key="index">
                <div class="dele" @click="dele(item.id)"><i class="iconfont">&#xe6a9;</i></div>
                <div class="day"><span class="big-day">{{item.period}}</span>天</div>
                <div class="read">无限制阅读</div>
                <div class="day-price"><i class="iconfont">&#xe6a6;</i>{{item.price/100}}</div>
            </div>
        </div>
        <div class="none" v-if="subList.length<=0">暂无订阅套餐</div>
        <div class="bottom-four" v-if="subList.length>=4">订阅套餐已达上限</div>
        <div class="your mdt40" hidden v-if="subList.length<4">设置订阅套餐</div>
        <div class="packet-period" hidden v-if="subList.length<4">
            <div class="packet-period-condition">
                <!-- <p class="desc">支持资源更新，卖家从支付日起，在包时段内可以看到卖家的更新内容</p> -->
                <!-- <h4>时长</h4> -->
                <div class="flex-wrap">
                    <span @click="choosePeriodType(7)" :class="customDay==7?'active':''">包周</span>
                    <span @click="choosePeriodType(30)" :class="customDay==30?'active':''">包月</span>
                    <span :class="customDay!=7&&customDay!=30?'active':''" @click="choosePeriodType('')">自定义</span>
                </div>
                <input type="number" placeholder="输入天数" v-model="customDay"/>
            </div>
            <p class="xiline"></p>
            <div class="price">
                <!-- <h4>金额</h4> -->
                <input type="number" placeholder="填写金额 · 元" v-model="periodMoney" @input="inputMoney($event)"/>
            </div>
            <p class="xiline"></p>
            <div class="finish" >
                <button class="confiren" @click="putPosterData()">添加订阅套餐</button>
            </div>
        </div>
    </div>
</template>
<script>
// import LoadMore from "@/components/loading.vue";
import { api } from "api/hasSub"
import { Indicator, Toast,MessageBox } from "mint-ui";
// import {getUserList} from 'api/myProfit'
export default {
    // components: {
    //     "v-loadmore": LoadMore
    // },
    data(){
        return {
            // 自定义天数
            customDay:'',
            // 包时段金额
            periodMoney:'',
            subList:[],
            numList:[] //天数数组
        }
    },
    mounted(){
        // 查询订阅套餐信息
        this.getSublist();
    },
    methods:{
        // getUserListInfo(){
        //     this.disLoading = true;
        // },
        // LoadMore(){
        //     this.getUserListInfo()
        // },
        //查询订阅套餐信息
        getSublist(){
            api.getSubtype().then(res=>{
                if(res.data.code == 200){
                    this.subList = res.data.result;
                    this.numList = res.data.result.map(item =>{
                        return item.period
                    })
                }
            })
        },
        inputMoney(e){
             
            let val  = e.target.value
            if(val == '') {
                 e.target.value = '';
            } else {
                // 如果有小数点
                if(val.indexOf('.')>=0){
                    if(val.split(".")[1].length>2){ 
                       this.periodMoney = `${val.split(".")[0]}.${val.split(".")[1].substring(0,2)}`;
                    }
                    if(val>=1){
                        if(val[0]=="0" && val!="0"){
                            this.periodMoney = val.substring(1,val.length);
                        }
                    }
                    // if(val<=1&&val!='0'){
                    //     this.periodMoney ='';
                    //     Toast('应微信平台管控要求，定价请大于1元。');
                    // }
                }else{
                    // 如果没有小数点
                    if(val[0]=="0" && val!="0"){ 
                        this.periodMoney = val.substring(1,val.length);
                    }

                }

            }
            
        },
        choosePeriodType(d){
           this.customDay =  d&&d!=''? d:'';
        },
        // 添加订阅套餐
        putPosterData(){
            let reg=/^[1-9]\d*$/;
            if(!reg.test(this.customDay)){
                Toast('请选择或输入正确的订阅天数');
                return;
            }
            if(this.periodMoney==''||this.periodMoney==0){
                Toast('请输入订阅金额')
                return;
            }
            if(this.periodMoney<=1 && this.periodMoney!='0'){
                this.periodMoney = '';   
                Toast('应微信平台管控要求，定价请大于1元。');
                return;
            }
            for(let i=0;i<this.numList.length;i++){
                if(this.customDay == this.numList[i]){
                     Toast('订阅套餐天数不能相同');
                     this.customDay = '';
                     return
                }
            }
            api.addSub({price:this.periodMoney*100,period:this.customDay}).then(res=>{
                if(res.data.code == 200){
                    console.log(res.data)
                    this.isPacket = false;
                    this.getSublist();
                    this.periodMoney = '';
                    this.customDay = '';
                }
            })
        },
        dele(typeId){
            MessageBox({
                title: '温馨提示',
                message: '确定要删除吗',
                confirmButtonText:'确定',
                showCancelButton:true
            }).then(res=>{
                if(res=="confirm"){
                    this.deleSub(typeId);
                }
            })
        },
        //删除订阅套餐
        deleSub(typeId){
            api.deteleSub({typeId:typeId}).then(res=>{
                console.log(res.data)
                if(res.data.code == 200){
                    this.getSublist();
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.wrapper{
    background-color: #fff;
    padding: 64px 0 0 0; 
    height: 100vh;
    .header{
        width: 120px;
        height: 120px;
        margin: 0 auto;
        background-color: #F34434;
        color: #fff;
        border-radius: 50%;
        line-height: 120px;
        text-align: center;
        i{
            font-size: 48px;
        }
    }
    .title{
        color: #333;
        font-size: 40px;
        text-align: center;
        margin-top: 40px;
        font-weight: 600;
    }
    .main{
        padding: 24px 40px;
        p{
            line-height: 44px;
            color: #999;
            font-size: 28px;
        }
    }
    .your{
        font-size: 28px;
        padding-top: 30px;
        color: #333;
        font-weight: 700;
        padding: 0 40px;
    }
    .bottom-four{
        background-color: #fff;
        height: 96px;
        line-height: 96px;
        text-align: center;
        border-radius: 8px;
        color: #666;
        font-size: 28px;
        padding: 20px 0 40px 0;
    }
    .none{
        text-align: center;
        color: #999;
        margin-top: 50px;
    }
    // 套餐样式
    .combo-main{
        padding: 0 40px;
        display: flex;
        justify-content: space-between;
        margin-top: 28px;
        flex-wrap: wrap;
        background-color: #fff;
        .combo-one{
            position: relative;
            width: 314px;
            height: 328px;
            background-color: #fff;
            border-radius: 8px;
            margin-bottom: 40px;
            box-shadow: 0 40px 80px rgba(0,0,0,0.04);
            // padding: 24px 20px;
            .dele{
                position: absolute;
                width: 64px;
                height: 64px;
                line-height: 64px;
                text-align: center;
                right: 30px;
                top: 24px;
                border: 1.5px solid #f3f3f3;
                // opacity: 0.1;
                color: #ccc;
                border-radius: 8px;
            }
            .day{
                margin-top: 90px;
                font-size: 24px;
                margin-left: 40px;
                .big-day{
                    font-size: 72px;
                }
            }
            .read{
                color: #999;
                font-size: 24px;
                margin-top: 10px;
                margin-left: 32px;
            }
            .day-price{
                color: #F34434;
                font-size: 48px;
                margin-top: 50px;
                margin-left: 30px;
            }
        }
    }
    // 输入框样式
    .packet-period{
        background-color: #fff;
        width: 100%;
        height: 450px;
        padding: 40px 0;
        border-radius: 8px 8px 0 0;
        h4{
            padding: 30px 0;
            color:#333;
            font-size:28px;
            font-weight: bold;
        }
        .packet-period-condition{
            padding: 0 40px;
            .desc{
                color:#999;
                font-size:26px;
                line-height: 36px;
                margin-top: 40px;
            }
            
            .flex-wrap{
                justify-content: space-around;
                color:#999;
                font-size:26px;
                background-color:rgba(51,51,51,0.06);
                padding:13px  0 11px;
                border-radius: 8px;
                span{
                    width:190px;
                    height:72px;
                    border-radius: 8px;
                    text-align: center;
                    line-height: 80px;
                    font-weight: bold;
                }
                .active{
                    background-color:#fff;
                    color:#666;
                    box-shadow: 0 4px 16px rgba(0,0,0,0.06);
                }
            }
            input{
                    padding:40px 0 20px;
                    line-height: 1.5;
                    width:100%;
                    box-sizing: border-box;
                    font-size: 28px;
                    position: relative;
                    -webkit-user-select:text !important;
            }
        }
        .price{
            padding: 0 40px;
            margin: 20px 0;
            input{
                padding:10px 0 10px;
                width:100%;
                font-size: 28px;
                line-height: 1.5;
                -webkit-user-select:text !important;
            }
        }
        .finish{
            padding: 50px 40px 0 40px;
            .confiren{
                width: 100%;
                background-color: #F34434;
                line-height: 100px;
                height: 100px;
                text-align: center;
                color: #fff;
                border-radius: 10px;
                font-size: 28px;
                font-weight: bold;
            }
        }
    }
    .mdt40{
        padding-top: 70px;
        background-color: #fff;
    }
}

</style>


