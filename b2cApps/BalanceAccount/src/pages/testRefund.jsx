//#import pigeon.js
//#import RefundOrder.js
//#import util.js
//#import DateUtil.js

(function () {
    out.print("<a href='' class='btn btn-default'>刷新</a><br>");
    out.print("............byId<br>");
    var jRefundOrder = RefundOrderService.getRefundOrder('r_140000');
    out.print("id:" + jRefundOrder.id + "<br>");
    out.print("............列表<br>");
    //退款单类型,商家ID, start,limit
    var result = RefundOrderService.getRefundOrderList('return', 'm_50000', 0, -1);
    if (result && result.total > 0) {
        for (var i = 0; i < result.lists.length; i++) {
            var log = result.lists[i];
            out.print("<br>id:" + log.id);
        }
    } else {
        out.print("没有记录");
    }
    var beginTime = DateUtil.getLongTime("2014-01-01 12:00:00");//退款单生成时间(开始)
    var endTime = DateUtil.getLongTime("2016-01-01 12:59:59");//退款单生成时间(结束)
    var returnFields = "id,orderAliasCode,refundInfo";//要提取的字段
    var searchArgs = {};
    //searchArgs.refundType = "cancel";
    searchArgs.beginCreateTime = beginTime;
    searchArgs.endCreateTime = endTime;
    searchArgs.fields = returnFields;
    out.print("<br>............搜索<br>");
    result = RefundOrderService.searchRefundOrder(searchArgs, 0, 1000);
    if (result && result.total > 0) {
        for (var i = 0; i < result.lists.length; i++) {
            var obj = result.lists[i];
            out.print("<br>id:" + obj.id);
            out.print("<br>refundInfo:" + JSON.stringify(obj.refundInfo));//refundInfo是一个数组,可以匹配refundWayId,字段 state =1表示已退款,refundOrderTime:是退款时间
        }
    } else {
        out.print("没有记录");
    }
})();