<template>
    <div class="wrapper">
        <div class="g">
            <h1>更新异常帮助</h1>
            <p>你可以通过以下方法解决问题，如仍出现更新异常，<br>请添加客服微信： renrenyouliao888</p>
        </div>
        <p class="xiline"></p>
        <div class="g">
            <h3>方法 1</h3>
            <p>点击右上角按钮，选择刷新页面</p>
        </div>
        <p class="xiline"></p>
        <div class="g">
            <h3>方法 2</h3>
            <p>取消关注并重新关注公众号，进入人人有料页面</p>
        </div>
        <p class="xiline"></p>
        <div class="g">
            <h3>方法 3</h3>
            <p>在手机后台关掉微信</p>
        </div>
        <p class="xiline"></p>
    </div>
</template>
<script>
export default {
    
}
</script>
<style lang="scss" scoped>
    .wrapper{
        height:100vh;
        background: #fff;
        box-sizing: border-box;
        .g{
            padding: 40px;
            h1{
                @include fontStyle(66px,48px,#333);
                font-weight: bold;
            }
            p{
                 @include fontStyle(48px,28px,#666);
            }
            h3{
                @include fontStyle(52px,30px,#333);
                font-weight: bold;
                margin-bottom:12px;
            }
        }
    }
</style>
