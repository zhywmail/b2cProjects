$(function () {
    var banner_list = $(".banner_list"),
        banner_list_li = banner_list.children("li"),
        banner_nav = $(".banner_nav"),
        banner_nav_li = banner_nav.children("li"),
        set_intevBanner;

    var isIE8 = (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion .split(";")[1].replace(/[ ]/g,"")=="MSIE8.0");
    var showCss = {};
    if(isIE8){
        showCss = { "opacity": "1","width":"100%"};
    }else{
        showCss = { "opacity": "1"};
    }
    banner_setInterval();
    banner_nav_li.each(function (i) {
        var that = $(this);

        that.hover(function () {
            var _list_that = banner_list_li.eq(i);
            clearInterval(set_intevBanner);
            that.addClass("active").siblings("li").removeClass("active");
            _list_that.show().stop().animate(showCss, function () {
                $(this).addClass("active");
            }).siblings("li").stop().animate({ "opacity": "0"}, function () {
                $(this).hide().removeClass("active");
            });
        }, function () {
            banner_setInterval();
        });
    });

    function banner_setInterval() {
        set_intevBanner = setInterval(function () {
            var _list_active = banner_list.children("li.active"),
                _next_list_li = _list_active.next("li"),
                _nav_active = banner_nav.children("li.active"),
                _next_nav_li = _nav_active.next("li");
            if (_next_list_li.length <= 0) {
                _next_list_li = banner_list.children("li").eq(0);
                _next_nav_li = banner_nav.children("li").eq(0);
            }


            _nav_active.removeClass("active");
            _next_nav_li.addClass("active");
            _next_list_li.show().stop().animate(showCss);
            _list_active.stop().animate({ "opacity": "0"}, function () {
                $(this).hide().removeClass("active");
                _next_list_li.addClass("active");
            });
        }, 3000);
    }

    var over_time = $(".baner1 .right > .title > .over_time");
    if(over_time.attr("beginTime") !="" && over_time.attr("endTime") !=""){
        over_time.Countdown({
            "hour": over_time.find(".hour"),
            "minute": over_time.find(".minute"),
            "second": over_time.find(".second"),
            "beginTime": parseInt(over_time.attr("beginTime")),
            "endTime": parseInt(over_time.attr("endTime")),
            "callback": function () {
            }
        });
    }else if(over_time.attr("empty") =="true"){
        over_time.Countdown({
            "hour": over_time.find(".hour"),
            "minute": over_time.find(".minute"),
            "second": over_time.find(".second"),
            "beginTime": new Date().getTime(),
            "endTime": new Date().getTime() + (1*60*60*1000),
            "callback": function () {
            }
        });
    }else{
        over_time.html("");
    }

    var scroll_Now = $(".scroll_Now"),
        SiteBtm = $(".headerBody");

    $(window).scroll(function () {
        var that = $(this);
        if (that.scrollTop() >= scroll_Now.offset().top) {
            SiteBtm.addClass("scroll");
//            console.log("ok");
        } else {
            SiteBtm.removeClass("scroll");
        }
    });


    function brandSlide(){
        $(".brandSlide").each(function(){
            var self = $(this);
            var linkList = $(".brandSlideBd a.show",self);
            if(linkList.length > 3){
                $(".brandSlideHd .prev,.brandSlideHd .next",self).show();
                self.slide({ titleCell:".brandSlideHd i", mainCell:".brandSlideBd ul",autoPlay:true});
            }
        });
    }
    brandSlide();


    var greyImg = $("#greyImg").attr("src");
    $("img[original]").lazyload({
        placeholder:greyImg,
        failurelimit: 10,
        effect: "fadeIn",
        threshold : 200
    });
});

//倒计时
$.fn.extend({
    Countdown: function (options) {
        var that = this,
            el = $(that);
        that.options = {
            "text": el.find(".text"),
            "day": el.find(".day"),
            "hour": el.find(".hour"),
            "minute": el.find(".minute"),
            "second": el.find(".second"),
            "callback": function () { }
        }
        for (var i in options) {
            this.options[i] = options[i];
        }
        function getDate(strDate) {
            var date = eval('new Date(' + strDate.replace(/\d+(?=-[^-]+$)/, function (a) {
                return parseInt(a, 10);
            }).match(/\d+/g) + ')');
            return date;
        }
        var opt = that.options,nMS,textMsg,curTime,beginTime = opt.beginTime,endTime = opt.endTime;
        var setIntv = setInterval(function () {
            curTime = new Date().getTime();
            if(curTime < beginTime){
                //未开始
                nMS = beginTime - curTime;
                textMsg = "离开始时间";
            }else if(curTime < endTime){
                //未结束
                nMS = endTime - curTime;
                textMsg = "剩余时间";
            }else{
                //已结束
                textMsg = "已结束";
                clearInterval(setIntv);
                opt.callback(that);
            }

            var nH = (Math.floor(nMS / (1000 * 60 * 60)) % 24) % 60;
            //定义获得小时
            var nM = (Math.floor(nMS / (1000 * 60)) % 60) % 60;
            //定义获得分钟
            var nS = (Math.floor(nMS / 1000) % 60) % 60;
            //定义获得秒

            opt.text.html(textMsg);
            opt.second.html(nS);
            opt.minute.html(nM);
            opt.hour.html(nH);
            nMS -= 1000;

            if (nH == 0 && nM == 0 && nS == 0) {
                clearInterval(setIntv);
                opt.callback(that);
            }
        }, 1000);
    }
});