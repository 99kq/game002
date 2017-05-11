import {Component} from 'react'
import service from '../common/service'
import tongji from '../common/tongji'
import util from '../common/util'
import H5login from '../common/H5login'

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      openStatus: false, //当前箱子开启状态:false为还能开，true为箱子已打开
      roke: false, //晃动箱子的开关
      activityInfoId:'4', //活动id
      countdown:225,  //活动剩余时间或冷却时间	number	秒为单位，倒计时
      status:"03",  //00 为开始，01当日已开完， 02有冷却中宝箱， 03有可开启宝箱，99活动已结束, 98为未开始
      todayAll:0, //今天可开数	number	今天进行了一次抽奖，就会-1，这次活动第一次查询返回的是3
      todayOpened:0,   //今天已开数	number	进行了一次抽奖就会+1
      timeInterval:10, // 抽取宝箱的间隔时间
      leftTime:60
    };
  }
  componentDidMount() {
    // 获取活动信息
    tongji.track(1);
    this.requestEventStatus();
    // 开启倒计时
    this.timer = setInterval(function () {
        let countdown = this.state.countdown;
        let count = this.state.leftTime;
        count -= 1;
        if (count < 1) {
          count = 60;
        }
        this.setState({
          leftTime: count
        });

        //倒计时计算箱子是否可以开启
        if ( countdown > 0 ){
          this.setState({
              countdown : countdown-1
          });
        }else if(this.state.todayAll>0){
          this.setState({
              openStatus : false
          });
        }
        //每间隔5秒箱子晃动一次
        let y = 5 ; 
        let z = parseInt(count / y);
        if ( y*z == count){
          this.handleRockBox();
        }
    }.bind(this), 1000);
  }
  // 弹出领取成功浮层
  popSusses = (info) =>{
    let that = this;
    tongji.track(3);
    app.closeModal();
    let noKQB = '<a href="#" class="button button-big active btn-success">下载快钱钱包App有更多机会</a>';
    if(window.KQB.Env.KQ){
      noKQB = '';
    }
    let popupHTML = '<div class="popup nb-modle popup-success">' +
                      '<div class="qy-status">' +
                        '<div class="qy-left"><div class="qy-number"><span class="amt">'+info.interestsAmt+'</span>元</div>' +
                        '<div class="qy-type">抵用券</div></div>' +
                        '<div class="qy-text"><span class="name">'+info.interestsName+'</span>元</div>' +
                      '</div>' +
                      '<div class="content-block"><p class="info">优惠券已发放至<br/>您的<b>快钱钱包App卡券包中</b></p>' +
                          noKQB +
                      '</div>' +
                      '<div class="index-popup-btn">' +
                          '<a href="#" class="close-popup index-popup-close">X</a>' +
                      '</div>'
                  '</div>';
    // tongji.track(12);
    app.popup(popupHTML);
    // 绑定弹出注册层事件
    $$('.popup-success').on('opened', function () {
      tongji.track(4);
      $$(document).on('click', '.btn-success', function() {
        window.open("https://at.umeng.com/bSXPby");
        app.closeModal();
      });
    });
  }
  // 弹出领取 没有中奖
  popNotSusses = (info) =>{
    let that = this;
    // tongji.track(6);
    app.closeModal();
    let noKQB = '<a href="#" class="button button-big active btn-notsuccess">下载快钱钱包App有更多机会</a>';
    if(window.KQB.Env.KQ){
      noKQB = '<a href="#" class="button button-big active btn-notsuccess">我知道了</a>';
    }
    let popupHTML = '<div class="popup nb-modle popup-notsuccess">' +
                      '<div class="content-block">' +
                         noKQB +
                      '</div>' +
                      '<div class="index-popup-btn">' +
                          '<a href="#" class="close-popup index-popup-close">X</a>' +
                      '</div>'
                  '</div>';
    app.popup(popupHTML);
    // 绑定弹出注册层事件
    $$('.popup-notsuccess').on('opened', function () {
      // tongji.track(7);
      $$(document).on('click', '.btn-notsuccess', function() {
          app.closeModal();
      });
    });
  }
  // 弹出 倒计时
  popCountdownTime = () =>{
    let that = this;
    // tongji.track(6);
    app.closeModal();
    // let time = minutes + "<span>分</span>" +seconds + "<span>秒</span>";
    let time = util.formatTime(that.state.countdown,":","2-4","小时-分-秒");
    let noKQB = '<a href="#" class="button button-big active btn-success">下载快钱钱包App有更多机会</a>';
    if(window.KQB.Env.KQ){
      noKQB = '';
    }
    let popupHTML = '<div class="popup nb-modle popup-countdown">' +
                      '<div class="content-block">' +
                         time +
                         noKQB +
                      '</div>' +
                      '<div class="index-popup-btn">' +
                          '<a href="#" class="close-popup index-popup-close">X</a>' +
                      '</div>'
                  '</div>';
    app.popup(popupHTML);
    // 绑定弹出注册层事件
    $$('.popup-countdown').on('opened', function () {
      // tongji.track(7);
      // var countdownNum = that.state.countdown;
      // var countdownTimer = setInterval(function() {
      //   countdownNum -= 1;
      //   if (countdownNum === 0) {
      //     clearInterval(countdownTimer);
      //     return;
      //   }
      //   console.log('time:',countdownNum);
      //   $$('.popup-countdown .content-block').html(util.formatTime(countdownNum,":","2-4","小时-分-秒"));
      // }, 1000);
      $$(document).on('click', '.btn-notsuccess', function() {
          app.closeModal();
      });
    });
  }
  // 弹出 明天再来
  popTomorrow = (info) =>{
    let that = this;
    // tongji.track(6);
    app.closeModal();
    let noKQB = '<a href="#" class="button button-big active btn-success">下载快钱钱包App有更多机会</a>';
    if(window.KQB.Env.KQ){
      noKQB = '<a href="#" class="button button-big active btn-tomorrow">我知道了</a>';
    }
    let popupHTML = '<div class="popup nb-modle popup-tomorrow">' +
                      '<div class="content-block">' +
                          noKQB +
                      '</div>' +
                      '<div class="index-popup-btn">' +
                          '<a href="#" class="close-popup index-popup-close">X</a>' +
                      '</div>'
                  '</div>';
    app.popup(popupHTML);
    // 绑定弹出注册层事件
    $$('.popup-tomorrow').on('opened', function () {
      // tongji.track(7);
      $$(document).on('click', '.btn-tomorrow', function() {
          app.closeModal();
      });
    });
  }
  //获取活动信息
  requestEventStatus = () => {
    let that = this;
    let infoData = {};
    service.activityRemainInfo({
      data: infoData,
      success: function(infoRes) {
        if(infoRes.responseCode === '00'){
          let statusText = '';
          //活动状态
          switch (infoRes.status){
            case "99":
              statusText = "活动还没开始，明天来看看";
              break;
            case "98":
              statusText = "活动已结束，请下次再来";
              break;
            default:
              statusText = "活动已结束，请下次再来";
              break;
          }
          // 保存活动信息
          that.setState({
            'activityInfoId':infoRes.activityInfoId,
            'countdown':infoRes.countdown,
            'status':infoRes.status,
            'todayAll':infoRes.todayAll,
            'todayOpened':infoRes.todayOpened,
            'statusText': statusText
          })
        }else{
          app.alert('获取活动信息:'+infoRes.responseMessagev);
        }
      }
    });
    
  }
  // 获取箱子权益
  requestEventReward = () => {
    let boxNmuber = this.state.todayAll;
    let that = this;
    // test
    app.alert("您已获得test资格！");
    
    that.setState({
      'openStatus': true,
      'todayAll': boxNmuber - 1,
      'countdown': that.state.timeInterval
    });
    // test
    let rewardData = {
      "activityInfoId":that.state.activityInfoId
    };
    console.log('rewardRequest',rewardData,sessionStorage);
    service.rewardRequest({
      data: rewardData,
      success: function(rewardRes) {
        //
        console.log('rewardRequest',rewardRes);
        if(rewardRes.rewardStatus==="0" && rewardRes.responseCode==="00"){
          that.popSusses(rewardRes);
        }else{
          that.popNotSusses(rewardRes);
        }
      }
    });
  }
  //打开盒子
  handleOpenBox = () => {
    tongji.track(2);
    let that = this;
    console.log('handleOpenBox',this.state,that);
    
    let boxNmuber = this.state.todayAll;
    if(that.state.status ==='98' || that.state.status ==='99'){
      app.alert(this.state.statusText);
      return false;
    }
    // 用户登录判断
    H5login(function() {
      // console.log('logined');
      if( boxNmuber > 0){
        //有可开箱子
        if(that.state.countdown>0){
          that.popCountdownTime();
          return false;
        }else{
          // console.log(that,that.requestEventReward);
          that.requestEventReward();
        }
      }else{
        // 无可开箱子
        that.popTomorrow();
        // app.alert("已开达到今天上限，明天再来！！"); 
      }
    }); //login
  }
  // 晃动动画
  handleRockBox = () => {
    // console.log('handleRockBox');
    this.setState({'roke': !this.state.roke});
  }
  // 规则展示
  handleShowRule =() =>{
    var showLayer = $$('#hide_layer, .hide_overlayer');
    showLayer.show();
    // console.log(this.state);
    setTimeout(function () {
      showLayer.addClass('active');
    }, 100);
  }
  // 规则隐藏
  handleHideRule =() =>{
    var showLayer = $$('#hide_layer, .hide_overlayer');
    showLayer.hide();
    showLayer.removeClass('active');
  }
  render() {
    let boxClaseName = 'chest';
    let btnClaseName = 'btn';
    if (this.state.openStatus){
       boxClaseName = 'chest chest-open';
       btnClaseName = 'btn btn-open'
    }else{
       boxClaseName = 'chest';
       btnClaseName = 'btn'
    }
    // 按钮晃动
    function btnShake(){
      if(this.state.roke){
        return(
          <a href="#" className={btnClaseName + " shake-slow shake-constant shake-constant--hover"} onClick={this.handleOpenBox.bind()}></a>
        )
      }else{
        return(
          <a href="#" className={btnClaseName} onClick={this.handleOpenBox.bind()}></a>
        )
      }
      
    }
    // 剩余时间倒计时
    function setLeftTime(seconds_in){
      if (isNaN(seconds_in)) {
        return (
          <div className="left-text">
                <span></span> 00<span>小时</span> 00<span>分</span> 00<span>秒</span>
            </div>
        )
      } else {
        return (
            <div className="left-text">
                <span>{util.formatTime(seconds_in,":","2-4","小时-分-秒")}</span>
            </div>
        )
      }
    }
    // 页脚
    function footer(){
      let that = this;
      // console.log('footer',that.state.status,(that.state.status !='98' && that.state.status !='99'));
      // setLeftTime(that.state.countdown);
      if(that.state.status ==='98' || that.state.status ==='99'){
        return false;
      }else{
        return(
          <div className="footer">
            <span className="txt">距下次宝箱开启时间：</span>
            <span className="time">{setLeftTime.bind(this,this.state.countdown)()}</span>
          </div>
        )
      }
    }
    // 开箱按钮
    function btnBox(){
      let that = this;
      // console.log('footer',that.state.status,(that.state.status !='98' && that.state.status !='99'));
      // setLeftTime(that.state.countdown);
      // if(that.state.status ==='98' || that.state.status ==='99'){
      //   return false;
      // }else{
        // console.log('in');
        return(
          <div className="btnbox">
            {btnShake.bind(this)()}
          </div>
        )
      // }
    }
    //页顶部状态
    function tipStatus(){
      let that = this;
      if(that.state.status ==='98' || that.state.status ==='99'){
        return (
          <div className="status">
            {that.state.statusText}
          </div>
        )
      }else{
        return false;
      }
    }
    return (
      <div className="lottery">
        <div className="ad"></div>
        {tipStatus.bind(this)()}
        <div className="headbox">
          <div className="title">
            每天瓜分1000万
            100件3C爆款免息购
          </div>
        </div>
        <div className="chestbox">
          <div className={boxClaseName} onClick={this.handleRockBox.bind()} />
        </div>
        <div className="rule">
          <a href="#" className="btn-rule" onClick={this.handleShowRule.bind()}>活动细则</a>
        </div>
        {btnBox.bind(this)()}
        <div className="number">今天您还有 {this.state.todayAll} 次开箱机会</div>
        {footer.bind(this)()}
        <div className="layer-box row " id="hide_layer" >
            <div className="content-block">
                <p className="agreement-title">活动规则：</p>
                <p>1、 活动说明</p>
                <p>a）活动时间：</p>
                <p>b）参与对象：快钱钱包App实名用户及未购买过快钱理财产品新用户；</p>
                <p>c）参与方式：快钱钱包App实名用户发送拼团邀请链接至好友，受邀好友打开邀请链接并点击参团，登录或完成注册，即成功绑定拼团邀请关系；</p>
                <p>d）活动期间每位用户的快钱钱包账户、手机号码、移动设备号和银行卡卡号作为用户身份的实名认证要素，以上任一要素相同，均视为同一位用户。</p>
                <p>e）活动过程中如发现用户存在不当行为，快钱有权取消该用户所有活动相关奖励；</p>
                <p>f）快钱有权在中国法律法规允许的范围内修改本活动条款及细则，并于快钱钱包App或其他相关渠道公告后生效，敬请留意。</p>

                <p>2、拼团说明</p>
                <p>a）已购买过快钱理财产品的用户仅能作为团长开团，未购买过快钱理财产品的用户可开团或参团，但每位用户仅限参加一次拼团（不区分开团或参团）；</p>
                <p>b）3人（含）以上即成团，成员至少需要包含两名未购买理财的新用户；</p>
                <p>c）活动期内成团，每位团员成功购买快钱理财固定期限 “快定盈”系列理财产品满3000元（含）以上， 团长及团员均可获得100元活动奖励：包含30元现金奖励和70元理财抵用券（20元+50元各一张），即拼团成功；</p>
                <p>d）快钱理财“快定盈”系列包括快定盈新手专享14天、快定盈30天-365天理财产品以及快定盈结构化产品；</p>
                <p>e）若参团购买的产品不成立，快钱理财只须返还投资者实际投入的本金。若拼团不成功，已购买的理财产品仍然成立。</p>

                <p>3、奖励细则</p>
                <p>a）30元现金奖励将于活动结束后5个工作日内发放至活期理财快利来账户并短信通知，支持随时提现，如参与拼团用户尚未开通快利来账户，参与该活动即代表授权快钱为其自动开通快利来账户。</p>
                <p>b）70元理财抵用券（20元+50元各一张）将于活动结束后5个工作日内发放并短信通知，快钱钱包用户至快钱钱包App首页【卡券包】内查看，券有效期为自发放之日起14天内有效，过期作废。</p>
                <p>c）20元理财抵用券仅限购买快钱理财90天（不含）以上“可用券”产品满5000元（含）以上使用，50元理财抵用券仅限购买快钱理财90天（不含）以上“可用券”产品满20000元（含）以上使用。（新手专享产品不可用券）；</p>
                <p>d）每张理财抵用券每个用户ID仅限使用一次，每笔交易仅可抵用一张。</p>
                <p>e）理财抵用券使用流程：◆快钱钱包用户：点击“理财”-->选择“固定期限”-->选择带“可用券”标记的快定盈理财产品，点击立即购买-->填写购买金额，选择抵用券，支付并完成购买。</p>
            
            </div>
        </div>
        <div className="icon-cross-wrapper"><i className="icon-cross hide_layer_btn" onClick={this.handleHideRule} ></i></div>
        <div className="overlayer hide_overlayer"></div>
      </div>
    );
  }
}
export default Home;
