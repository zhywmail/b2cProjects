$(function () {
    var region_list = $(".region_list"),
       region_list_title = region_list.find(">.title"),
       region_list_title_cnt = region_list.find(">.title>.cnt"),
       region_list_region_pop = region_list.find(">.region_pop"),
       region_pop_nav = region_list_region_pop.find(">.region_pop_nav"),
       region_pop_nav_li = region_pop_nav.find(">li");
    region_list_title.click(function () {
        if (region_list_region_pop.is(":visible")) {
            region_list_region_pop.hide();
        } else {
            region_list_region_pop.show();
        }
    });
    region_pop_nav_li.each(function (i) {
        var that = $(this);
        that.click(function () {
            lli = region_list_region_pop.find(">.region_pop_nav_list>li").eq(i);
            that.addClass("active").siblings("li").removeClass("active");
            lli.addClass("active").siblings("li").removeClass("active");
        });

    });

    function messagePanel(){
        // button

        $('.messagePanel .continue').click(function (){
            $(this).parents('.messagePanel').fadeOut();
        });

        $('.messagePanel .cancel').click(function (){
            $(this).parents('.messagePanel').fadeOut();
        });

        // absolutePosition panel
        function showAbsolutePanel(btn, panel){
            $(btn).click(function (){
                $(panel).css({
                    "position": "absolute",
                    'left': $(this).offset().left + 'px',
                    'top': $(this).offset().top + $(this).height() + 5 + 'px',
                    'margin-left': '0',
                    'margin-top': '0'
                }).fadeIn();
            });
        }

        // show absolute panel
        showAbsolutePanel('.exchangeBtn', '.jiaJiaGetGood');
        showAbsolutePanel('.singleDiscount', '.chooseGift');
    }
    messagePanel();
})