import style from './res/css/app.css.less'
import {render} from 'react-dom'
import service from './index/mod/common/service'

const $ = window.Dom7;
window.$$ = Dom7;

const router = {
  //用法1 : 经典用法
  'index/home':{
    title:'抽奖',
    mod: require('./index/mod/index').default
  }
};

render((
  <div className="views">
    <div className="view view-main">
      <div className="pages"></div>
    </div>
  </div>
), $('.framework7-root')[0], ()=>{
 
  window.app = new Framework7({
    reactComponent: router,
    root:'.framework7-root'
  });

  var query = $.parseUrlQuery(location.search);
  if (query.idCardRecord) {
    app.session.set('idCardRecord',query.idCardRecord);
  }
  console.log(sessionStorage.verifyCode,query.verifyCode);
  if (query.verifyCode) {
    if(sessionStorage.verifyCode != query.verifyCode){
      sessionStorage.setItem('verifyCode',query.verifyCode);
    }
  }
  // 测试
  // app.alert('idCardRecord:'+query.idCardRecord+ ',verifyCode:'+query.verifyCode);
  // 测试
  
  app.mainView = app.addView('.view-main');

  app.mainView.router.load({url: 'index/home', animatePages: false, reload: true});

})
