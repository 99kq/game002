module.exports = {
    baseUrl: {
        ebd: 'https://ebd.99bill.com/coc-bill-api',
        jr: 'https://jr.99bill.com/fpd-platform',
        rip: 'https://rip.99bill.com/rip-website',
        ebdvas: 'https://ebd.99bill.com/vas-card-api/'
    },

    fn: function(opt) {
        var self = this;
        var ajaxOpt = {};

        ajaxOpt.time = new Date()/1;
        app.showIndicator(ajaxOpt.time);

        if (opt.url.mock) {
            $$.getJSON('res/data/' + opt.url.mock, function(data) {
                app.hideIndicator(ajaxOpt.time);
                typeof opt.success === 'function' && opt.success(data);
            });
            return;
        }

        ajaxOpt.url = opt.url.real;
        ajaxOpt.method = opt.method || 'GET';
        ajaxOpt.dataType = 'json';
        ajaxOpt.data = opt.data || {};

        // 接口名称-debug
        ajaxOpt.comment = opt.comment + ' : ';
        // ajaxOpt.comment = '';

        // 旧接口与新接口参数不同
        if (opt.jsonType) {
            if (ajaxOpt.method !== 'GET') {
                ajaxOpt.contentType = 'application/json';
                ajaxOpt.data = JSON.stringify(ajaxOpt.data);
            }
        }

        if (opt.headers) {
            ajaxOpt.headers = opt.headers;
        }

        ajaxOpt.success = function(res) {
            var data = res,
                successCode = '0000';

            if (typeof data === 'string') {
                data = JSON.parse(data);
            }

            if (opt.code === 'diy') {
                typeof opt.success === 'function' && opt.success(data);
            } else {
                // 旧接口与新接口成功状态码不同
                if (ajaxOpt.url.indexOf(self.baseUrl.ebd) !== -1) {
                    successCode = '00';
                } 

                if (data.errCode === successCode) {
                    typeof opt.success === 'function' && opt.success(data);
                } else {
                    data.errMsgShow = true;
                    typeof opt.error === 'function' && opt.error(data);
                    data.errMsgShow && app.alert(data.errMsg);
                }
            }

            app.hideIndicator(ajaxOpt.time);

        };

        ajaxOpt.error = function() {
            // app.alert(ajaxOpt.comment + '请求接口出错！');

            app.hideIndicator(ajaxOpt.time);
        };

        $$.ajax(ajaxOpt);
    }
};