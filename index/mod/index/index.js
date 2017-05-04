import {Component} from 'react'
import service from '../common/service'
import tongji from '../common/tongji'
import util from '../common/util'
import {Motion, spring} from 'react-motion';


// 设定箱子晃动动画弹性
const springSetting1 = {stiffness: 600, damping: 1, precision:0.01};

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      openStatus: false, //当前箱子开启状态:false为还能开，true为箱子已打开
      roke: false, //晃动箱子的开关
      activityInfoId:'', //活动id
      countdown:5,  //活动剩余时间或冷却时间	number	秒为单位，倒计时
      status:"00",  //00 为开始，01当日已开完， 02有冷却中宝箱， 03有可开启宝箱，99活动已结束, 98为未开始
      todayAll:3, //今天可开数	number	今天进行了一次抽奖，就会-1，这次活动第一次查询返回的是3
      todayOpened:0,   //今天已开数	number	进行了一次抽奖就会+1
      timeInterval:10 // 抽取宝箱的间隔时间
    };
  }

  componentDidMount() {
    // 获取活动信息
    this.requestEventStatus();
    // 开启倒计时
    this.timer = setInterval(function () {
        let countdown = this.state.countdown;
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
        let z = parseInt(countdown / y);
        if ( y*z == countdown){
          this.handleRockBox();
        }
    }.bind(this), 1000);
  }
  //获取活动信息
  requestEventStatus = () => {
    let that = this;
    let infoData = {};
    service.activityRemainInfo({
      data: infoData,
      success: function(infoRes) {
        if(infoRes.responseCode === '00'){
          // 保存活动信息
          that.setState({
            'activityId':infoRes.activityId,
            'countdown':infoRes.countdown,
            'status':infoRes.status,
            'todayAll':infoRes.todayAll,
            'todayOpened':infoRes.todayOpened,
          })
        }else{
          app.alert('获取活动信息:'+infoRes.responseMessagev);
        }
      }
    });
  }
  // 
  requestEventReward = () => {
    let boxNmuber = this.state.todayAll;
    app.alert("您已获得神秘礼品！");
    this.setState({
      'openStatus': true,
      'todayAll': boxNmuber - 1,
      'countdown': this.state.timeInterval
    });
  }
  //打开盒子
  handleOpenBox = () => {
    console.log('handleOpenBox',this.state);
    let boxNmuber = this.state.todayAll;
    //倒计时
    if(this.state.countdown>0){
      let sec_num = parseInt(this.state.countdown, 10)
      let hours   = Math.floor(sec_num / 3600)
      let minutes = Math.floor((sec_num - (hours * 3600)) / 60)
      let seconds = sec_num - (hours * 3600) - (minutes * 60)
      if (minutes < 10) {minutes = "0" + minutes}
      if (seconds < 10) {seconds = "0" + seconds}
      app.alert("需要等"+ minutes +"分"+seconds+"秒后开启！！"); 
      return false;
    }else{
      // 有可开箱子
      if( boxNmuber> 0){
        this.requestEventReward();
      }else{
        app.alert("已开达到今天上限，明天再来！！"); 
      }
    }
  }
  // 晃动动画
  handleRockBox = () => {
    console.log('handleRockBox');
    this.setState({'roke': !this.state.roke});
  }
  render() {
    let boxClaseName = 'chest';
    if (this.state.openStatus){
       boxClaseName = 'chest chest-open';
    }else{
       boxClaseName = 'chest';
    }
    // 剩余时间倒计时
    function setLeftTime(seconds_in){
        if (isNaN(seconds_in)) {
            return '00:00:00'
          } else {
            let sec_num = parseInt(seconds_in, 10)
            let hours   = Math.floor(sec_num / 3600)
            let displayHours = Math.floor(sec_num / 3600)%24
            let days    = Math.floor(hours / 24)
            let minutes = Math.floor((sec_num - (hours * 3600)) / 60)
            let seconds = sec_num - (hours * 3600) - (minutes * 60)
            if (hours   < 10) {hours   = "0" + hours}
            if (minutes < 10) {minutes = "0" + minutes}
            if (seconds < 10) {seconds = "0" + seconds}
            if (days < 1){ days = ""}
            return (
                <div className="left-text">
                   <span>剩余时间</span>  {days }<span>天</span> {displayHours}<span>时</span> {minutes}<span>分</span> {seconds}<span>秒</span>
                </div>
            )
          }
    }
    return (
      <div className="lottery">
        <div className="headbox">
          <div className="status">
            {this.state.status}
          </div>
          <div className="info">
            每天瓜分1000万
            100件3C爆款免息购
            今天你有3次机会
          </div>
        </div>
        <div className="chestbox">
          <Motion style={{scale: spring(this.state.roke ? 1.02 : 1, springSetting1)}}>
            {({scale}) =>
              <div className={boxClaseName} style={{
                WebkitTransform: ` scale(${scale})`,
                transform: `scale(${scale})`
              }} onClick={this.handleRockBox.bind()} />
            }
          </Motion>
        </div>
        <div className="btnbox">
          <a href="#" className="btn" onClick={this.handleOpenBox.bind()}>点击开宝箱</a>
        </div>
        <div className="footer">
          <div className="txt">距下次宝箱开启时间：</div>
          <div className="time">{setLeftTime.bind(this,this.state.countdown)()}</div>
        </div>
      </div>
    );
  }
  
}


export default Home;
