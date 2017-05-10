

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

var type = 'VASbaoxiang';
var environment = "";

if (window.KQB.Env.KQ){
  environment = "_neibu";
}else{
  environment = "_waibu";
}

var EVENTS = [
  "VASbaoxiang_yemian" + environment, 
  "VASbaoxiang_lijikaixiang" + environment, 
  "VASbaoxiang_tc1" + environment, 
  "VASbaoxiang_xiazai"
];



module.exports = new trackEvent(EVENTS, type);
