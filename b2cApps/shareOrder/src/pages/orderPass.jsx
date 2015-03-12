//#import Util.js
//#import $ShareOrder:services/ShareOrderService.jsx
(function () {

    var merchantId = $.params["m"];
    var id= $.params["id"];
    var state= $.params["state"];

    var jSOrder=ShareOrderService.getSOrder(id);
    ShareOrderService.deleteFromList("noAudit",jSOrder);
    ShareOrderService.passOrder(id,state,merchantId);


    response.sendRedirect("orderList.jsx?m="+merchantId);
})();