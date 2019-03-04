<template>
    <div class="list-item">
        <div class="content">
            <p class="date-time">2018-11-01 12:00:00</p>
            <h3 class="title">这是标题</h3>
            <p class="price">
                <i class="iconfont">&#xe6a6;</i>
                <span>10元</span>
            </p>
        </div>
    </div>
</template>
<script>
export default {
    data(){

    }
}
</script>
<style lang="scss" scoped>
    .list-item{
        padding: 0 20px;
        margin-bottom: 20px;
        .content{
            padding:30px 40px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 20px 40px  rgba(0, 0, 0, 0.04);
            .date-time{
                @include fontStyle(40px,24px ,#333);
            }
            .title{
                @include fontStyle(44px,28px ,#333);
                font-weight: bold;
            }
        }
    }
</style>

