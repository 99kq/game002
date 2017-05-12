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

  app.shareInfo = {
    title: '每天分瓜100万 人人有奖',
    desc: '快钱钱包商城频道分瓜了！ 每天分瓜100万，还有更多3C爆款免息购，快来抢瓜~~',
    imgUrl: 'https://img.99bill.com/res/i/share-chest_9725484d9cbd.jpg'
  };
  
  app.mainView = app.addView('.view-main');

  app.mainView.router.load({url: 'index/home', animatePages: false, reload: true});

})
