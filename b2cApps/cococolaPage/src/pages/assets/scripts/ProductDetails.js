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



    // ͼƬ���¹���
    var count = $("#imageMenu li").length - 5; /* ��ʾ 6 �� li��ǩ���� */
    var interval = 85+10;
    var curIndex = 0;

    $('.scrollbutton').click(function () {
        if ($(this).hasClass('disabled')) return false;

        if ($(this).hasClass('smallImgUp'))--curIndex;
        else ++curIndex;

        $('.scrollbutton').removeClass('disabled');
        if (curIndex == 0) $('.smallImgUp').addClass('disabled');
        if (curIndex == count - 1) $('.smallImgDown').addClass('disabled');

        $("#imageMenu ul").stop(false, true).animate({ "marginLeft": -curIndex * interval + "px" }, 600);
    });
    // ��� ie6 select�� ����
    $.fn.decorateIframe = function (options) {
        if ($.browser.msie && $.browser.version < 7) {
            var opts = $.extend({}, $.fn.decorateIframe.defaults, options);
            $(this).each(function () {
                var $myThis = $(this);
                //����һ��IFRAME
                var divIframe = $("<iframe />");
                divIframe.attr("id", opts.iframeId);
                divIframe.css("position", "absolute");
                divIframe.css("display", "none");
                divIframe.css("display", "block");
                divIframe.css("z-index", opts.iframeZIndex);
                divIframe.css("border");
                divIframe.css("top", "0");
                divIframe.css("left", "0");
                if (opts.width == 0) {
                    divIframe.css("width", $myThis.width() + parseInt($myThis.css("padding")) * 2 + "px");
                }
                if (opts.height == 0) {
                    divIframe.css("height", $myThis.height() + parseInt($myThis.css("padding")) * 2 + "px");
                }
                divIframe.css("filter", "mask(color=#fff)");
                $myThis.append(divIframe);
            });
        }
    }
    $.fn.decorateIframe.defaults = {
        iframeId: "decorateIframe1",
        iframeZIndex: -1,
        width: 0,
        height: 0
    }
    //�Ŵ��Ӵ�
    $("#bigView").decorateIframe();
    //�������ͼ

    $("#imageMenu li img").bind("click", function () {
        if ($(this).attr("id") != "onlickImg") {
            midChange($(this).attr("data-src").replace("small", "mid"));
            $("#imageMenu li").removeAttr("id");
            $(this).parent().attr("id", "onlickImg");
        }
    }).bind("mouseover", function () {
        if ($(this).attr("id") != "onlickImg") {
            clearTimeout(midChangeHandler);
            midChange($(this).attr("data-src").replace("small", "mid"));
            //$(this).css({ "border": "3px solid #959595" });
        }
    }).bind("mouseout", function () {
        if ($(this).attr("id") != "onlickImg") {
            $(this).removeAttr("style");
            cheangMid();
        }
    });
    $("#winSelector").bind("mouseover", function () {
        clearTimeout(midChangeHandler);
    }).bind("mouseout", function () {
        cheangMid();
    });
    var midChangeHandler = null;
    function cheangMid() {
        midChangeHandler = setTimeout(function () {
            midChange($("#onlickImg img").attr("data-src").replace("small", "mid"));
        }, 500);
    }
    function midChange(src) {
        $("#midimg").attr("src", src).load(function () {
            changeViewImg();
        });
    }
    //���Ӵ���ͼ
    function mouseover(e) {
        if ($("#winSelector").css("display") == "none") {
            $("#winSelector,#bigView").show();
        }
        $("#winSelector").css(fixedPosition(e));
        e.stopPropagation();
    }
    function mouseOut(e) {
        if ($("#winSelector").css("display") != "none") {
            $("#winSelector,#bigView").hide();
        }
        e.stopPropagation();
    }
    $("#midimg").mouseover(mouseover); //��ͼ�¼�
    $("#midimg,#winSelector").mousemove(mouseover).mouseout(mouseOut); //ѡ�����¼�

    var $divWidth = $("#winSelector").width(); //ѡ�������
    var $divHeight = $("#winSelector").height(); //ѡ�����߶�
    var $imgWidth = $("#midimg").width(); //��ͼ���
    var $imgHeight = $("#midimg").height(); //��ͼ�߶�
    var $viewImgWidth = $viewImgHeight = $height = null; //IE���غ���ܵõ� ��ͼ��� ��ͼ�߶� ��ͼ�Ӵ��߶�

    function changeViewImg() {
        $("#bigView img").attr("src", $("#midimg").attr("src").replace("mid", "big"));
    }
    changeViewImg();
    $("#bigView").scrollLeft(0).scrollTop(0);
    function fixedPosition(e) {
        if (e == null) {
            return;
        }
        var $imgLeft = $("#midimg").offset().left; //��ͼ��߾�
        var $imgTop = $("#midimg").offset().top; //��ͼ�ϱ߾�
        X = e.pageX - $imgLeft - $divWidth / 2; //selector������� X
        Y = e.pageY - $imgTop - $divHeight / 2; //selector������� Y
        X = X < 0 ? 0 : X;
        Y = Y < 0 ? 0 : Y;
        X = X + $divWidth > $imgWidth ? $imgWidth - $divWidth : X;
        Y = Y + $divHeight > $imgHeight ? $imgHeight - $divHeight : Y;
        console.log($imgLeft);
        if ($viewImgWidth == null) {
            $viewImgWidth = $("#bigView img").outerWidth();
            $viewImgHeight = $("#bigView img").height();
            if ($viewImgWidth < 200 || $viewImgHeight < 200) {
                $viewImgWidth = $viewImgHeight = 840;
            }
            $height = $divHeight * $viewImgHeight / $imgHeight;
        }
        var scrollX = X * $viewImgWidth / ($imgWidth + 140);
        var scrollY = Y * $viewImgHeight / ($imgHeight + 140);
        $("#bigView img").css({ "left": scrollX * -1, "top": scrollY * -1 });

        return { left: X, top: Y };
    }


    // panel inner recommend slide
    function tuijianSlider (){
        jQuery(".recommend1 .slide").slide({titCell:'.slide-hd i', mainCell:'.slide-bd ul',vis:5,effect:"left"});
        jQuery(".recommend2 .slide").slide({titCell:'.slide-hd i', mainCell:'.slide-bd ul',vis:5,effect:"left"});
    }
    tuijianSlider();

    // dynamic set scrollContent
    function dynamicScrollShow(){
        var itemCount = $('.over .list:first li').length;
        var itemWidth = $('.over .list:first li:first').innerWidth();
        $('.over .list:first').width(itemCount * itemWidth);

        var itemCount = $('.over .list:last li').length;
        var itemWidth = $('.over .list:last li:first').innerWidth();
        $('.over .list:last').width(itemCount * itemWidth);

    }
    dynamicScrollShow();

    // recommend  tab;
    function recommendGroupTab(){
        $('.combination .groupTabHd li').click(function (){
            $('.combination .groupTabBd .item').eq($(this).index())
                .fadeIn().siblings('.item').hide();

            $(this).addClass('active')
                .siblings('li').removeClass('active');
        });
    }
    recommendGroupTab();

    // toggle sale;
    function toggleSale (){
        var str1 = '展开';
        var str2 = '收起';

        $('.saleToggle').click(function (){
            $('.dt_lins.sale').toggleClass('active');
            var textobj = $(this).find('span');

            if (textobj.text() == '展开') {
                textobj.text(str2);
            } else {
                textobj.text(str1);
            }

        });
    }
    toggleSale();

    // good main tab
    function goodMainTab(){
        $('.detail_cont .nav a').click(function (){
            $(this).addClass('active')
                .siblings('a').removeClass('active');

            $('.tabContent .tabItem').siblings('.tabItem').hide()
                .eq($(this).index()).show();
        });
    }
    goodMainTab();

    // add to cart and favorite
    $('.btnAddToCart').click(function (){
        panelActive('.addToCart');
    });

    $('.btnAddFavorite').click(function (){
        panelActive('.addToFavorite');
    });

    function panelActive (panel){
        clearTimeout(timer);
        $(panel).fadeIn();

        var timer = setTimeout(function (){
            $(panel).fadeOut();
        }, 2000);

        $(panel).mouseover(function (){
            clearTimeout(timer);
        });

        $(panel).mouseout(function (){
            timer = setTimeout(function (){
                $(panel).fadeOut();
            }, 2000);
        });
    }
});