<template>
    <div class="comon_" v-if="show==1">
        <span>通知：</span>
        <div class="desce flex-wrap"><p :class="isScroll?'anima':''">{{msg}}</p></div>
    </div>
</template>
<script>
import { getNotice } from "@/api/myProfit.js";
import MarqueeTips from 'vue-marquee-tips'
export default {
    components: {
        MarqueeTips
    },
    data(){
        return{
            show:0,
            msg:'',
            isScroll:true
        }
    },
    mounted(){
        getNotice().then(res=>{
            if(res.data.code==200){
                this.show = res.data.result
                this.msg  = res.data.message
                this.$emit('showbar',res.data.result)
            }
        })
       
    },
    methods:{
        
    }
}
</script>

<style lang="scss" scoped>

    .flex-wrap{
        display: flex;
        display: -webkit-box;
        align-items: center;
    }
    .comon_{
        background: #F4E2E4;
        position: fixed;
        width:100%;
        z-index:100000;
        top:0;
        font-size:26px;
        span{
            background:#F4E2E4 ;
            line-height: 1.5;
            @include fontStyle(42px,26px,$font-red);
            width:100px;
            text-align: right;
            padding: 20px 0;
            position: absolute;
            z-index:1;
        }
        .desce{
            padding: 20px 0;  
            p{
                font-size:26px;
                color:$font-red;
                line-height: 46px;
                white-space: nowrap;
            }
        }
    }

    .anima{
        animation: ani 15s linear infinite;
    }
    @keyframes ani {
        0%{
            transform: translateX(750px);
        }
        100%{
            transform: translateX(-1780px);
        }
    }
</style>
