

var trackEvent = function(events, type) {
  this._events = events;
  this.type = type;
};

trackEvent.prototype.track = function(key) {
  try {
    _hmt.push(['_trackEvent', this.type, this._events[key - 1]]);
  } catch (e) {
    return;
  }
};

var type = 'changke';


// 1 changke_huodongym
// 2 changke_lingqu
// 3 changke_zhucetc
// 4 changke_yanzhengma
// 5 changke_lijilingqu
// 6 changke_chenggong
// 7 changke_chakanxiangqing
// 8 changke_xiangqingym
// 9 changke_lijishiyong

var EVENTS = [
  "changke_huodongym", 
  "changke_lingqu", 
  "changke_zhucetc", 
  "changke_yanzhengma", 
  "changke_lijilingqu", 
  "changke_chenggong", 
  "changke_chakanxiangqing",
  "changke_xiangqingym",
  "changke_lijishiyong"
];


module.exports = new trackEvent(EVENTS, type);
