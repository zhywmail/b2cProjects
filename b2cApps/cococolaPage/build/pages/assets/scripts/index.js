$(function () {
    var banner_list = $(".banner_list"),
        banner_list_li = banner_list.children("li"),
        banner_nav = $(".banner_nav"),
        banner_nav_li = banner_nav.children("li"),
        set_intevBanner;

    banner_setInterval();
    banner_nav_li.each(function (i) {
        var that = $(this);

        that.hover(function () {
            var _list_that = banner_list_li.eq(i);
            clearInterval(set_intevBanner);
            that.addClass("active").siblings("li").removeClass("active");
            _list_that.show().stop().animate({
                "opacity": 1
            }, function () {
                $(this).addClass("active");
            }).siblings("li").stop().animate({ "opacity": "0" }, function () {
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

            _next_list_li.show().stop().animate({ "opacity": "1" });
            _list_active.stop().animate({ "opacity": 0 }, function () {
                $(this).hide().removeClass("active");
                _next_list_li.addClass("active");
            });
        }, 3000);
    }
    
    
    //var over_time = $(".baner1 .right > .title > .over_time");
    //over_time.Countdown({
    //    "hour": over_time.find(".hour"),
    //    "minute": over_time.find(".minute"),
    //    "second": over_time.find(".second"),
    //    "callback": function () {
    //    }
    //});

    var scroll_Now = $(".scroll_Now"),
        SiteBtm = $(".headerBody");

    $(window).scroll(function () {
        var that = $(this);
        if (that.scrollTop() >= scroll_Now.offset().top) {
            SiteBtm.addClass("scroll");
            console.log("ok");
        } else {
            SiteBtm.removeClass("scroll");
        }
    });


    function brandSlide(){
        jQuery(".brandSlide01").slide({ titleCell:".brandSlideHd i", mainCell:".brandSlideBd ul",autoPlay:true});
        jQuery(".brandSlide02").slide({ titleCell:".brandSlideHd i", mainCell:".brandSlideBd ul",autoPlay:true});
    }
    brandSlide();
    
});