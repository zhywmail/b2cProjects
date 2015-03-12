//#import $OrderConfirm:services/OrderConfirmService.jsx
//#import Util.js
//#import OrderUtil.js
//#import order.js
//#import open-order.js
//#import OrderLog.js

(function () {

    $.log("=============================888888888...AutoConfirmOrderTask.jsx..begin...orderId" + orderId);
    var order = OrderService.getOrder(orderId);
    if (!order) {
        return;
    }

    //var amount = order["priceInfo"]["fTotalOrderPrice"];
    var jPriceInfo = order.priceInfo;
    var amount = jPriceInfo.fTotalOrderPrice;
    var payRecs = order.payRecs;
    var aliasCode = order.aliasCode;
    var createTime = order.createTime;
    var jBuyerInfo = order.buyerInfo;
    var buyUserId = jBuyerInfo.userId;
    var payType = order.payType;
    var states = order.states;
    var processState = states.processState;

    $.log("========================paytype(" + payType + ")====================================");
    if (payType != "301") {
        //订单不属于货到付款订单，不再继续
        return;
    }

    if (processState.state == "p101") {
        //OrderConfirmService.addLog(orderId, "OLT107", "待审核", "已确认", "货到付款订单满足自动确认规则，确认系统自动确认订单");
        OrderConfirmService.addLog(orderId, "OLT120", "", "", "订单为已确认状态，自动确认操作终止");
        return;
    }

    var confirmConditions = OrderConfirmService.getConditionList();
    if (!confirmConditions) {
        //没有配置自动审核条件，则不继续
        return;
    }

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
    if (totalRecords == "" || totalRecords == 0) {
        //如果不存在已签收的订单,不执行自动审核
        $.log("========member ID(" + buyUserId + ") has not orders on ewj");
        return;
    }


    var maxAmount = confirmConditions["max_amount"];
    var maxQuantity = confirmConditions["max_quantity"];
    var minOrders = confirmConditions["min_orders"];


    //订单金额超出或等于系统允许阀值
    if (parseFloat(amount) > parseFloat(maxAmount)) {
        $.log("==============order " + buyUserId + " has too much money,current " + amount);
        return;
    }
    //历史订单数小于系统允许阀值，则无法
    if (parseInt(totalRecords) < parseInt(minOrders)) {
        $.log("==============user " + buyUserId + " has not enough orders,current " + totalRecords);
        $.log(",should be " + minOrders + " at least");
        return;
    }
    var items=order["items"];
    var quantity = 0;
    for (var p in items) {
        quantity += items[p]["amount"];
    }
    //订单商品数量超过限额
    if(quantity>maxQuantity)
    {
        $.log("==============order " + buyUserId + " has too much quantity,current " + quantity);
        return;
    }

    //这里真正做订单确认事件
    var jResult = OpenOrderService.confirmOrder(orderId, "");
    if(jResult.code != "0"){
        OrderConfirmService.addLog(orderId, "OLT120", "", "", "自动确认订单失败，失败原因："+JSON.stringify(jResult));
    }

    $.log("=============================999999...AutoConfirmOrderTask.jsx..end...orderId" + orderId);
})();

