//#import Util.js
//#import jobs.js

(function () {

    var orderId = ctx.get("order_id") + "";
    var order = ctx.get("order_object");

    var payType = order.optString("payType") + "";
    if (payType != "301") {
        //只有货到付款订单才放到异步队列
        return;
    }

    var when = (new Date()).getTime() + 1000;//一秒钟后执行

    //放到异步执行队列
    var jobPageId = "task/AutoConfirmOrderTask.jsx";
    var postData = {orderId: orderId};
    JobsService.submitTask(appId, jobPageId, postData, when);

    $.log(".................................doAfterOrdered.jsx end...........orderId="+orderId);

})();









