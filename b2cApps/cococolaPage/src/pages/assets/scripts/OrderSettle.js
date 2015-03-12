$(function () {
    var region_list = $(".region_list");
    region_list.each(function () {
        var that = $(this),
            region_list_title = that.find(">.title"),
            region_list_title_cnt = that.find(">.title>.cnt"),
            region_list_region_pop = that.find(">.region_pop"),
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
    });
    var panl_order = $(".product > .best > .panl_order");
    panl_order.each(function () {
        var that = $(this),
            title = that.find(">.title"),
            tip = title.find(">.tip"),
            but = title.find(">.but"),
            show_od = that.find(">.show_od"),
            table_od = that.find(">.table_od");
        but.click(function () {
            show_od.hide();
            but.hide();
            tip.show();
            table_od.show();
        });
    });
    $(".list_od > li").each(function () {
        var that = $(this),
            title = that.find(">.title"),
            panle = that.find(">.panle");
        title.click(function () {
            if (panle.is(":visible")) {
                panle.hide();
                that.removeClass("open");
            } else {
                panle.show();
                that.addClass("open");
            }
        });
    });
})