import {Component} from 'react'
import service from '../common/service'
import tongji from '../common/tongji'
import {Motion, spring} from 'react-motion';
import range from 'lodash.range';


const springSetting1 = {stiffness: 180, damping: 10};
const springSetting2 = {stiffness: 120, damping: 17};
function reinsert(arr, from, to) {
  const _arr = arr.slice(0);
  const val = _arr[from];
  _arr.splice(from, 1);
  _arr.splice(to, 0, val);
  return _arr;
}

function clamp(n, min, max) {
  return Math.max(Math.min(n, max), min);
}


const [count, width, height] = [1, 150, 150];
// indexed by visual position
const layout = range(count).map(n => {
  const row = Math.floor(n / 3);
  const col = n % 3;
  return [width * col, height * row];
});

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mouseXY: [0, 0],
      mouseCircleDelta: [0, 0], // difference between mouse and circle pos for x + y coords, for dragging
      lastPress: null, // key of the last pressed component
      isPressed: false,
      order: range(count), // index: visual position. value: component key/id
      openStatus: false
    };
  };

  componentDidMount() {
    window.addEventListener('touchmove', this.handleTouchMove);
    window.addEventListener('touchend', this.handleMouseUp);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
  };

  handleTouchStart = (key, pressLocation, e) => {
    this.handleMouseDown(key, pressLocation, e.touches[0]);
  };

  handleTouchMove = (e) => {
    e.preventDefault();
    this.handleMouseMove(e.touches[0]);
  };

  handleMouseMove = ({pageX, pageY}) => {
    const {order, lastPress, isPressed, mouseCircleDelta: [dx, dy]} = this.state;
    if (isPressed) {
      const mouseXY = [pageX - dx, pageY - dy];
      const col = clamp(Math.floor(mouseXY[0] / width), 0, 2);
      const row = clamp(Math.floor(mouseXY[1] / height), 0, Math.floor(count / 3));
      const index = row * 3 + col;
      const newOrder = reinsert(order, order.indexOf(lastPress), index);
      this.setState({mouseXY, order: newOrder});
    }
  };

  handleMouseDown = (key, [pressX, pressY], {pageX, pageY}) => {
    this.setState({
      lastPress: key,
      isPressed: true,
      mouseCircleDelta: [pageX - pressX, pageY - pressY],
      mouseXY: [pressX, pressY],
    });
  };

  handleMouseUp = () => {
    this.setState({isPressed: false, mouseCircleDelta: [0, 0]});
  };
  handleOpenBox = (openStatus) => {
    console.log('handleOpenBox',this);
    if(this.state.openStatus){
      app.alert("已开，需要等10分钟后开启");
    }else{
      this.setState({openStatus: true});
    }
  };

  render() {
    const {order, lastPress, isPressed, mouseXY ,openStatus} = this.state;
    return (
      <div className="demo2">
        {order.map((_, key) => {
          let style;
          let x;
          let y;
          let boxStatus;
          const visualPosition = order.indexOf(key);
          if (key === lastPress && isPressed) {
            [x, y] = mouseXY;
            style = {
              translateX: x,
              translateY: y,
              scale: spring(1.2, springSetting1),
              boxShadow: spring((x - (3 * width - 50) / 2) / 15, springSetting1),
            };
          } else {
            [x, y] = layout[visualPosition];
            style = {
              translateX: spring(x, springSetting2),
              translateY: spring(y, springSetting2),
              scale: spring(1, springSetting1),
              boxShadow: spring((x - (3 * width - 50) / 2) / 15, springSetting1),
            };
          }
          if (openStatus){
            boxStatus = 'demo2-ball demo2-ball-open';
          }else{
            boxStatus = 'demo2-ball';
          }
          return (
            <Motion key={key} style={style}>
              {({translateX, translateY, scale}) =>
                <div
                  onMouseDown={this.handleMouseDown.bind(null, key, [x, y])}
                  onTouchStart={this.handleTouchStart.bind(null, key, [x, y])}
                  className={boxStatus}
                  style={{
                    WebkitTransform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
                    transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
                    zIndex: key === lastPress ? 99 : visualPosition
                  }}
                />
              }
            </Motion>
          );
        })}
        <div className="btnbox"><a href="#" className="btn" onClick={this.handleOpenBox.bind()}>开箱子</a></div>
        
      </div>
    );
  };
  
}


export default Home;
