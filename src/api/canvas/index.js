// 绘制文本
const drawText = (ctx, t, x, y, w, lineH) => {
    var chr = t.split("");
    var temp = "";
    var row = [];
    ctx.textBaseline = "middle";
    for (var a = 0; a < chr.length; a++) {
        if (ctx.measureText(temp).width < w) {
        } else {
            row.push(temp);
            temp = "";
        }
        temp += chr[a];
    }

    row.push(temp);

    for (var b = 0; b < row.length; b++) {
        ctx.fillText(row[b], x, y + b * lineH);
    }
}
let bg1 = require('../../../static/img/poster_bg_yellow.png');
let bg2 = require('../../../static/img/poster_bg_img_basketball.png');
let bg3 = require( '../../../static/img/poster_bg_img_game.png');
let bg4 = require('../../../static/img/poster_bg_img_stadium.png');
let bg5  = require('../../../static/img/poster_bg_1111.png');

/**
 * @params {ctx:null,qrCode:'',title:'',price:'',freeT:'',buyImg:'',userName:'',userImg:'',ty:'0/1/2/3/4/5'}
 * @ctx:画笔
 * @qrCode:二维码
 * @title:标题
 * @price:价格
 * @freeT:免费部分文字
 * @buyImg:付费图片
 * @userName:卖家名字
 * @userImg:卖家头像
 * @ty: 料的类型 => 0 默认；1 限时；2 不中必退； 3 包周； 4 包月； 5 包时；6 免费
 * @bg :背景类型 分别是 => 1,2,3 ,4；
 */
export const canvas = params=> {

    return new Promise((rosolve,reject)=>{
        let { canObj, qrCode, title, price, freeT,buyT,  buyImg, userName, userImg, ty,bg } = params;
            let ctx = canObj.getContext("2d");
            if(ty=='包时'){  ty=5; }
            if(ty=='包月'){  ty=4; }
            if(ty=='包周'){  ty=3; }
            if(ty=='不中必退'){  ty=2; }
            if(ty=='限时'){  ty=1; }
            if(ty==''||!ty){  ty=0; }
            if(ty=='免费') {ty=6}
            console.log(freeT)
            // 画背景
            let bgImg = new Image();
            bgImg.src = bg == 1?bg1:bg == 2?bg2:bg == 3?bg3:bg==4?bg4:bg5;
                
            bgImg.onload = function() {
               
                ctx.drawImage(bgImg, 0, 0, 750, 1000);

                // 画标题
                ctx.font = `bold 48px PingFangSC-Medium`;
                ctx.fillStyle = "#fff";
                ctx.textAlign = "center";
                drawText(ctx, title, 375, 280, 654, 48);

                // 画二维码背景
                let qrCodeBg = new Image();
                qrCodeBg.src = require('../../../static/img/qrcode_bg.png');
               
                qrCodeBg.onload = ()=>{

                    ctx.drawImage(qrCodeBg,70,704,610,230);


                    // 画二维码
                    let qr = new Image();
                    qr.src = qrCode;
                    qr.onload = ()=>{

                        ctx.drawImage(qr,114,750,136,136);
                         // 画料的类型  
                        let tyImg = new Image();

                        // 单卖
                        if(ty==0){
                            tyImg.src = require("../../../static/img/tg_dm.png");
                        }
                        if (ty == 1) {
                            // 限时
                            tyImg.src = require("../../../static/img/tag_xs.png");
                        }
                        if (ty == 2) {
                            // 不中必退
                            tyImg.src = require("../../../static/img/tag_bzbt.png");
                        }
                        if (ty == 3) {
                            // 包周
                            tyImg.src = require("../../../static/img/tag_bz.png");
                        }
                        if (ty == 4) {
                            // 包月
                            tyImg.src = require("../../../static/img/tg_by.png");
                        }
                        if (ty == 5) {
                            // 包时
                            tyImg.src = require("../../../static/img/tag_bs.png");
                        }
                        if(ty==6){
                            // 免费
                            tyImg.src = require("../../../static/img/tag_mf.png");
                        }

                        tyImg.onload = () => {
                            ctx.drawImage(tyImg,(750 - tyImg.width) / 2, 180, tyImg.width, tyImg.height);
                            // 画免费文字
                            // 如果没有免费文字  判断有没有付费文字和付费图片
                                if(freeT!=''){// 画免费文字
                                    ctx.font = "32px PingFangSC-Regular"
                                    ctx.textAlign = "left";
                                    ctx.fillStyle="#fff";
                                    freeT = freeT.length>60?freeT.substring(0,60)+'...':freeT;
                                    drawText(ctx,freeT,70,450,600,40);
                                    // 导出canvas
                                    rosolve(canObj.toDataURL("image/png"))
                                }else{
                                    if(buyImg!='' && buyImg){//付费图片不为空  画付费图片并模糊化
                                        // alert(buyImg)
                                        let buyImg_ = new Image();
                                        buyImg_.crossOrigin = "Anonymous";
                                        buyImg_.src = buyImg;
                                        buyImg_.onload = ()=>{
                                            ctx.drawImage(buyImg_,75, 380, 600, 250)
                                            // ctx.drawImage(buyImg_,0,0,buyImg_.width,250,75, 380, 600, 250)
                                            // 导出canvas
                                            rosolve(canObj.toDataURL("image/png"))
                                        }
                                                                              
                                    }else{
                                        // 如果免费
                                        if(ty==6){
                                            ctx.font = "32px PingFangSC-Regular"
                                            ctx.textAlign = "left";
                                            ctx.fillStyle="#fff";
                                            buyT = buyT.length>60?buyT.substring(0,60)+'...':buyT;
                                            drawText(ctx,buyT,70,450,600,40);
                                            // 导出canvas
                                            rosolve(canObj.toDataURL("image/png"))
                                        }else{
                                            //画付费文字的模糊图片
                                            let buyTImg = new Image();
                                            buyTImg.src= require("../../../static/img/three.png");
                                            buyTImg.onload = ()=>{
                                                ctx.drawImage(buyTImg,70,380,610,240);
                                                
                                                // 导出canvas
                                                rosolve(canObj.toDataURL("image/png")) 
                                            }
                                        }
                                        
                                    }
                                }
                        }
                    }
                    
                    // 价格
                    ctx.font =  `bold 40px PingFangSC-Medium`;
                    ctx.textAlign = "center";
                    ctx.fillStyle="#F34434";
                    ctx.fillText(ty==6?'免费':`￥${price}`,490,770);
                    
                    // 画长按扫码按钮
                    let btnImg = new Image();
                    btnImg.src =  require("../../../static/img/btn_yellow_gradient.png") ;
                    btnImg.onload = ()=>{
                        ctx.drawImage(btnImg,336,822,308,68);
                    }

                    // 用户名
                    ctx.font =  `26px PingFangSC-Medium`;
                    ctx.fillStyle="#fff";
                    ctx.textAlign = "right";
                    ctx.fillText(userName,600,90);

                    // 用户头像
                    let userHeadImg = new Image();
                    userHeadImg.src = userImg;
                    userHeadImg.crossOrigin = "Anonymous";
                    userHeadImg.onload = ()=>{  
                        ctx.save();
                        ctx.arc(666, 86, 40, 0, 2 * Math.PI);
                        // 从画布上裁剪出这个圆形
                        ctx.clip();
                        ctx.drawImage(userHeadImg,626,46,80,80); 

                        ctx.restore();
                    }
                }
                
            }
    })
        
}
