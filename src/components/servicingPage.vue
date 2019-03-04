

<template>
    <div class="wrapper">
        <img :src="icon" alt="维护中" class="wh-icon">
        <h2>正在维护，稍后回来</h2>
        <p class="desc">{{msg}}</p>
        <div class="q-code">
            <p>关注人人有料公众号<br/>获取实时更新通知</p>
            <img :src="code" alt="二维码">
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            icon:require('../assets/img/maintenance_logo.png'),
            code:require('../assets/img/qr_code.jpg'),
            msg:''
        }
    },
    mounted(){
        this.msg = this.$route.query.msg
    }
}
</script>
<style lang="scss" scoped>
    .wrapper{
        text-align: center;
        background-color: $font-red;
        padding: 80px 0;
        position: fixed;
        width:100%;
        height:100vh;
        overflow-y: scroll;
        top:0;
        z-index:2000;
        box-sizing: border-box;
    }
    .wh-icon{
        width:100%;
    }
    h2{
        @include fontStyle(66px,48px,#fff);
    }
    p.desc{
        @include fontStyle(42px,28px,#fff);
        margin-top:24px; 
        opacity: 0.8;
        text-align: left;
        padding: 0 80px;
    }
    .q-code{
        margin-top:100px;
        p{
            @include fontStyle(42px,28px,#fff);
            margin-bottom:30px;
        }
        img{
            width:360px;
            height:360px;
            border-radius: 8px;
        }
    }
</style>
