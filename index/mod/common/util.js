module.exports = {
  formatNum: function(num, shift, decimal, signed, unit, fstr) {
        //num, decimal, shift 均为Number
        var arr, sign;
        if (!num && num !== 0) {
            return fstr || "--";
        }
        sign = (signed && num > 0) ? "+" : "";
        unit = unit || "";
        if (shift > 0) {
            num *= Math.pow(10, Math.abs(shift));
        } else if (shift < 0) {
            num /= Math.pow(10, Math.abs(shift));
        }
        //整数隔3位加","---保留小数点后"decimal"位(-1小数点不做处理)
        if (decimal >= 0) {
            num = parseFloat(num).toFixed(decimal);
        }
        arr = String(num).split(".");
        arr[0] = arr[0].replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
        return sign + (arr[0] + (arr[1] ? ("." + arr[1]) : "")) + unit;
    },
    formatMillion: function(d, s) {
        return (d / 1000000 + s);
    },
    formatTime:function(d, s, r1, r2) {
      //r取值示例: r1:"1-3", r2:"1-3"
      var a, a1, a2, i, len1,len2, rr1, rr2, text;
      let sec_num = parseInt(d, 10)
      let hours   = Math.floor(sec_num / 3600)
      let displayHours = Math.floor(sec_num / 3600)%24
      let days    = Math.floor(hours / 24)
      let minutes = Math.floor((sec_num - (hours * 3600)) / 60)
      let seconds = sec_num - (hours * 3600) - (minutes * 60)
      if (hours   < 10) {hours   = "0" + hours}
      if (minutes < 10) {minutes = "0" + minutes}
      if (seconds < 10) {seconds = "0" + seconds}
      if (days < 1){ days = ""}
      a = [days,hours,minutes,seconds];
      if (r1) {
        i = 1;
        rr1 = r1.split("-");
        a1 = a.slice(Number(rr1[0]) - 1, Number(rr1[1])).join(s);
        len1 = a1.length;
        for (; i < len1; i++) {
            text += a1[i] + s ;
        }
      }
      if ( r1 && r2 ) {
        i = 0;
        text = "";
        rr1 = r1.split("-");
        rr2 = r2.split("-");
        a2 = a.slice(Number(rr1[0]) - 1, Number(rr1[1]));
        len2 = a2.length;
        for (; i < len2; i++) {
          text += a2[i] + rr2[i] ;
        }
      }
 
      return (text);
    },
    formatDate: function(d, s, r1, r2) {
        //r取值示例: r1:"1-3", r2:"1-3"
        var a, a1, a2, i, len, rr1, rr2;
        if (typeof d == 'number') {
            d = new Date(d);
        } else if (typeof d == 'string') {
            d = new Date(d.replace(/-/g, "/"));
        } else {
            return "--";
        }
        a = [d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds()];
        i = 1;
        len = a.length;
        for (; i < len; i++) {
            a[i] = a[i] < 10 ? "0" + a[i] : a[i];
        }
        if (r1) {
            rr1 = r1.split("-");
            a1 = a.slice(Number(rr1[0]) - 1, Number(rr1[1])).join(s);
        }
        if (r2) {
            rr2 = r2.split("-");
            a2 = a.slice(Number(rr2[0]) + 2, Number(rr2[1]) + 3).join(":");
        }
        if (r1 && r2) {
            a1 += " ";
        }
        return (a1 || "") + (a2 || "");
    },
  // 验证登录密码 前提已满足只有特殊字符 字母和数字
  valiPassword: function(param) {
    var baseReg = /^[0-9a-zA-Z!@\$\~\&\=\#\[\]\`\|\{\}\?\%\^\*\/\'\.\_\-\+\(\)\,\:\;\~\%\<\>\"\\]{8,32}$/;
    if (!baseReg.test(param)) return false;
    var lowercase = /(?=.*[a-z])+/.test(param);
    var capital = /(?=.*[A-Z])+/.test(param);
    var number = /(?=.*[0-9])+/.test(param);
    var specialCharacter = /(?=.*[!@\$\~\&\=\#\[\]\`\|\{\}\?\%\^\*\/\'\.\_\-\+\(\)\,\:\;\~\%\<\>\"\\])+/.test(param);
    return (lowercase && capital) || (lowercase && number) || (lowercase && specialCharacter) || (capital && number) || (number && specialCharacter);
  },
  countDown: function(btn, s) {
    btn = Dom7(btn);
    s = s || 60;
    var SMStimer;
    btn.addClass('disabled');
    btn.html(String(s--) + 's重新发');
    SMStimer = setInterval(function(btn) {
      if (s == 0) {
        clearInterval(SMStimer);
        btn.removeClass('disabled');
        btn.html('重新发送短信');
        return;
      }
      btn.html(String(s--) + 's重新发');
    }, 1000, btn);
    return btn;
  },
  findPosition: function(oElement) {
    var x2 = 0;
    var y2 = 0;
    var width = oElement.offsetWidth;
    var height = oElement.offsetHeight;

    if (typeof(oElement.offsetParent) != 'undefined') {
      for (var posX = 0, posY = 0; oElement; oElement = oElement.offsetParent) {
        posX += oElement.offsetLeft;
        posY += oElement.offsetTop;
      }
      x2 = posX + width;
      y2 = posY + height;
      return [posX, posY, x2, y2];

    } else {
      x2 = oElement.x + width;
      y2 = oElement.y + height;
      return [oElement.x, oElement.y, x2, y2];
    }
  },
  androidFix: function($content) {
    var _this = this;
    if (!_this.isAndroid()) return;

    var focTime, pos;

    focTime = null;

    pos = null;

    $$(document).on('focusin', 'input', function(e) {
      clearTimeout(focTime);
      pos = _this.findPosition(e.target);
      $content.css('padding-bottom', pos[3] + 'px');
      return $content.scrollTop(pos[1] - $$(window).height() / 2 + 44, 0);
    });

    $$(document).on('focusout', 'input', function() {
      focTime = setTimeout((function() {
        return $content.css('padding-bottom', 0 + 'px');
      }), 300);
    });
  },
  maxLength: function(value, maxLength) {
    return value.slice(0, maxLength);
  },
  inputMaxLength: function(input, maxLength) {
    $$(input).on('input', function(e) {
      e.target.value = maxLength(e.target.value, maxLength);
    });
  },
  //  *********************************
  /**
   * method 方法 改名 $.api
   * @prams type: 'get','post'
   * @prams opt:obj {
   *  url:str 请求链接
   *  data:obj (选填) ajax 数据
   *  codes:arr (选填) 执行callback的先决条件 默认:['00']
   *  title:str (选填) 等待标题 默认'请等待...'
   *  callback:fn 回调函数
   *  loginToken:bool, (选填) 值为 true 的时候  请求header 带入 loginToken
   *  timeout:num (选填) 超时时间 , 默认 0
   *}
   **/
  //  *********************************

};
