//#import Util.js
//#import file.js
//#import login.js
//#import user.js
//#import $ShareOrder:services/ShareOrderService.jsx


(function () {
    try {
        var userId = LoginService.getFrontendUserId();

        var ret = {};
        if (!userId) {
            //还没有登录
            ret.code = "notlogin";
            ret.msg = "notlogin";
            out.print(JSON.stringify(ret));
            return;
        }

        var jFileInfos = $.uploadFiles("jpg,jpeg,gif,png", 1024 * 1024);

        if (!jFileInfos) {
            out.print("没有可上传的文件");
            return;
        }


        var jShareOrder = {};
        var photoes = [];
        for (var i = 0; i < jFileInfos.length; i++) {
            var jFileInfo = jFileInfos[i];
            if (i == 0) {
                $.log(".........................................="+JSON.stringify(jFileInfo));
            }

            var fieldName = jFileInfo.fieldName;
            var fileId = jFileInfo.fileId;

            var jPhoto = {};
            jPhoto.fileId = fileId;
            jPhoto.fieldName = fieldName;
            jPhoto.fileUrlSmall= FileService.getRelatedUrl(fileId, "160X160");
            jPhoto.fileUrlOriginal= FileService.getRelatedUrl(fileId,"");

            photoes.push(jPhoto);
        }

        jShareOrder.photoes = photoes;
        jShareOrder.buyerUserId = userId;
        jShareOrder.productId = $.uploadParams["productId"];
        jShareOrder.title = $.uploadParams["title"];
        jShareOrder.desc = $.uploadParams["desc"];
        jShareOrder.state = 0;
        jShareOrder.audit = 0;



        var soId = ShareOrderService.addShareOrder(jShareOrder);
        out.print("<script>parent.submitForm('ok')</script>");
    }
    catch (e) {
        var msg = "操作出现异常：" + e;
        out.print("<script>parent.submitForm('" + msg + "')</script>");
    }
})();