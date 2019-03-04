<template>
    <div class="com">
        <div class="content">
            <p><i class="iconfont">&#xe6d1;</i></p>
            <h4>更新版本至 {{version}}</h4>
            <div class="btns flex-wrap">
                <button class="default" @click="action(1)">更新异常?</button>
                <button class="primary" @click="action(2)">确认更新</button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            version:localStorage.getItem('version'),
        }
    },
    methods:{
        action(type){
            if(type==1){
                this.$emit('jumphelp')
            }else{
                this.$emit('update')
            }
            
        }
    }
}
</script>

<style lang="scss" scoped>
    .com{
        position:fixed;
        width:100%;
        height:100vh;
        z-index:1000;
        background: rgba(0,0,0,0.4);
        .content{
            position: absolute;
            top:480px;
            width:630px;
            left:60px;
            background: #fff;
            border-radius: 8px;
            padding: 32px;
            box-sizing: border-box;
            p{
                text-align: center;
                i{
                    font-size:60px;
                    color:$font-red;
                }
            }
            
            h4{
                @include fontStyle(48px,30px ,#333);
                font-weight:bold;
                margin: 26px 0 42px;
                text-align: center;
            }
            .btns{
                justify-content: space-between;
                button{
                    width:268px;
                    height: 80px;
                    font-size: 28px;
                    border-radius: 8px;
                    border: 1px solid rgba(51,51,51,0.12);
                    &.default{
                        color:#666;
                        background: #fff;
                    }
                    &.primary{
                        color:#fff;
                        background-color: $font-red;
                        border-color: $font-red;
                    }
                }
            }
        }
    }
</style>
