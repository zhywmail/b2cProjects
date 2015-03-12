//#import pigeon.js
//#import account.js


var ShareOrderService = (function (pigeon) {

    var objPrefix = "ShareOrder";
    var listPrefix = "ShareOrderList";

    var f = {

        addShareOrder: function (jSOrder) {
            var id = objPrefix + "_" + pigeon.getId("ShareOrder");  //生成一个晒单id
            var createTime = (new Date()).getTime();  //晒单时间

            jSOrder.id = id;
            jSOrder.createTime = createTime;

            f.saveSOrder(jSOrder);     //保存晒单

            var buyerUserId = jSOrder.buyerUserId;
            var productId = jSOrder.productId;

            //添加到所有的列表
            f.add2List("all", jSOrder);
            //添加到晒单人列表
            f.add2List(buyerUserId, jSOrder);
            //添加到商品对象列表
            f.add2List(productId, jSOrder);
            //添加到未审核的列表
            f.add2List("noAudit", jSOrder);

            return id;
        },
        addShareOrderParam: function (jParam) {
            var id = "ShareOrder_parameter";  //生成参数id
            var createTime = (new Date()).getTime();  //生成时间

            jParam.id = id;
            jParam.createTime = createTime;

            f.saveSOrder(jParam);     //保存参数

        },
        saveShareOrderParam: function (jParam) {
            var oParam = pigeon.getObject("ShareOrder_parameter");
            if (!oParam) {
                f.addShareOrderParam(jParam)
            } else {
                var modifyTime = (new Date()).getTime();  //修改时间
                jParam.modifyTime = modifyTime;
                pigeon.saveObject("ShareOrder_parameter", jParam);
            }
        },
        getShareOrderParamScore: function (id) {
            var jParam = pigeon.getObject(id);
            if (jParam) {
                return jParam.score;
            } else {
                return 0;
            }
        },
        saveSOrder: function (jSOrder) {
            pigeon.saveObject(jSOrder.id, jSOrder);
        },

        deleteSOrder: function (id) {
            var jSOrder = f.getSOrder(id);
            if (!jSOrder) {
                return;
            }
            var buyerUserId = jSOrder.buyerUserId;
            var productId = jSOrder.productId;

            //删除对象
            pigeon.saveObject(id, null);

            //从所有的列表中删除
            f.deleteFromList("all", jSOrder);
            //从晒单人列表中删除
            f.deleteFromList(buyerUserId, jSOrder);
            //从商品对象列表中删除
            f.deleteFromList(productId, jSOrder);
        },

        getSOrder: function (id) {
            return pigeon.getObject(id);
        },
        getListName: function (objId) {
            return listPrefix + "_" + objId;
        },
        getShareOrderList: function (objId, start, limit) {
            var listId = f.getListName(objId);
            return pigeon.getListObjects(listId, start, limit);
        },
        getShareOrderListSize: function (objId) {
            var listId = f.getListName(objId);
            return pigeon.getListSize(listId);
        },
        add2List: function (objId, jShareOrder) {
            var id = jShareOrder.id;
            var createTime = jShareOrder.createTime;
            var key = pigeon.getRevertComparableString(createTime / 1000, 11);
            var listName = f.getListName(objId);
            pigeon.addToList(listName, key, id);
        },
        deleteFromList: function (objId, jShareOrder) {
            var id = jShareOrder.id;
            var createTime = jShareOrder.createTime;
            var key = pigeon.getRevertComparableString(createTime / 1000, 11);
            var listName = f.getListName(objId);
            pigeon.deleteFromList(listName, key, id);
        },

        addMemberScore: function (buyerId, merchantId, addScore) {
            AccountService.updateUserBalance(buyerId, merchantId, "shoppingIntegral", addScore, "晒单送积分", "transactionType_shareOrder_give_integral");
        },

        passOrder: function (objId, state, merchantId) {
            var jOrder = ShareOrderService.getSOrder(objId);
            var audit = jOrder.audit;
            var addScore = f.getShareOrderParamScore("ShareOrder_parameter");
            var buyerId = jOrder.buyerUserId;

            if (0 == audit) {
                jOrder.audit = 1;
                if (0 == state) {
                    jOrder.state = 1;
                    ShareOrderService.saveSOrder(jOrder);
                    ShareOrderService.addMemberScore(buyerId, merchantId, addScore);
                } else {
                    jOrder.state = 0;
                    ShareOrderService.saveSOrder(jOrder);
                }
            } else {
                if (0 == state) {
                    jOrder.state = 1;
                    ShareOrderService.saveSOrder(jOrder);
                    ShareOrderService.addMemberScore(buyerId, merchantId, addScore);
                } else {
                    jOrder.state = 0;
                    ShareOrderService.saveSOrder(jOrder);
                    ShareOrderService.addMemberScore(buyerId, merchantId, 0 - addScore);
                }
            }
        }
    };

    return f;

})($S);