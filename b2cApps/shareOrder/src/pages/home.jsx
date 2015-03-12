(function () {
//#import Util.js

    var merchantId = $.params["m"];

    response.sendRedirect("orderList.jsx?m="+merchantId);

})();

