import {Component} from 'react'
import service from '../common/service'
import tongji from '../common/tongji'
import util from '../common/util'
import H5login from '../common/H5login'
// import {Motion, spring} from 'react-motion';


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
      status:"03",  //00 为开始，01当日已开完， 02有冷却中宝箱， 03有可开启宝箱，99活动已结束, 98为未开始
      todayAll:1, //今天可开数	number	今天进行了一次抽奖，就会-1，这次活动第一次查询返回的是3
      todayOpened:0,   //今天已开数	number	进行了一次抽奖就会+1
      timeInterval:10, // 抽取宝箱的间隔时间
      leftTime:60,
      statusText : "活动还没开始，明天来看看"
    };
  }

  componentDidMount() {
    // 获取活动信息
    // this.requestEventStatus();
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
    //活动状态
    let status = this.state.status;
    switch (status){
      case "99":
        this.setState({
          statusText : "活动还没开始，明天来看看"
        });
        return(
          <div className="status">
            {this.state.statusText}
          </div>
        );
      case "98":
        this.setState({
          statusText : "活动已结束，请下次再来"
        });
        return(
          <div className="status">
            {this.state.statusText}
          </div>
        );
    }
  }
  // 
  requestEventReward = () => {
    let boxNmuber = this.state.todayAll;
    let that = this;
    // test
    app.alert("您已获得神秘礼品！");
    // test

    this.setState({
      'openStatus': true,
      'todayAll': boxNmuber - 1,
      'countdown': this.state.timeInterval
    });
    let infoData = {
      "activityInfoId":sessionStorage.activityInfoId
    };
    service.requestEventReward({
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
  //打开盒子
  handleOpenBox = () => {
    let that = this;
    console.log('handleOpenBox',this.state,that);
    let boxNmuber = this.state.todayAll;
    if(that.state.status ==='98' || that.state.status ==='99'){
      app.alert(this.state.statusText);
      return false;
    }
    // 用户登录判断
    // H5login(function() {
      console.log('logined');
      if( boxNmuber > 0){
        //有可开箱子
        if(this.state.countdown>0){
          //倒计时未结束
          let sec_num = parseInt(this.state.countdown, 10)
          let hours   = Math.floor(sec_num / 3600)
          let minutes = Math.floor((sec_num - (hours * 3600)) / 60)
          let seconds = sec_num - (hours * 3600) - (minutes * 60)
          if (minutes < 10) {minutes = "0" + minutes}
          if (seconds < 10) {seconds = "0" + seconds}
          app.alert("需要等"+ minutes +"分"+seconds+"秒后开启！！"); 
          return false;
        }else{
          that.requestEventReward();
        }
      }else{
        // 无可开箱子
        app.alert("已开达到今天上限，明天再来！！"); 
      }
    // }); //login
  }

  // 晃动动画
  handleRockBox = () => {
    console.log('handleRockBox');
    this.setState({'roke': !this.state.roke});
  }
  // 规则
  handleRule = () => {
    console.log('handleRule');
    app.alert('规则');
    
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
                <span></span> {hours}<span>小时</span>{minutes}<span>分</span> {seconds}<span>秒</span>
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

    return (
      <div className="lottery">
        <div className="ad"></div>
        <div className="status">
          {this.state.statusText}
        </div>
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
          <a href="#" className="btn-rule" onClick={this.handleRule.bind()}>活动细则</a>
        </div>
        {btnBox.bind(this)()}
        <div className="number">今天您还有 {this.state.todayAll} 次开箱机会</div>
        {footer.bind(this)()}
      </div>
    );
  }
  
}


export default Home;
