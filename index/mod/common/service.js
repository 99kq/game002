var ajax = require('./ajax');

if (location.port === '8080') {
  //本地调试走服务器代理
  ajax.baseUrl.ebd = "/coc-bill-api";
  ajax.baseUrl.rip = '/rip-website';
  ajax.baseUrl.ebdvas ='/vas-card-api';
}
if (location.host === 'sandbox.99bill.com') {
  //sandbox
  ajax.baseUrl.ebd = "https://ebd-sandbox.99bill.com/coc-bill-api";
  ajax.baseUrl.rip = 'https://rip-sandbox.99bill.com/rip-website';
  ajax.baseUrl.ebdvas ='https://ebd-sandbox.99bill.com/vas-card-api';
  ajax.baseUrl.jr = 'https://jr-sandbox.99bill.com/fpd-platform';
}
var api = {
  validateCode: ajax.baseUrl.ebd + '/base/3.0/sms/validateCode', //C0010001N 生成MAM短信验证码
  register: ajax.baseUrl.ebd + '/mam/3.0/members', //L0020002N 注册快钱账号3.0
  rewardRequest: ajax.baseUrl.ebdvas + '/activity/reward/rewardRequest', //宝箱开启结果接口 抽奖接口
  activityRemainInfo: ajax.baseUrl.ebdvas + '/activity/reward/activityRemainInfo', //获取抽奖活动剩余时间和次数情况
};


var method = Dom7.api;
var pubData = JSON.stringify({"c": "H5", "b": "CSD-KYH-GU", "id": "100", "t": new Date()/1 + ''});

module.exports = {
  //C0010001N 生成MAM短信验证码
  validateCode: function(opt) {
    opt = {
        url: {
            // mock: 'validateCode.json',
            real: api.validateCode
        },
        method: 'POST',
        data: opt.data,
        headers: {
            pubData: pubData
        },
        jsonType: true,
        success: opt.success,
        error: opt.success,
        comment: '鉴权'
    };

    ajax.fn(opt);
  },
  //L0020002N 注册快钱账号3.0
  register: function(opt) {
    opt = {
      url: {
          // mock: 'validateCode.json',
          real: api.register
      },
      method: 'POST',
      data: opt.data,
      headers: {
          pubData: pubData
      },
      jsonType: true,
      success: opt.success,
      error: opt.error,
      comment: '注册'
    };

    ajax.fn(opt);
  },
  //抽奖
  rewardRequest: function(opt){
    opt = {
      url: {
          // mock: 'rewardRequest.json',
          real: api.rewardRequest
      },
      headers: {
          Authorization: sessionStorage.loginToken
      },
      method: 'POST',
      data: opt.data,
      jsonType: true,
      success: opt.success,
      code: 'diy',
      comment: '领券'
    };
    ajax.fn(opt);
  },
  //
  activityRemainInfo: function(opt){
    opt = {
      url: {
          real: api.activityRemainInfo
      },
      headers: {
          Authorization: sessionStorage.loginToken
      },
      method: 'POST',
      data: opt.data,
      jsonType: true,
      success: opt.success,
      code: 'diy',
      comment: '查状态 '
    };
    ajax.fn(opt);
  }
};
