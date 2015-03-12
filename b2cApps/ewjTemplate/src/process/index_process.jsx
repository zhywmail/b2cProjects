//#import Util.js
//#import login.js
//#import product.js
//#import file.js
//#import DateUtil.js
//#import sysArgument.js

(function (processor) {
    processor.on("all",function(pageData,dataIds,elems){
        var mid = "head_merchant";
        var webName = SysArgumentService.getSysArgumentStringValue(mid,"col_sysargument","webName_cn");
//        var webUrl = SysArgumentService.getSysArgumentStringValue(mid,"col_sysargument","webUrl");
        var userId = "unknown";
        var user = LoginService.getFrontendUser();
        if(user){
            userId = user.id;
        }
        setPageDataProperty(pageData,"webName",webName);
//        setPageDataProperty(pageData,"webUrl",webUrl);
        setPageDataProperty(pageData,"userId",userId);
    });

    processor.on(":productGroup", function (pageData, dataIds, elems) {
        var selfApi = new JavaImporter(
            Packages.net.xinshi.isone.modules,
            Packages.net.xinshi.isone.modules.product.inventory,
            Packages.org.json
        );
        try {
            var productIds = [],getInventoryProductIds = [], versionList = [];
            var user = LoginService.getFrontendUser();
            var userId = user ? user.id : '-1';

            for (var i = 0, iLength = elems.length; i < iLength; i++) {
                var elem = elems[i];
                if (elem) {
                    var dataId = dataIds[i];
                    for (var j = 0, jLength = elem.length; j < jLength; j++) {
                        var productId = elem[j].id;
                        if (productIds.indexOf(productId) == -1) {
                            productIds.push(productId);
                        }
                        if(dataId == "qiangxian" || dataId == "groupOn"){
                            if (getInventoryProductIds.indexOf(productId) == -1) {
                                getInventoryProductIds.push(productId);
                            }
                        }
                    }
                }
            }


            if (productIds.length > 0) {
//                var cxt = "{isGetInventory:'true',attrs:{},factories:[{factory:MF},{factory:RPF}]}";
                var cxt = "{attrs:{},factories:[{factory:MF},{factory:RPF}]}";
                versionList = ProductService.getProductsByIdsWithoutPrice(productIds);
                versionList = ProductService.getPriceValueListBatch($.toJSONObjectList(versionList), userId, pageData["_m_"], cxt, "normalPricePolicy");
                if (versionList.length > 0) {
                    var productStocks = {};
                    for (var i = 0, iLength = elems.length; i < iLength; i++) {
                        var elem = elems[i];
                        if (elem) {
                            for (var j = 0, jLength = elem.length; j < jLength; j++) {
                                var productId = elem[j].id;
                                for (var k = 0, vLength = versionList.length; k < vLength; k++) {
                                    if (productId == versionList[k].objId) {
                                        elem[j].merchantId = versionList[k].merchantId;
                                        elem[j].name = versionList[k].name;
                                        var newProductPrices = versionList[k].priceValues;

                                        if (newProductPrices) {
                                            var realPrice = newProductPrices[1] && newProductPrices[1].formatUnitPrice;
                                            if (realPrice) {
                                                var price = parseFloat(realPrice).toFixed(2);
                                                elem[j]["memberPriceString"] = "￥" + price;
                                                elem[j]["memberPrice"] = price;
//                                                elem[j]["sellableCount"] = newProductPrices[1].sellableCount;
                                                elem[j]["beginDateTime"] = newProductPrices[1].beginDateTime;
                                                elem[j]["endDateTime"] = newProductPrices[1].endDateTime;
                                                elem[j]["priceName"] = newProductPrices[1].priceName;
                                                elem[j]["salesAmount"] = newProductPrices[1].salesAmount;
                                            } else {
                                                elem[j]["memberPriceString"] = "暂无价格";
                                                elem[j]["memberPrice"] = "";
                                            }
                                            ;
                                            var marketPrice = newProductPrices[0] && newProductPrices[0].formatUnitPrice;
                                            if (marketPrice) {
                                                var price = parseFloat(marketPrice).toFixed(2);
                                                elem[j]["marketPriceString"] = "￥" + price;
                                                elem[j]["marketPrice"] = price;
                                            }
                                        }

                                        if (getInventoryProductIds.indexOf(productId) > -1) {
                                            if (productStocks[productId]) {
                                                elem[j]["sellableCount"] = productStocks[productId];
                                            }else{
                                                var jProduct = $.toJavaJSONObject({"objId":versionList[k].objId,"merchantId":versionList[k].merchantId});
                                                var jProductStock = selfApi.ProductInventoryHelper.getOneProductInventory(jProduct,jProduct["merchantId"]);
                                                productStocks[productId] = jProductStock.optInt(jProduct.optString("objId"));
                                                elem[j]["sellableCount"] = productStocks[productId];
                                            }
                                            var sellableCount = parseInt(productStocks[productId]);
                                            var stockWidth = sellableCount > 100 ? 100 : sellableCount;
                                            elem[j]["stockWidth"] = stockWidth;

                                        }

                                        var pics = ProductService.getPics(versionList[k]);
                                        if(pics.length > 0){
                                            elem[j]["imgUrl"] = FileService.getRelatedUrl(pics[0].fileId,elem[j]["spec"]);
                                        }

                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } catch (e) {
            $.log(e);
        }
    });

//    processor.on("#groupOn", function (pageData, dataIds, elems) {
//        var selfApi = new JavaImporter(
//            Packages.net.xinshi.isone.modules,
//            Packages.net.xinshi.isone.modules.product.inventory,
//            Packages.org.json
//        );
//        var elem = elems[0][0];
//        if(elem){
//            var productId = elem.id;
//            var jProduct = selfApi.IsoneModulesEngine.productService.getProduct(productId);
//            var jProductStock = selfApi.ProductInventoryHelper.getOneProductInventory(jProduct,jProduct.optString("merchantId"));
//            elem["sellableCount"] = jProductStock.optInt(jProduct.optString("objId"));
//        }
//    });

})(dataProcessor);
