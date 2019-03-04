/**
 *火眼公众号登录
 */

export const login = (api)=>{

    var url = window.location.href.split("#")[0];
        url = encodeURIComponent(url);
        
    sessionStorage.setItem('reload_url',window.location.href)

    window.location.replace("https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0cef159bed2efa8e&redirect_uri=" +
        url +
        "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect");

}