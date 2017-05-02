import {Component} from 'react'
import service from '../common/service'
import tongji from '../common/tongji'
import {Motion, spring} from 'react-motion';

const springSetting1 = {stiffness: 600, damping: 1, precision:0.01};


function clamp(n, min, max) {
  return Math.max(Math.min(n, max), min);
}

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      openStatus: false,
      roke: false,
      leftTime:60
    };
  };

  componentDidMount() {
    this.timer = setInterval(function () {
        var count = this.state.leftTime;
        count -= 1;
        if (count < 1) {
          count = 60;
        }
        let y = 3 ;
        let z = parseInt(count / y);
        if ( y*z == count){
          this.handleRockBox();
        }
        this.setState({
          leftTime: count
        });
    }.bind(this), 1000);
  };
  //打开盒子
  handleOpenBox = () => {
    console.log('handleOpenBox',this.state);
    if(this.state.openStatus){
      console.log("已开，需要等10分钟后开启！！"); 
    }else{
      this.setState({'openStatus': true});
    }
  };
  // 晃动动画
  handleRockBox = () => {
    console.log('handleRockBox',this.state);
    this.setState({'roke': !this.state.roke});
  }
  render() {
    let boxClaseName = 'chest';
    if (this.state.openStatus){
       boxClaseName = 'chest chest-open';
    }else{
       boxClaseName = 'chest';
    }
    return (
      <div className="lottery">
        <div className="chestbox">
          <Motion style={{scale: spring(this.state.roke ? 1.02 : 1, springSetting1)}}>
            {({scale}) =>
              <div className={boxClaseName} style={{
                WebkitTransform: ` scale(${scale})`,
                transform: `scale(${scale})`
              }} onClick={this.handleOpenBox.bind()} />
            }
          </Motion>
        </div>
        <div className="btnbox">
          <a href="#" className="btn" onClick={this.handleOpenBox.bind()}>开箱子</a>
          <a href="#" className="btn" onClick={this.handleRockBox.bind()}>晃箱子</a>
        </div>
      </div>
    );
  };
  
}


export default Home;
