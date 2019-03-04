<template>
    <div class="wrapper">
        <div class="top">
            <h3>选择投诉的原因</h3>
            <div class="flex-wrap">
                
                <span v-for="(item,index) in arr" :class="item.value?'choose':''" :key="index" @click="chooseOption(item.value,index)">{{item.label}}</span>
                
            </div>
            <h3>手机号</h3>
            <input type="number" placeholder="输入手机号" v-model="tel">
        </div>
        <p class="xiline"></p>
        <div class="btn">
            <button @click="commitComplain()">提交投诉</button>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import {api} from 'api/myFeed'
import {Toast,Indicator} from "mint-ui";
export default {
    data(){
        return{
            topicKey:'',
            arr:[],
            tel:''
        }
    },
    mounted(){
        this.topicKey = this.$route.query.key
        this.getComplainList();
    },
    methods:{
        /**
        * 获取投诉项
        */
        async getComplainList() {
            try {
                var res = await api.appealGet()
                let arr = []
                for (let i in res.result) {
                let obj = {}
                obj.label = res.result[i];
                obj.value = false;
                arr.push(obj)
                }
                this.arr = arr
            } catch (e) {
                console.log(e)
            }
        },
    //   选择或者取消
        chooseOption(v,i){
            this.arr[i].value = !v;
        },

        // 提交投诉
        async commitComplain() {
            let reg = /^[1][3,4,5,7,8][0-9]{9}$/;
            let tel = this.tel;
        
            if (tel == '') {
                tel = null;
            } else {
                if (!reg.test(tel)){
                    Toast({
                        message: '手机号码格式错误'
                    })
                    return;
                }
            }
            let arr = [];
            for(let i in this.arr){
                if(this.arr[i].value){
                    arr.push(this.arr[i].label)
                }
            }
            if(arr.length==0){
                Toast({
                    message: '请选择要投诉的内容'
                })
                return;
            }
            var res = await api.appealPut({
                "topicKey": this.topicKey,
                "phone": tel || null,
                "item": arr
            })
            if(res.code==200){
                Toast({
                    message: '提交成功,我们会及时处理你的投诉信息'
                })
                setTimeout(()=>{
                    this.$router.go(-1);
                },1000)
            }
        }
    }
}
</script>
<style lang="scss" scoped>

    .top{
        padding:20px  40px 0;
        h3{
            padding: 30px 0 0;
            line-height: 40px;
            font-size: 28px;
            color:#333;
            font-weight: bold;
        }
        .flex-wrap{
            flex-wrap: wrap;
            span{
                width:320px;
                height: 88px;
                border:1px solid rgba(51,51,51,0.08) ;
                box-sizing: border-box;
                border-radius: 8px;
                margin-left:30px;
                line-height: 90px;
                text-align: center;
                margin-top:30px;
                font-size: 28px;
                color:#666;
            }
            .choose{
                color:#333;
                background-color: #fff;
                font-weight: bold;
                box-shadow: 0 12px 40px rgba(0,0,0,0.04);
            }
            span:nth-child(2n-1){
                margin-left:0;
            }
            margin-bottom: 30px;
        }
        input{
                padding:30px 0;
                background-color: transparent;
                width:100%;
                font-size: 28px;
            }
    }
    .btn{
        padding:40px 20px;
         button{
            width:100%;  
            height:96px;
            background-color: #F34434 ;
            border-radius: 8px;
            color:#fff;
            font-size: 28px;
            font-weight: bold;
        }
    }
   
</style>
