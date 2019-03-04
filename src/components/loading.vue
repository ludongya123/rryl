<template>
    <div class=" loadimg-more-page">
        <!-- <img :src="require('../assets/img/loading.png')" alt=""> -->
        <mt-spinner type="triple-bounce"></mt-spinner>
        <!-- <span>加载中...</span> -->
    </div>
</template>
<script>
export default {
    data(){
        return{
            color:'#999'
        }
    }
}
</script>
<style lang="scss">
.loadimg-more-page{
    padding: 30px 0;
    text-align: center;
}
</style>

