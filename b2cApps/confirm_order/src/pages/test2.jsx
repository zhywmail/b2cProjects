//#import pigeon.js
//#import $OrderConfirm:services/OrderConfirmService.jsx
//#import Util.js
//#import order.js
//#import OrderUtil.js

(function () {

    var orderid= $.params["orderid"];
    var order=OrderService.getOrder(orderid);
    var items=order["items"];

    //var sItems="["+JSON.stringify( items)+"]";

    //var sItems=JSON.stringify(items);
    //var jItems=eval(sItems);

    out.print(JSON.stringify(items));
    out.print("<br>===============<br>");

    //out.print(JSON.stringify(items["o_common_item_140002"]["amount"]));

    out.print("=================len:"+items.length);


    for(var p in items)
    {
        out.print("<br><br><br>"+JSON.stringify(items[p]));
        out.print("p<br>items:="+items[p]["amount"]);
    }



})();