


var ProductDetail = function(){
    var tipsTimer = 0;
    function showTips(text){
        clearTimeout(tipsTimer);
        var tips = $("#error_tips");
        tips.html(text);
        tipsTimer = setTimeout(function(){
            tips.html("");
        },3000);
    }

    var handleForm = function(){
        var ViewModel = function(){
            var self=this;
            self.getQueryString=function(name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
                var r = window.location.search.substr(1).match(reg);
                if (r != null) return unescape(r[2]); return null;
            };
            //购买数
            self.limitCount = ko.observable(limitCount);
            self.sellableCount = ko.observable(sellableCount);
            self.buyAmount=ko.observable(1);
            self.skuSelector = new SkuSelector();
            self.skuSelector.skuSelectListener = function(skuId){
                $("#btnbuy").hide();
                $("#buyInfo").fadeIn();
                var postData = {
                    productId:productId,
                    skuId:skuId,
                    merchantId:merchantId,
                    userId:userId
                }
                $.post("/" + rappId +"/serverHandler/getSellableCount.jsx",postData,function(ret){
                    if(ret.state=='ok' && ret.skuId==skuId){
                        if(ret.sellableCount>0){
                            $("#buyInfo").hide();
                            $(".btnbuy").show();
                            $("#btnNotification").hide();
                        }else{
                            $("#buyInfo").hide();
                            $(".btnbuy").hide();
                            $("#btnNotification").show();
                        }
                    }else{
                        $("#buyInfoMsg").text("出错了！检查是否有库存出错。")
                    }
                },"json");
                $.post("/"+rappId+"/serverHandler/getPriceBySkuId.jsx",postData,function(ret){
                    if(ret.state=="ok"&&ret.price!=0){
                        console.log(ret.price);
                        $(".summary .price strong").html("&yen"+(ret.price/100).toFixed(2));
                    }
                },"json")

            }
            self.add=function(){
                var newAmount=Number(self.buyAmount())+1;
                var limitCount = Number(self.limitCount());
                if(limitCount > 0){
                    if(newAmount > limitCount){
                        showTips("此商品限购" + limitCount + "个！");
                        newAmount = limitCount;
                    }
                }
                var sellableCount = Number(self.sellableCount());
                if(newAmount > sellableCount){
                    showTips("您所选的商品数量大于库存!");
                    newAmount = sellableCount;
                    if(newAmount <= 0){
                        newAmount = 1;
                    }
                }
                self.buyAmount(newAmount);
            }
            self.decrease=function(){
                var newAmount=Number(self.buyAmount())-1;
                if(newAmount<=0){
                    self.buyAmount(1);
                    return;
                }
                self.buyAmount(newAmount);
            }
            self.checknumber=function(strs) {
                var Letters = "1234567890";
                var i;
                var c;
                for (i = 0; i < strs.length; i ++) {
                    c = strs.charAt(i);
                    if (Letters.indexOf(c) == -1) {
                        return true;
                    }
                }
                return false;
            }
            self.checkBuyForm=function() {
                if (self.checknumber(self.buyAmount())) {
                    showTips("您填写购买的商品数量不是有效的数字");
                    self.buyAmount(1);
                    return false;
                } else {
                    if(isNaN(self.buyAmount())){
                        showTips("您填写购买的商品数量不是有效的数字");
                        self.buyAmount(1);
                        return false;
                    }
                    if (self.buyAmount() == "0") {
                        showTips("购买的商品数量必须大于0");
                        self.buyAmount(1);
                        return false;
                    }
                    if(Number(self.sellableCount()) <= 0){
                        showTips("商品库存为0，不能购买。");
                        return false;
                    }
                    if (self.buyAmount() == "999" || self.buyAmount().length > 3) {
                        showTips("尊敬的客户您订购的数量太多,请您与客服或与商家联系");
                        return false;
                    }
                }
                return true;
                //获取该商品购物车数量
//        var responseCount = jQuery.ajax({url:"/shopping/handle/get_product_buy_count.jsp?dumy=" + Math.random(),data:{productId:self.getQueryString("id")},async:false,cache:false}).responseText;
//        responseCount = Number(jQuery.trim(responseCount));
            }
            self.submitCartForm=function(successCallBack,failCallBack){
                var params={};
                params.objectId=self.getQueryString("id");
                params.amount=self.buyAmount();
                params.flowType="normal_add2cart";
                params.skuId= self.skuSelector.selectedSkuId();
                $.post("/shopping/handle/v3/do_buy.jsp",params,function(data){
                    if(data.indexOf("ok")>-1){
                        successCallBack(data);
                    }else{
                        data=JSON.parse(data);
                        if(!data.state) {
                            if (data.error_code == "product_not_exist") {
                                alert("该商品不存在!");
                            } else if (data.error_code == "product_off_shelves") {
                                alert("该商品已下架!");
                            } else if (data.error_code == "product_info_wrong") {
                                alert("商品销售信息有误!");
                            } else if (data.error_code == "product_out_of_stock") {
                                alert("商品库存不足!");
                            }else{
                                alert("加入购物车失败,未知错误!"+data.error_code);
                            }
                        }
                        failCallBack();
                    }
                })

            }
            self.add2Cart=function(){
                if(self.checkBuyForm()){
                    var successCallBack=function(data){
                        if(data){
                            var splitData = data.split("---");
                            if(splitData[0] == "ok"){
                                var cartStat = $.parseJSON(splitData[1]);
                                if(cartStat){
                                    $("#cartItemNumber").html(cartStat.productAmount);
                                    $("#sideCartItemNumber").html(Number(cartStat.productAmount) > 99 ? "99+" : cartStat.productAmount+"");
                                    var panel = $(".messagePanel.addToCart");
                                    panel.siblings(".messagePanel").hide();
                                    panel.html(template("add2CartMsgTemplate",cartStat));
                                    panelActive('.addToCart');
                                    $.get("/"+rappId+"/serverHandler/getBuyAlsoBuy.jsx",{pid:productId,mid:merchantId},function(reps){
                                        if(reps && reps.buyAlsoBuy.length > 0){
                                            $(".bd",panel).html(template("panelBuyAlsoBuyTemplate",reps)).show();
                                            $(".slide",panel).slide({titCell:'.slide-hd i', mainCell:'.slide-bd ul',vis:5,effect:"left"});
                                        }
                                    },"json");
                                }
                            }
                        }
                    }
                    self.submitCartForm(successCallBack);
                }
            }
            self.buyNow=function(){
                if(self.checkBuyForm()){
                    var successCallBack=function(){
                        window.location.href="/cart.html";
                    }
                    self.submitCartForm(successCallBack);
                }
            }
        }
        var model = new ViewModel();
        model.skuSelector.init(skus,inventoryAttrs);
        ko.applyBindings(model);
    }

    var handleImg = function(){
        // 图片上下滚动
        var count = $("#imageMenu li").length-4; /* 显示 6 个 li标签内容 */
        var interval = 85+10;
        var curIndex = 0;

        if($("#imageMenu li").length > 4){
            $('.scrollbutton').click(function () {

                if ($(this).hasClass('disabled')) return false;

                if ($(this).hasClass('smallImgUp'))--curIndex;
                else ++curIndex;

                $('.scrollbutton').removeClass('disabled');
                if (curIndex == 0) $('.smallImgUp').addClass('disabled');
                if (curIndex > count){
                    $('.smallImgDown').addClass('disabled');
                    return;
                }

                $("#imageMenu ul").stop(false, true).animate({ "marginLeft": -curIndex * interval + "px" }, 600);
            });
        }else{
            $('.scrollbutton').addClass('disabled');
        }

        // 解决 ie6 select框 问题
        $.fn.decorateIframe = function (options) {
            var browser=navigator.appName,b_version=navigator.appVersion;
            var isIE6 = false;
            if(browser=="Microsoft Internet Explorer"){
                var version=b_version.split(";"),trim_Version=version[1].replace(/[ ]/g,"");
                if(trim_Version=="MSIE6.0"){
                    isIE6 = true;
                }
            }

            if (isIE6) {
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
        //放大镜视窗
        $("#bigView").decorateIframe();
        //点击到中图

        $("#imageMenu li img").bind("click", function () {
            if ($(this).attr("id") != "onlickImg") {
                midChange($(this).attr("mid-src"),$(this).attr("view-src"));
                $("#imageMenu li").removeAttr("id");
                $(this).parent().attr("id", "onlickImg");
            }
        }).bind("mouseover", function () {
            if ($(this).attr("id") != "onlickImg") {
                clearTimeout(midChangeHandler);
                midChange($(this).attr("mid-src"),$(this).attr("view-src"));
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
                midChange($("#onlickImg img").attr("mid-src"),$("#onlickImg img").attr("view-src"));
            }, 500);
        }
        function midChange(midSrc,viewSrc) {
            $("#midimg").attr("src", midSrc).attr("view-src", viewSrc).load(function () {
                changeViewImg();
            });
        }
        //大视窗看图
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
        $("#midimg").mouseover(mouseover); //中图事件
        $("#midimg,#winSelector").mousemove(mouseover).mouseout(mouseOut); //选择器事件

        var $divWidth = $("#winSelector").width(); //选择器宽度
        var $divHeight = $("#winSelector").height(); //选择器高度
        var $imgWidth = $("#midimg").width(); //中图宽度
        var $imgHeight = $("#midimg").height(); //中图高度
        var $viewImgWidth = $viewImgHeight = $height = null; //IE加载后才能得到 大图宽度 大图高度 大图视窗高度

        function changeViewImg() {
            $("#bigView img").attr("src", $("#midimg").attr("view-src"));
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
            //console.log($imgLeft);
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

    }

    var handleRegion = function(){
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
    }

    var handleCombination = function(){
        var combination = $(".combination");
        if(combination){
            combination.on("click",".checkbox",function(evt){
                var curObj = $(this),totalPrice=0,totalMarketPrice=0;
                if(curObj.attr("memberPrice") == ""){
                    return;
                }
                var selectedPro = $(".checkbox[data-checked='true']",combination);
                selectedPro.each(function(){
                    var thisObj = $(this);
                    totalPrice += parseFloat(thisObj.attr("memberPrice"));
                    var marketPrice = thisObj.attr("marketPrice");
                    if(!marketPrice){
                        marketPrice = 0;
                    }
                    totalMarketPrice += parseFloat(marketPrice);
                });
                totalPrice = parseFloat(totalPrice).toFixed(2);
                totalMarketPrice = parseFloat(totalMarketPrice).toFixed(2);
                var splitTotalPrice = (totalPrice + "").split(".");
                var totalPriceBlock = $("#bestTotalPrice",combination);
                if(totalPrice > 9999){
                    totalPriceBlock.parent(".price").addClass("small");
                }else{
                    totalPriceBlock.parent(".price").removeClass("small");
                }
                totalPriceBlock.html("¥<span>" + splitTotalPrice[0] + "</span>." + splitTotalPrice[1]);
                $("#bestTotalMarketPrice",combination).html(totalMarketPrice > 0 ? "¥" + totalMarketPrice : '-');
                $("#bestSelectedNum",combination).html(selectedPro.length);
            });

            //最佳搭配立刻购买
            var errorMessages=[];
            $("#bestAddToCart").click(function(){
                var callback=function(){
                    if(errorMessages.length>0){
                        alert(errorMessages);
                    }else{
                        window.location.href="/cart.html";
                    }
                    errorMessages=[];

                }
                addToCart(callback);
            });

            var addToCart=function(callback){
                var selectedPro = $(".checkbox[data-checked='true']",combination);
                if(selectedPro.length == 1){
                    alert("请先选择商品！");
                    return;
                }
                var productItem = [];
                selectedPro.each(function(){
                    var thisObj = $(this);
                    productItem.push(thisObj.attr("objId"));
                });

                var params={};
                params.objectId=productItem[0];
                params.relationType="combination";
                params.flowType="normal_add2cart";
                var destObjIds="";
                for(var i=0;i<productItem.length;i++){
                    destObjIds=productItem[i]+","+destObjIds;
                }
                params.destObjIds=destObjIds;
                submitCart(params,callback);
            }

            var submitCart=function(params,callback){
                $.post("/shopping/handle/v3/do_buy.jsp",params,function(data){
                    if(data.indexOf("ok")<0){
                        data=$.parseJSON(data);
                        if(!data.state) {
                            if (data.error_code == "product_not_exist") {
                                errorMessages.push(params.objectId+":商品不存在");
                            } else if (data.error_code == "product_off_shelves") {
                                errorMessages.push(params.objectId+":商品已下架!");
                            } else if (data.error_code == "product_info_wrong") {
                                errorMessages.push(params.objectId+":商品销售信息有误!");
                            } else if (data.error_code == "product_out_of_stock") {
                                errorMessages.push(params.objectId+":商品库存不足!");
                            } else {
                                errorMessages.push(params.objectId+":加入购物车失败,未知错误!"+data.error_code);
                            }
                        }
                    }
                    if(callback){
                        callback();
                    }
                })
            }
        }
    }

    var handleGroupTab = function(){
        $('.combination .groupTabHd li').click(function (){
            $('.combination .groupTabBd .item').eq($(this).index()).fadeIn().siblings('.item').hide();
        });
    }

    var handleOther = function(){
        $(".messagePanel").on("click",".closeBtn",function(){
            $(".messagePanel").fadeOut();
        });


        var addFavorTimer = 0;
        $(".btnAddFavorite").on("click",function () {
            window.clearTimeout(addFavorTimer);
            var params = {};
            params["objId"] = $(this).attr("pid");
            params["type"] = "product";
            $.post("/" + rappId +"/serverHandler/favorAdd.jsx", params, function(msg) {
                if(msg.state){
                    msg["msgContent"] = "收藏成功!";
                }else{
                    if(msg.errorMsg == "not_login"){
                        window.location.href = "/login.html?rurl="+ location.href;
                        return;
                    }else if (msg.errorMsg == "existed") {
                        msg["msgContent"] = "此商品已收藏过!";
                    } else {
                        msg["msgContent"] = "系统繁忙请稍后再试！";
                    }
                }
                var panel = $(".messagePanel.addToFavorite");
                panel.siblings(".messagePanel").hide();
                panel.html(template("addFavorMsgTemplate",msg));
                panelActive('.addToFavorite',1000);
            },"json");
        });

        $("#detailTab a").on("click",function(){
            var curObj = $(this);
            curObj.siblings().removeClass("active");
            curObj.addClass("active");
            var targetId = curObj.attr("targetId");
            var targetObj = $("#" + targetId);
            targetObj.show();
            targetObj.siblings().hide();
            if(targetObj.is("#description") || targetObj.is("#model") || targetObj.is("#service")){
                $("#comment").show();
                $("#consult").show();
            }
//            targetObj.prevAll().hide();
//            targetObj.nextAll().show();
        });

        //    (function(){
//        var detailTab = $("#detailTab"),tabContent = $(".tabContent");
//        var wrapTop = detailTab.offset().top,tabContentBottomTop = tabContent.offset().top + tabContent.outerHeight() -20;
//        var vtop = $(document).scrollTop();
//        if(vtop >= wrapTop && vtop < tabContentBottomTop){
//            detailTab.css({"position":"fixed","top":0,"width":"920px"});
//        }
//        $(window).scroll(function() {
//            var vtop = $(document).scrollTop();
////            var tabContent = $(".tabContent");
////            var tabContentBottomTop = tabContent.offset().top + tabContent.outerHeight() -20;
//            if(vtop >= wrapTop && vtop < tabContentBottomTop){
//                detailTab.css({"position":"fixed","top":0,"width":"920px"});
//            }else{
//                detailTab.css({"position":"static","width":"100%"});
//            }
//        });
//
//
//    })()


        // toggle sale;
        function toggleSale (){
            var str1 = '展开';
            var str2 = '收起';

            $('.saleToggle').click(function (){
                $('.dt_lins.sale').toggleClass('active');
                var ruleList = $("#saleRuleList");
                if($('.dt_lins.sale').is(".active")){
                    $("li",ruleList).show();
                }else{
                    $("li:gt(2)",ruleList).hide();
                }


                var textobj = $(this).find('span');
                if (textobj.text() == '展开') {
                    textobj.text(str2);
                } else {
                    textobj.text(str1);
                }

            });
        }
        toggleSale();

        // recommend  tab;
        function recommendGroupTab(){
            $('.combination .groupTabHd li').click(function (){
                $('.combination .groupTabBd .item').eq($(this).index())
                    .fadeIn().siblings('.item').hide();

                $(this).addClass('active')
                    .siblings('li').removeClass('active');
            });
        }
//    recommendGroupTab();



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

        // good main tab
//        function goodMainTab(){
//            $('.detail_cont .nav a').click(function (){
//                $(this).addClass('active').siblings('a').removeClass('active');
//                $('.tabContent .tabItem').siblings('.tabItem').hide().eq($(this).index()).show();
//            });
//        }
//        goodMainTab();
    }

    function panelActive (panel,timeout){
        if(!timeout){
            timeout = 5000;
        }
        clearTimeout(timer);
        $(panel).fadeIn();

        var timer = setTimeout(function (){
            $(panel).fadeOut();
        }, timeout);

        $(panel).mouseover(function (){
            clearTimeout(timer);
        });

        $(panel).mouseout(function (){
            timer = setTimeout(function (){
                $(panel).fadeOut();
            }, timeout);
        });
    }

    function handleOtherAddToCart(){
        var initconfigs = {
            getAttrsUrl: "/appMarket/appEditor/getProductAttrs.jsp",
            completeUrl: "/shopping/handle/v3/do_buy.jsp",
            attr_container: ".attrBox",
            loadAfterEvent: {
                fireEvent: function (cxt) {
                    doLoadAfterEvent(cxt);
                }
            },
            completeAfterEvent: {
                fireEvent: function (cxt) {
//                layer.close(skuLayer);
                    var tips = '加入购物车<span class="floatTips'+ (!cxt.state ? ' error' : '') +'">' + cxt.msg + '<i></i></span>';
                    cxt.target.html(tips);
                    var timer = 0;
                    clearTimeout(timer);
                    var tipsObj = $(".floatTips",cxt.target);
                    tipsObj.fadeIn();
                    var timer = setTimeout(function (){
                        tipsObj.fadeOut();
                    }, 1000);

                    tipsObj.mouseover(function (){
                        clearTimeout(timer);
                    });

                    tipsObj.mouseout(function (){
                        timer = setTimeout(function (){
                            tipsObj.fadeOut();
                        }, 1000);
                    });

                }
            }
        };

        function doLoadAfterEvent(cxt) {
            if (!skuSelector) {
                return;
            }
            document.location.href = cxt.target.attr("href");
        }

        var skuSelector = new $.SkuSelector(initconfigs);
        $(".backededed").on("click",".btn-buy",function(){
            var curObj = $(this),pid = curObj.attr("pid");
            var config = {productId:pid,target:curObj};
            skuSelector.load(config);
            return false;
        });
    }

    return {
        init:function(){
            handleImg();
            handleForm();
//            handleRegion();
            handleCombination();
            handleGroupTab();
            handleOther();
            handleOtherAddToCart();
        }
    };
}();

$(function(){
    ProductDetail.init();

    var greyImg = $("#greyImg").attr("src");
    $("img[original]").lazyload({
        placeholder:greyImg,
        failurelimit: 10,
        effect: "fadeIn",
        threshold : 200
    });
});
