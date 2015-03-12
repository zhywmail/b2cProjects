//#import pigeon.js
//#import $OrderConfirm:services/OrderConfirmService.jsx
//#import Util.js
//#import order.js
//#import OrderUtil.js

(function () {
    var merchantId = $.params['m'];
    if (!merchantId) {
        merchantId = "m_100";
    }

    var orderid = "o_common_50000";
    if ($.params['orderid']) {
        orderid = $.params['orderid'];
    }

    var order = OrderService.getOrder(orderid);
    out.print(JSON.stringify(order) + "<br>");
    var amount = order["priceInfo"]["fTotalOrderPrice"];
    var payRecs = order["payRecs"];
    var aliasCode = order["aliasCode"];
    var createTime = order["createTime"];
    var buyUserId = order["buyerInfo"]["userId"];
    var payType = order["payType"];

    $.log("========================paytype(" + payType + ")====================================");

    //以下逻辑只针对货到付款订单
    if (payType == "301") {
        //进入搜索
        var searchArgs = {
            from: 0,
            limit: 1
        };
        //会员ID
        searchArgs.buyerId = buyUserId;
        searchArgs.processState = "p112";//已签收
        searchArgs.loadData = "0";//不加载订单数据,只要订单总数量

        var result = OrderService.searchOrder(searchArgs);
        var resultObj = JSON.parse(result);
        var totalRecords = resultObj.total;//订单总数量

        $.log("========================order total:(" + totalRecords + ")====================================");

        //如果不存在已签收的订单,不执行自动审核
        if (totalRecords == 0) {
            $.log("========member ID(" + buyUserId + ") has not orders on ewj");
            return;
        }
        if (totalRecords == "") {
            $.log("========member ID(" + buyUserId + ") program return empty on get the count of orders");
            return;
        }

        var confirmConditions = OrderConfirmService.getConditionList();
        //如果配置了自动审核条件，则继续后续逻辑
        if (confirmConditions) {
            var maxAmount = confirmConditions["max_amount"];
            //如果订单总金额小于金额阀值，则执行自动审核
            if (parseFloat(amount) < parseFloat(maxAmount)) {
                $.log("=======================order no:" + aliasCode + "less than max amount(" + maxAmount + ")");
                var states = OrderUtilService.getStates(order);//获得订单状态集合
                var processState = OrderUtilService.getProcessState(states);//获得订单现有处理状态

                processState.state = "p101";//设置为已确认
                var result=OrderUtilService.setProcessState(order,processState,"u_sys");//设置订单处理状态
                $.log("===========================excute OrderUtilService.setProcessState response:" + JSON.stringify(result));
                $.log("============================="+JSON.stringify(order));

            }
            else {
                $.log("=================pay amount" + amount + " exceed the maximum amount of " + maxAmount);
            }
        }
        else {
            $.log("==========================no conditions");
        }
    }


})();