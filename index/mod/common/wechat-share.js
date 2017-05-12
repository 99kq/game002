module.exports = function() {

    var authUrlInter = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx22821a949804d35f&redirect_uri=',
        authUrlPro = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx1277f917a4178ce9&redirect_uri=',
        pageUrl = window.location.href,
        para = '&response_type=code&scope=snsapi_base#wechat_redirect';

    var share = {
        title: app.shareInfo.title || '分享标题',
        desc: app.shareInfo.desc || '分享描述',
        link: authUrlPro + encodeURIComponent(pageUrl) + para,
        imgUrl: app.shareInfo.imgUrl || 'https://www.99bill.com/res/i/logo-wx_f2c2901f2402.png'
    };

    var API = 'https://ebd.99bill.com/coc-bill-api/1.0/wxResource/wxConfig';

    $$.ajax({
        url: API,
        data: {url: encodeURIComponent(window.location.href)},
        success:function(res){
            var data = JSON.parse(res);

            window.wx.config({
                debug: 0, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: data.appId, // 必填，企业号的唯一标识，此处填写企业号corpid
                timestamp: data.timestamp, // 必填，生成签名的时间戳
                nonceStr: data.noncestr, // 必填，生成签名的随机串
                signature: data.signature,// 必填，签名，见附录1
                jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });

            window.wx.ready(function(){
                sharecall(share);
            });
        }
    });

    function sharecall(share){
        //分享到朋友圈
        window.wx.onMenuShareTimeline({
            title: share.title,
            link: share.link,
            imgUrl: share.imgUrl,
            success: function() { }, // 分享成功
            cancel: function() { }, // 分享取消
            fail: function() { } // 分享失败
        });

        //分享给朋友
        window.wx.onMenuShareAppMessage({
            title: share.title,
            desc: share.desc,
            link: share.link, 
            imgUrl: share.imgUrl,
            type: '', // 分享类型，music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function() {},
            cancel: function() {},
            fail: function() {}
        });
    }
};