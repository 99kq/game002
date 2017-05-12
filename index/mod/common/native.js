module.exports = {

    // 打开新webview
    openNewPage: function(pagePara) {
        if (KQB.Env.KQ) {
            KQB.native('openNewPage', pagePara);
        } else {
            location.href = pagePara.targetUrl;
        }
    },

    // 设置菜单
    navigationBarMenu: function(menuList) {
        KQB.native('navigationBarMenu', {
            menuList: menuList
        });
    },

    // 分享
    share: function(info) {
        var info = info || {},
            shareInfo = {
            shareTitle:  info.title || '分享标题',
            shareContent: info.desc || '分享描述',
            shareUrl: info.link || window.location.href,
            shareIconUrl: info.imgUrl || 'https://www.99bill.com/res/i/logo-wx_f2c2901f2402.png',
            sharePreviewImageUrl: info.imgUrl || 'https://www.99bill.com/res/i/logo-wx_f2c2901f2402.png',
        };

        KQB.native('share', shareInfo);
    },

    // BC码跳转
    openBusinessHome: function(bcCode) {
        KQB.native('openBusinessHome', {
            businessCode: bcCode,
            success: function(res) {alert('跳转成功！');},
            error: function(res) {alert('跳转失败！');}
        });
    },

    // 判断登录
    login: function(para) {
        KQB.native('getAccessToken', {
            success: function(res) {
                if (res.accessToken === '') {
                    // 跳转登录界面
                    KQB.native('login', {
                        success: function(res) {
                            typeof para.success === 'function' && para.success();
                        },
                        error: function(res) {
                            if (res.errorCode !== '99') { // 如果不是取消登录
                                app.alert('登录失败(' + res.errorCode + ')');
                            }
                        }
                    });
                } else {
                    typeof para.success === 'function' && para.success();
                }
            }
        });
    },

    // 实名跳转
    realNameAuth: function() {
        KQB.native('realNameAuth', {
            success: function() {
                // 完成实名认证后，native会自动返回到实名前页面
                app.alert('恭喜您实名成功了！');
            },
            error: function(res) {
                app.alert('实名失败(' + res.errorCode + ')');
            }
        });
    }

};
