//#import Util.js
//#import product.js
//#import buyAlsoBuy.js
//#import commend.js
//#import price.js
//#import inventory.js
//#import file.js
//#import json2.js

;(function(){
    try{
        var productProcess = function(productList,imgSize){
            var newProductList=[];
            for(var i=0;i<productList.length;i++){
                var newProduct={};
                newProduct.id=productList[i].objId;
                newProduct.name=productList[i].name;
                newProduct.merchantId=productList[i].merchantId;
                if(!productList[i].price){
                    var priceObj=priceService.getPrice(productList[i].priceId);
                    productList[i].price=priceObj;
                }
//                newProduct.marketPrice=ProductService.getMarketPrice(productList[i])||"暂无价格";
                newProduct.memberPrice=ProductService.getMemberPrice(productList[i]);
                if(newProduct.memberPrice){
                    var splitPrice = (newProduct.memberPrice + "").split(".");
                    if(splitPrice.length == 1){
                        splitPrice[1] = "00";
                    }
                    newProduct.splitMemberPrice = splitPrice;
                }
                var pics=ProductService.getPics(productList[i]);
                var realPices=[];
                for(var j=0;j<pics.length;j++){
                    var relatedUrl=FileService.getRelatedUrl(pics[j].fileId,imgSize||"90X90");
                    realPices.push(relatedUrl);
                }
                newProduct.pics=realPices;
//                newProduct.salesAmount=ProductService.getSalesAmount(productList[i].objId)||0;
                var skus=ProductService.getSkus(productList[i].objId);
                if(skus.length==1){
                    newProduct.skuId=skus[0].id;
                    var inventory = InventoryService.getSkuInventory(productList[i].objId,newProduct.skuId);
                    newProduct.sellableCount = inventory.sellableCount;
                }
                newProductList.push(newProduct);
            }
            return newProductList;
        }

        var pid = $.params.pid;
        var mid = $.params.mid;
        var imgSize = $.params.size||"90X90";
        var result = {"buyAlsoBuy":[],"count":0};
        if(pid){
            var buyAlsoBuyIds=BuyAlsoBuyService.getBuyAlsoBuy(pid);
            var buyAlsoBuyList=[];
            for(var i=0;i<buyAlsoBuyIds.size();i++){
                buyAlsoBuyList.push(ProductService.getProduct(buyAlsoBuyIds.get(i)));
            }
            var buyAlsoBuy=productProcess(buyAlsoBuyList,imgSize);
            if(buyAlsoBuy.length==0){
                //获取购买过该商品的还购买过的商品列表(后台推荐)
                var commendList=commendService.getCommendObjectList(mid,pid,"historyBuy",10);
                buyAlsoBuy=productProcess(commendList,imgSize);
            }
            result["buyAlsoBuy"] = buyAlsoBuy;
            result["count"] = buyAlsoBuy.length;
        }



        out.print(JSON.stringify(result));
    }catch(e){
        var ret = {
            state:false
        }
        $.log(e);
        out.print(JSON.stringify(ret));
    }
})();