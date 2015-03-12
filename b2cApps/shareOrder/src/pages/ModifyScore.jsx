//#import Util.js
//#import $ShareOrder:services/ShareOrderService.jsx

(function () {

    var score = $.params["s"];

    var jSOParam = {};
    jSOParam.score = score;
    ShareOrderService.saveShareOrderParam(jSOParam);

    out.print("ok");

})()