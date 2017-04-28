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
  auth: ajax.baseUrl.ebd + '/auth/3.0/billApi', //L0070005N bill-api-code登录授权校验v1.1
  holdVoucher: ajax.baseUrl.rip + '/api/activities/v1/holdVoucher', //T0040010 领券接口
  checkVoucher: ajax.baseUrl.rip + '/api/activities/v1/checkVoucher', //T0040010 检查券接口
  //  https://rip.99bill.com/rip-website/api/activities/v1/checkVoucher
  // 绑定常客和快钱账号接口
  addCardRecord: ajax.baseUrl.ebdvas + '/card/h5/addCardRecord', //E00010001L卡数据落库
};


var method = Dom7.api;
var pubData = JSON.stringify({"c": "H5", "b": "CSD-KYH-GU", "id": "100", "t": new Date()/1 + ''});

module.exports = {
  //L0070005N bill-api-code登录授权校验
  auth : function(opt){
    opt = {
      url: {
          // mock: 'joinAct.json',
          real: api.auth
      },
      headers: {
          pubData: pubData
      },
      method: 'POST',
      data: opt.data,
      jsonType: true,
      success: opt.success,
      code: 'diy',
      comment: '登录授权校验'
    };
    ajax.fn(opt);
  },
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
  // T0040010 检查券接口
  checkVoucher: function(opt){
    opt = {
      url: {
          // mock: 'joinAct.json',
          real: api.checkVoucher
      },
      headers: {
          Authorization: sessionStorage.loginToken
      },
      method: 'GET',
      data: opt.data,
      jsonType: true,
      success: opt.success,
      code: 'diy',
      comment: '检查券'
    };
    ajax.fn(opt);
  },
  //T0040010 领券接口
  holdVoucher: function(opt){
    opt = {
      url: {
          // mock: 'joinAct.json',
          real: api.holdVoucher
      },
      headers: {
          authorization: sessionStorage.loginToken
      },
      method: 'GET',
      data: opt.data,
      jsonType: true,
      success: opt.success,
      code: 'diy',
      comment: '领券'
    };
    ajax.fn(opt);
  },
  //E00010001L卡数据落库
  bindAccount: function(opt){
    opt = {
      url: {
          // mock: 'joinAct.json',
          real: api.addCardRecord
      },
      headers: {
          authorization: sessionStorage.loginToken
      },
      method: 'POST',
      data: opt.data,
      jsonType: true,
      success: opt.success,
      code: 'diy',
      comment: '领券'
    };
    ajax.fn(opt);
  }
};
