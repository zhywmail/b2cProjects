//#import Util.js
//#import product.js
//#import productCredit.js
//#import credit.js
//#import file.js
//#import column.js
//#import appraise.js
//#import message.js
//#import merchant.js
//#import commend.js
//#import price.js
//#import inventory.js
//#import ViewHistory.js
//#import login.js
//#import pageManager.js
//#import bom.js
//#import buyAlsoBuy.js
//#import viewAlsoView.js
//#import sysArgument.js


(function(processor){
    processor.on("all",function(pageData,dataIds,elems){
        //加入浏览历史
        ViewHistoryService.addProductViewHistory();
        var id = $.params.id;
        var mid = $.params.mid||pageData._m_;
        var spec = $.params.spec||"420X420";
        var appraisePage = $.params.appraisePage||"1";
        var messagePage = $.params.messagePage||"1";
        var enquiryType = $.params.enquiryType||"";
        var jProduct=ProductService.getProduct(id);
        jProduct.marketPrice=ProductService.getMarketPrice(jProduct)||"暂无价格";
//        jProduct.memberPrice=ProductService.getMemberPrice(jProduct)||"暂无价格";
//        jProduct.salesAmount=ProductService.getSalesAmount(id)||0;

        var cxt = "{attrs:{},factories:[{factory:MF},{factory:RPF}]}";
        var newProductPrices = ProductService.getPriceValueList(id, "", mid, 1, cxt, "normalPricePolicy");
        var realPrice = {};
        var realPrice = newProductPrices[1] && newProductPrices[1].formatUnitPrice;
        if (realPrice) {
            var price = parseFloat(realPrice).toFixed(2);
            var memberPrice = {};
            memberPrice["price"]=price;
            memberPrice["beginDateTime"] = newProductPrices[1].beginDateTime;
            memberPrice["endDateTime"] = newProductPrices[1].endDateTime;
            memberPrice["priceName"] = newProductPrices[1].priceName;
            memberPrice["limitCount"] = newProductPrices[1].limitCount;
            jProduct.realPrice=memberPrice;
        }else{
            var price = parseFloat(0);
            jProduct.realPrice = {"price":price};
        }

        //获取商家信息
//        var merchantInfo=MerchantService.getMerchant(mid);
//        var merchantCredit=CreditService.getCredit(mid);
//        merchantInfo.merchantCredit=merchantCredit;
        //获取登录用户信息
        var user = LoginService.getFrontendUser();
        //获取面包线数据
        var columnId = jProduct.columnId;
        var jColumn = {};
        if(columnId){
            jColumn=ColumnService.getColumn(jProduct.columnId);
        }
        var position=[];
        if(jColumn){
            position=ColumnService.getProductColumnPath(jColumn,true);
        }
        var sameLevelColumns = [];
        if(position && position.length > 0){
            if(position.length == 1){
                sameLevelColumns = ColumnService.getChildren(position[0].id);
            }else{
                sameLevelColumns = ColumnService.getChildren(position[position.length - 2].id);
            }
        }


        if(jProduct.combiType){
            position.push({name:"组合套餐"});
        }
        //获取图片列表
        var pics=ProductService.getPics(jProduct);

        var realPices={"normalPics":[],"bigPics":[],"smallPics":[]};
        for(var i=0;i<pics.length;i++){
            var relatedUrl=FileService.getRelatedUrl(pics[i].fileId,spec);
            var bigRelatedUrl=FileService.getRelatedUrl(pics[i].fileId,"800X800");
            var smallRelatedUrl=FileService.getRelatedUrl(pics[i].fileId,"85X85");
            realPices.normalPics.push(relatedUrl);
            realPices.bigPics.push(bigRelatedUrl);
            realPices.smallPics.push(smallRelatedUrl);
        }
        jProduct.pics=realPices;

        //获取商品属性
        jProduct.displayAttrs=ProductService.getProductAttrs(jProduct);
        if(jProduct.displayAttrs.length > 0){
            for(var i=0;i<jProduct.displayAttrs.length;i++){
                if(jProduct.displayAttrs[i].id == "attr_product_notice" || jProduct.displayAttrs[i].id == "attr_product_service"){
                    jProduct.displayAttrs.splice(i,1);
                    break;
                }
            }


        }

        //商品信用对象
//        var jCredit=ProductCreditService.getCredit(id);
        var credit={};
        //获取可卖数
        var skus=ProductService.getSkus(id);
        if(skus.length==1){
            jProduct.skuId=skus[0].id;
            var inventory = InventoryService.getSkuInventory(id,jProduct.skuId);
            jProduct.sellableCount = inventory.sellableCount;
        }


        //获取商品优惠规则
        if(user==null){
            user={};
        }
        var rules = ProductService.getClassifiedPossibleRules(id,jProduct.merchantId,user.id||"-1");
        //获取换购和赠品图片
        if(rules){

            if(rules.exchange && false){
                for(var i=0;i<rules.exchange.length;i++){
                    var lowPriceBuyProducts=rules.exchange[i].lowPriceBuyProducts;
                    if(lowPriceBuyProducts){
                        for(var j=0;j<lowPriceBuyProducts.length;j++){
                            var exchangeProduct=ProductService.getProduct(lowPriceBuyProducts[j].id);
                            var exchangeProductPic=ProductService.getPics(exchangeProduct);
                            if(exchangeProductPic.length>0){
                                var relatedUrl=FileService.getRelatedUrl(exchangeProductPic[0].fileId,"40X40");
                            }else{
                                var relatedUrl="/upload/nopic_200.jpg";
                            }
                            rules.exchange[i].lowPriceBuyProducts[j].pic=relatedUrl;
                            rules.exchange[i].lowPriceBuyProducts[j].merchantId=exchangeProduct.merchantId;
                        }
                    }
                }
            }
            if(rules.gift){
                for(var i=0;i<rules.gift.length;i++){
                    var presentProducts=rules.gift[i].presentProducts;
                    if(presentProducts){
                        for(var j=0;j<presentProducts.length;j++){
                            var presentProduct=ProductService.getProduct(presentProducts[j].id);
                            var presentProductPic=ProductService.getPics(presentProduct);
                            if(presentProductPic.length>0){
                                var relatedUrl=FileService.getRelatedUrl(presentProductPic[0].fileId,"25X25");
                            }else{
                                var relatedUrl="/upload/nopic_40.gif";
                            }
                            rules.gift[i].presentProducts[j].pic=relatedUrl;
                            rules.gift[i].presentProducts[j].merchantId=presentProduct.merchantId;
                        }
                    }
                }
            }
        }


//        //平均得分
//        credit.averageDescStore=ProductCreditService.getAverageTotalDescStore(jCredit);
//        //评价数量
//        credit.descAmount=ProductCreditService.getDescAmount(jCredit);
//        //好评率
//        credit.positiveCommentRate=ProductCreditService.getPositiveCommentRate(jCredit);
//        //中评率
//        credit.moderateCommentRate=ProductCreditService.getModerateCommentRate(jCredit);
//        //差评率
//        credit.negativeCommentRate=ProductCreditService.getNegativeCommentRate(jCredit);

        //获取评价内容
        var appraisSearchArgs={"productId":id,"effect":"true","searchIndex":true,"doStat":true,"page":appraisePage,"limit":10,"logoSize":"60X60"};
        var appraisSearchResult=AppraiseService.getProductAppraiseList(appraisSearchArgs);
//        if(appraisSearchResult && appraisSearchResult.totalCount > 0){
//            for(var i= 0,length=appraisSearchResult.totalCount;i< length;i++){
//                var record = appraisSearchResult.recordList[i];
//                if(record && appraisSearchResult.recordList[i].certifyInfo.certifyState != 1)
//                    appraisSearchResult.recordList.splice(i,1);
//            }
//            appraisSearchResult.totalCount = appraisSearchResult.recordList.length;
//        }

        //获取商品咨询
        var messageSearchArgs={"productId":id,"certifyState":"1","page":messagePage,"limit":20,"enquiryType":enquiryType};
        var messageSearchResult=MessageService.getProductEnquiry(id,enquiryType,messageSearchArgs);


        var productProcess=function(productList,imgSize){
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
                newProduct.marketPrice=ProductService.getMarketPrice(productList[i])||"";
                newProduct.memberPrice=ProductService.getMemberPrice(productList[i])||"";
                var pics=ProductService.getPics(productList[i]);
                var realPices=[];
                for(var j=0;j<pics.length;j++){
                    var relatedUrl=FileService.getRelatedUrl(pics[j].fileId,imgSize||"180X180");
                    realPices.push(relatedUrl);
                }
                newProduct.pics=realPices;
                newProduct.salesAmount=ProductService.getSalesAmount(productList[i].objId)||0;
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



        //获取浏览记录
//        var viewHistory=ViewHistoryService.getProductViewHistory(4);
//        var viewHistoryProducts=productProcess(viewHistory,"180X180");
        var viewHistoryProducts = [];

        //获取买过又买的数据
        var buyAlsoBuyIds=BuyAlsoBuyService.getBuyAlsoBuy(id);
        var buyAlsoBuyList=[];
        for(var i=0;i<buyAlsoBuyIds.size();i++){
            buyAlsoBuyList.push(ProductService.getProduct(buyAlsoBuyIds.get(i)));
        }
        var buyAlsoBuy=productProcess(buyAlsoBuyList,"180X180");
        if(buyAlsoBuy.length==0){

            //获取购买过该商品的还购买过的商品列表(后台推荐)
            var commendList=commendService.getCommendObjectList(mid,id,"historyBuy",10);
           buyAlsoBuy=productProcess(commendList,"180X180");
        }
//        var buyAlsoBuy = null

        //获取看了又看的数据
//        var viewAlsoViewIds=ViewAlsoViewService.getViewAlsoView(id);
//        var viewAlsoViewList=[];
//        for(var i=0;i<viewAlsoViewIds.size();i++){
//            viewAlsoViewList.push(ProductService.getProduct(viewAlsoViewIds.get(i)));
//        }
//        var viewAlsoView=productProcess(viewAlsoViewList,"180X180");
//        if(viewAlsoView.length==0){
//            //获取看了又看的商品列表(后台推荐)
//            var commendList=commendService.getCommendObjectList(mid,id,"historyView",10);
//            viewAlsoView=productProcess(commendList,"180X180");
//        }
        var viewAlsoView = null;


        //获取最佳组合
        var bestCommendList=commendService.getCommendObjectList(mid,id,"combination",50);
        var bestCommend=productProcess(bestCommendList,"180X180");

        //获取超值组合
        if(jProduct.combiType==1){
            //当前商品是组合套餐
            var mealList=[];
            var boms=bomService.getListByObjid(id);
            mealList.push({boms:boms});
        }else{
            var mealList=bomService.getCBNListByProductId('col_m_Promotional_004',mid,id,-1);
        }
        for(var i=0;i<mealList.length;i++){
            var bomObj=mealList[i];
            var cxt='{isGetInventory:\"true\",isCombi:\"true\",attrs:{},factories:[{factory:RPF},{factory:MF,isBasePrice:true},{factory:UGF,isGroup:true,entityId:c_101},{factory:UGF,isGroup:true,entityId:c_102},{factory:UGF,isGroup:true,entityId:c_103}]}';
//            bomObj.price=ProductService.getPriceValueList(bomObj.objId,'',bomObj.merchantId||mid,1,cxt,'normalPricePolicy');
            var boms=bomObj.boms;//套餐内商品
            for(var j=0;j<boms.length;j++){
                var productId=boms[j].relObjId;
                boms[j].product=ProductService.getProduct(productId);
                boms[j].product.memberPrice=ProductService.getMemberPrice(boms[j].product)||"暂无价格";
                var pics=ProductService.getPics(boms[j].product);
                var realPices=[];
                for(var i=0;i<pics.length;i++){
                    var relatedUrl=FileService.getRelatedUrl(pics[i].fileId,"180X180");
                    realPices.push(relatedUrl);
                }
                boms[j].product.pics=realPices;
            }
            bomObj.boms=boms;
        }

        //获取商品的sku
        var skus = ProductService.getSkus(id);
        var inventoryAttrs = ProductService.getInventoryAttrs(jProduct,"140X140");
        if(inventoryAttrs && inventoryAttrs.length > 0){
            for(var i=0;i<inventoryAttrs.length;i++){
                if(inventoryAttrs[i].userOperation == ""){}
            }
        }
        var validSkus =[];
        if(skus.length>1){
            skus.forEach(function(sku){
                if(!sku.isHead){
                    validSkus.push(sku);
                }
            });
        }
        else if(skus.length==1){
            validSkus.push(skus[0]);
        }


        var imgUrl =[];
        //var pageManager = PageManagerService.getPageManagerList("ctmpl_000_216","m_100",2);
        //if(pageManager){
        //    for(var i=0;i<pageManager.length;i++){
        //        var relatedUrl=FileService.getRelatedUrl(pageManager[i].DynaAttrs.attr_000_001.fileId,"1010X560");
        //        imgUrl.push(relatedUrl);
        //    }
        //}


        var seo={};
        //获取所有同级的分类
        var allChildrenColumn=[];
        if(jColumn){
            allChildrenColumn=ColumnService.getChildren(jColumn.parentId);
        }
        var seoColumnNames="";
        for(var i=0;i<allChildrenColumn.length;i++){
            seoColumnNames+=allChildrenColumn[i].name+",";
        }

        //用于seo得商品属性
        var seoProductAttr="";
        for(var i=0;i<jProduct.displayAttrs.length;i++){
            seoProductAttr+=jProduct.displayAttrs[i].name+":"+jProduct.displayAttrs[i].value;
        }
        //商品SEO优化
        var webName=SysArgumentService.getSysArgumentStringValue("head_merchant",'col_sysargument','webName_cn');
        if(!jProduct.seo_keywords){
            var seo_keywords=jProduct.name+"-"+webName+","+seoProductAttr+","+seoColumnNames;
            seo.seo_keywords=seo_keywords;
        }else{
            seo.seo_keywords=jProduct.seo_keywords
        }

        if(!jProduct.seo_title){
            var seo_title=jProduct.name+"-"+webName+","+jColumn.name+","+jProduct.name+"报价";
            seo.seo_title=seo_title;
        }else{
            seo.seo_title=jProduct.seo_title
        }
        if(!jProduct.seo_description){
            var seo_description=jProduct.name+"-"+webName+"报价"+seoProductAttr+",销量"+jColumn.name+","+webName+seoColumnNames+"价格优惠";
            seo.seo_description=seo_description;
        }else{
            seo.seo_description=jProduct.seo_description;
        }


        var infoCommendList=commendService.getCommendObjectList(mid,id,"i_related",5);
        var isCanBeBuy = ProductService.isCanBeBuy(jProduct);

        setPageDataProperty(pageData,"adv",imgUrl);
        setPageDataProperty(pageData,"product",jProduct);
        setPageDataProperty(pageData,"productRules",rules);
        setPageDataProperty(pageData,"productId",id);
        setPageDataProperty(pageData,"skus",JSON.stringify(validSkus));
        setPageDataProperty(pageData,"inventoryAttrs",JSON.stringify(inventoryAttrs));
        setPageDataProperty(pageData,"credit",credit);
        setPageDataProperty(pageData,"appraiseList",appraisSearchResult);
        setPageDataProperty(pageData,"messageList",messageSearchResult);
        setPageDataProperty(pageData,"position",position);//面包线
        setPageDataProperty(pageData,"bestCommend",bestCommend);//最佳组合
        setPageDataProperty(pageData,"bomList",mealList);//组合套餐
        setPageDataProperty(pageData,"viewHistoryProducts",viewHistoryProducts);
        setPageDataProperty(pageData,"buyAlsoBuy",buyAlsoBuy);//买了又买
        setPageDataProperty(pageData,"viewAlsoView",viewAlsoView);//看了又看
        setPageDataProperty(pageData,"infoCommend",infoCommendList);//相关信息
        setPageDataProperty(pageData,"seo",seo);//seo
//        setPageDataProperty(pageData,"merchantInfo",merchantInfo);//商家信息
        setPageDataProperty(pageData,"merchantId",mid);//商家id
        setPageDataProperty(pageData,"userId",user ? user.id : '');//用户id
        setPageDataProperty(pageData,"sameLevelColumns",sameLevelColumns);
        setPageDataProperty(pageData,"isCanBeBuy",isCanBeBuy);


    });
})(dataProcessor);