//#import doT.min.js
//#import pigeon.js
//#import $OrderConfirm:services/OrderConfirmService.jsx
//#import Util.js

(function () {
    var merchantId = $.params['m'];
    if (!merchantId) {
        merchantId = "m_100";
    }
    var max_amount = $.params['max_amount'];
    var action = $.params['action'];
    var max_quantity = $.params["max_quantity"];
    var min_orders = $.params["min_orders"];

    var conditions = {}
    conditions.max_amount = max_amount;
    conditions.max_quantity = max_quantity;
    conditions.min_orders = min_orders;

    if (action == "add") {
        var id = OrderConfirmService.addCondition(conditions);
    }
    else {
        var id = OrderConfirmService.addCondition(conditions);
    }

    response.sendRedirect("ConditionList.jsx?m="+merchantId);
    //out.print("...save ok,id="+id);

})();