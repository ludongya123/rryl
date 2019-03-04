<template>
    <div class="wrapper">
            <div class="logo">
                <img :src="require('../assets/img/logo1.png')" alt="">
            </div>
            <h2 class="title">
                人人有料正在升级中...
            </h2>
            <p class="desc">长按下方二维码，保存到手机，用微信扫一扫</p>
            <p class="desc">关注人人有料公众号，了解更多资讯</p>
            <div class="qr-code">
                <img :src="require('../assets/img/qr_code.jpg')" alt="">
            </div>

    </div>
</template>
<script>
export default {
    data(){
        return{
           
        }
    }
}
</script>
<style lang="scss" scoped>
.wrapper{
    position: fixed;
    top:0;
    width:100%;
    background-color: #fff;
    z-index:1000;
    height: 100vh;
    text-align: center;
    padding-top:100px;
    .logo{
        img{
            width:140px;
        }
    }
    .title{
        font-weight: bold;
        font-size:32px;
        color:#333;
        margin:60px;
    }
    .desc{
        font-size:28px;
        color:#888;
        line-height: 1.5;
    }
    .qr-code{
        margin-top:100px;
        img{
            width:300px;
        }
    }
}
</style>
