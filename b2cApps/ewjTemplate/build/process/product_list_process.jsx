//#import Util.js
//#import product.js
//#import login.js
//#import user.js
//#import sysArgument.js
//#import column.js
//#import search.js
//#import file.js


(function (processor) {
    processor.on(":productGroup", function (pageData, dataIds, elems) {
        try {
            var productIds = [], versionList = [];
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
                    }
                }
            }

            if (productIds.length > 0) {
                var cxt = "{attrs:{},factories:[{factory:MF},{factory:RPF}]}";
                versionList = ProductService.getProductsByIdsWithoutPrice(productIds);
                versionList = ProductService.getPriceValueListBatch($.toJSONObjectList(versionList), userId, pageData["_m_"], cxt, "normalPricePolicy");
            }

            if (versionList.length > 0) {
                for (var i = 0, iLength = elems.length; i < iLength; i++) {
                    var elem = elems[i];
                    if (elem) {
                        for (var j = 0, jLength = elem.length; j < jLength; j++) {
                            var productId = elem[j].id;
                            for (var k = 0, vLength = versionList.length; k < vLength; k++) {
                                if (productId == versionList[k].objId) {
                                    var newProductPrices = versionList[k].priceValues;
                                    elem[j].merchantId = versionList[k].merchantId;
                                    elem[j].name = versionList[k].name;
                                    if (newProductPrices) {
                                        var realPrice = newProductPrices[1] && newProductPrices[1].formatUnitPrice;
                                        if (realPrice) {
                                            var price = parseFloat(realPrice).toFixed(2);
                                            elem[j]["memberPriceString"] = "￥" + price;
                                            elem[j]["memberPrice"] = price;
//                                            elem[j]["sellableCount"] = newProductPrices[1].sellableCount;
//                                            elem[j]["beginDateTime"] = newProductPrices[1].beginDateTime;
//                                            elem[j]["endDateTime"] = newProductPrices[1].endDateTime;
//                                            elem[j]["priceName"] = newProductPrices[1].priceName;
//                                            elem[j]["salesAmount"] = newProductPrices[1].salesAmount;

                                        } else {
                                            elem[j]["memberPriceString"] = "暂无价格";
                                        }
                                        ;
                                        var marketPrice = newProductPrices[0] && newProductPrices[0].formatUnitPrice;
                                        if (marketPrice) {
                                            var price = parseFloat(marketPrice).toFixed(2);
                                            elem[j]["marketPriceString"] = "￥" + price;
                                            elem[j]["marketPrice"] = price;
                                        }
                                    }
                                    break;
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


    processor.on("all", function (pageData, dataIds, elems) {
        var keyword = $.params.keyword || "";
        var page = $.params.page || 1;
        var displayStyle = $.params.displayStyle || "P";
        var spec = $.params.spec || "220X220";
        var showState = "s";
        var columnId = $.params.columnId || "c_10000";
        var brandId = $.params.brandId;
        var brandIds = $.params.brandIds;
        var orderBy = $.params.orderBy;
        var lowTotalPrice = $.params.lowTotalPrice;
        var highTotalPrice = $.params.highTotalPrice;
        var otherParams = $.params.otherParams;
        var pageSize = 20;
        var userId = LoginService.getFrontendUserId();
        var groups = [];
        if (!userId) {
            groups.push({id: 'c_101'});
        } else {
            groups = UserService.getUserGroups(userId);
        }

        //获取面包线数据
        var requestURI = request.getRequestURI() + "";//"/list-10000.html"
        var curColumn = ColumnService.getColumn(columnId);
        var position = [];
        position.push({id: curColumn.id, title: curColumn.title, url: requestURI + "?columnId=" + curColumn.id});
        var tempColumn = curColumn;
        while (tempColumn.parentId != "col_ProductRoot") {
            var tempColumn = ColumnService.getColumn(tempColumn.parentId);
            position.unshift({id: tempColumn.id, title: tempColumn.title, url: requestURI + "?columnId=" + tempColumn.id});
        }

        var fetchCount = 20;
        var searchArgs = {keyword: keyword, fromPath: (page - 1) * fetchCount, fetchCount: fetchCount, showState: showState, path: columnId};
        if (brandIds) {
            var ids = [];
            var splitBrand = brandIds.split("--");
            for (var i = 0; i < splitBrand.length; i++) {
                ids.push(splitBrand[i]);
            }
            searchArgs["brandIds"] = ids;
        }
        if (otherParams) {
            var jOtherParams = {};
            var attrsParams = otherParams.split(";");
            for(var i=0;i<attrsParams.length;i++){
                var attrParam = attrsParams[i].split("--");
                jOtherParams[attrParam[0] + '_multiValued'] = attrParam[1];

            }
            searchArgs.otherParams = jOtherParams;
        }
        if (lowTotalPrice) {
            searchArgs.lowTotalPrice = parseFloat(lowTotalPrice * 100);
        }
        if (highTotalPrice) {
            searchArgs.highTotalPrice = parseFloat(highTotalPrice * 100);
        }

        var searchFactLevel = 3 + position.length - 1;
        var column_facetColumn = "column_facetColumn" + searchFactLevel;
        var column_facetColumn1 = "column_facetColumn" + (searchFactLevel + 1);
        var column_facetColumn2 = "column_facetColumn" + (searchFactLevel + 2);
        searchArgs.facetFields = ["brandId", column_facetColumn, column_facetColumn1, column_facetColumn2];
        //属性搜索参数
        var attrTemp = ColumnService.getCompleteAttrTemplateByColumnId(columnId);
        if (attrTemp) {
            attrTemp = $.toJavaJSONObject(attrTemp);
        }
        var attrGroups = ColumnService.getAttrGroups(attrTemp);
        var importAttrList = [];
        for (var num = 0; num < attrGroups.size(); num++) {
            var obj = attrGroups.get(num);
            var importAttrs = ColumnService.getImportantPropertyAttrs(obj);
            if (importAttrs) {
                for (var num2 = 0; num2 < importAttrs.size(); num2++) {
                    var attr = JSON.parse("" + importAttrs.get(num2).toString());
                    searchArgs.facetFields.push(attr.id + "_multiValued");
                    importAttrList.push(attr);
                }
            }
        }

        if (orderBy == 'saleCount') {
            searchArgs.sortFileds = [
                {field: "salesCount", type: "LONG", reverse: true}
            ];
        }
        if (orderBy == 'priceHigh') {
            searchArgs.sortFields = [
                {
                    field: "price",
                    type: "LONG",
                    reverse: true
                }
            ];
        }
        if (orderBy == 'priceLow') {
            searchArgs.sortFields = [
                {
                    field: "price",
                    type: "LONG",
                    reverse: false
                }
            ];
        }
        if (orderBy == 'publishTime') {
            searchArgs.sortFields = [
                {
                    fieldId: "lastModifyTime",
                    type: "LONG",
                    reverse: true
                }
            ];
        }


        var searchArgsString = JSON.stringify(searchArgs);
        var javaArgs = ProductApi.ProductSearchArgs.getFromJsonString(searchArgsString);
        var results = ProductApi.IsoneFulltextSearchEngine.searchServices.search(javaArgs);
        var versionIds = results.getLists();

        var products = [];
        if(versionIds.size() > 0){
            var cxt = "{attrs:{},factories:[{factory:RPF},{factory:MF,isBasePrice:true}]}";
            var jContext = new ProductApi.JSONObject(cxt);
            var priceContext = jContext.getObjectMap();

            var versionList = [];
            var defaultSize = spec.split("X")[0];
            var versionList = ProductApi.IsoneModulesEngine.productService.getListDataByIds(versionIds, false);
            versionList = ProductApi.PricePolicyHelper.getPriceValueList(versionList, userId, pageData["_m_"], priceContext, "normalPricePolicy");  //一次性获取商品价格
            versionList = Packages.net.xinshi.isone.modules.filemanagement.ImageRelatedFileUtil.getProductsFirstRelatedSizeImageFullPath(versionList, spec, "/upload/nopic_" + defaultSize + ".jpg");//一次性获取商品大小图

            for (var i = 0; i < versionList.size(); i++) {
                var jProduct = JSON.parse(versionList.get(i).toString());
                var highlight = ProductApi.DiscoveryHelper.getHighLightText(results, javaArgs, jProduct.objId, jProduct.name);
                jProduct.name = "" + highlight;

                /*获取促销图标*/
                var promotionLogos = ProductApi.ProductFunction.getProductPromotionLogo($.toJavaJSONObject(jProduct), null);
//                var s = listOfJSON.toString();
//                var promotionLogos =  JSON.parse(s);
                var priceList = jProduct.priceValues;
                var memberPrice = "",marketPrice = "";
                if (priceList && priceList.length > 0) {
                    if (priceList[0]) {
                        memberPrice = priceList[0].formatTotalPrice;
                    }
                    if (priceList[1]) {
                        marketPrice = priceList[1].formatTotalPrice;
                    }
                }

                var productData = {
//                    promotionLogos: promotionLogos || "",
                    name: jProduct.name,
                    memberPrice: memberPrice,
                    marketPrice: marketPrice,
                    title: jProduct.title,
                    name: jProduct.name,
                    logos: [jProduct.image0],
                    id: jProduct.objId,
                    merchantId: jProduct.merchantId,
                    sellingPoint: jProduct.sellingPoint
                };
                products.push(productData);
            }
        }

        var result = {
            products: products,
            total: 0 + results.getTotal(),
            displayStyle: displayStyle
        }
        var searchCondition = ProductService.getFacets(results.getFacets(), column_facetColumn);

        //过滤搜索有效的分类
        var columnFilter = function (columnData, displayColumn) {
            var newColumnData = [];
            for (var i = 0; i < columnData.length; i++) {
                for (var j = 0; j < displayColumn.length; j++) {
                    if (columnData[i].id == displayColumn[j].name) {
                        newColumnData.push(columnData[i]);
                    }
                }
            }
            return newColumnData;
        }
        //搜索出来的商品所属分类
        var allSearchColumnsValue = [];
        for (var i = 0; i < 3; i++) {
            var searchColumnsValue = $.java2Javascript(results.getFacets().get("column_facetColumn" + (searchFactLevel + i)));
            for (var j = 0; j < searchColumnsValue.length; j++) {
                allSearchColumnsValue.push(searchColumnsValue[j]);
            }
        }
        //获取侧栏分类数据
        //取3级
        var leftColumnData = {};
//        leftColumnData["curColumn"] = ColumnService.getColumn(position[1].id);
//        var childrenColumns = ColumnService.getChildren(position[1].id);
//        for(var i =0;i<childrenColumns.length;i++){
//            var childrenList = ColumnService.getChildren(childrenColumns[i].id);
//            if(childrenList){
//                childrenColumns[i].children = childrenList;
//
//            }
//        }
//        leftColumnData["columnList"] = childrenColumns;

        var columnData = ColumnService.getChildren(columnId);
        columnData = columnFilter(columnData, allSearchColumnsValue);//过滤分类
        if(columnData){
            for (var i = 0; i < columnData.length; i++) {
                var childObj = ColumnService.getChildren(columnData[i].id);
                childObj = columnFilter(childObj, allSearchColumnsValue);//过滤分类
                columnData[i].children = childObj;
            }
        }
        searchCondition.DynaAttr = [];
        if (importAttrList && importAttrList.length > 0) {
            for (var i = 0; i < importAttrList.length; i++) {
                var attr = importAttrList[i];
                if(!(attr.standardValues && attr.standardValues.length > 0)){
                    continue;
                }
                var list = results.getFacets().get(attr.id + "_multiValued");
                if(!(list && list.size() > 0)){
                    continue;
                }
                var matchValues = JSON.parse(ProductService.getJSONFormList(list));
                if(matchValues && matchValues.length > 0){
                    var displayValues = [],isSelected = false,selectedKey = "";
                    for(var j=0;j<matchValues.length;j++){
                        for(var k=0;k<attr.standardValues.length;k++){
                            if(matchValues[j].name == attr.standardValues[k].id){
                                displayValues.push({id:matchValues[j].name,name:attr.standardValues[k].name,value:matchValues[j].value});
                                break;
                            }
                        }

                        if(searchArgs.otherParams){
                            for(var key in searchArgs.otherParams){
                                if(attr.id + "_multiValued" == key && matchValues[j].name == searchArgs.otherParams[key]){
                                    isSelected = true;
                                    selectedKey = matchValues[j].name
                                    break;
                                }
                            }
                        }
                    }
                    if(displayValues.length == 0){
                        continue;
                    }
                    searchCondition.DynaAttr.push({
                        attrName:attr.name,
                        attrId:attr.id,
                        displayValues:displayValues,
                        isSelected:isSelected,
                        selectedKey:selectedKey
                    });
                }
            }
        }



        var selectedConditions = [];
        if(searchCondition.brandList && searchArgs["brandIds"]){
            for(var i=0;i< searchCondition.brandList.length;i++){
                for(var j=0;j < searchArgs["brandIds"].length;j++){
                    if(searchArgs["brandIds"][j] == searchCondition.brandList[i].name){
                        selectedConditions.push({key:"品牌",value:searchCondition.brandList[i].displayName,type:"brand"});
                    }
                }
            }
        }
        if(searchCondition.DynaAttr){
            for(var i=0;i< searchCondition.DynaAttr.length;i++){
                if(searchCondition.DynaAttr[i].isSelected){
                    var condition = {
                        key:searchCondition.DynaAttr[i].attrName
                    };
                    var value = "";
                    var displayValues = searchCondition.DynaAttr[i].displayValues;
                    if(displayValues){
                        for(var j=0;j<displayValues.length;j++){
                            if(displayValues[j].id = searchCondition.DynaAttr[i].selectedKey){
                                value = displayValues[j].name;
                                break;
                            }
                        }
                    }
                    condition.value = value;
                    condition.type = "attr";
                    condition.attrId = searchCondition.DynaAttr[i].attrId;
                    selectedConditions.push(condition);
                }
            }
        }



        //获取浏览记录
        var viewHistoryProducts = [];
        var viewHistory = ProductService.getProductViewHistory(request, 6);
        for (var i = 0; i < viewHistory.length; i++) {
            var historyProduct = {};
            var salesAmount = ProductService.getSalesAmount(viewHistory[i].objId) || 0;
            historyProduct.salesAmount = salesAmount;
            historyProduct.id = viewHistory[i].objId;
            historyProduct.name = viewHistory[i].name;
            var hMarketPrice = ProductService.getMarketPrice(viewHistory[i]);
            var hMemberPrice = ProductService.getMemberPrice(viewHistory[i]);
            if (hMarketPrice) {
                historyProduct.marketPrice = parseFloat(hMarketPrice).toFixed(2);
            } else {
                historyProduct.marketPrice = "暂无价格";
            }
            if (hMemberPrice) {
                historyProduct.memberPrice = parseFloat(hMemberPrice).toFixed(2);
            } else {
                historyProduct.memberPrice = "暂无价格";
            }

            var pics = ProductService.getPics(viewHistory[i]);
            var realPices = [];
            for (var j = 0; j < pics.length; j++) {
                var relatedUrl = FileService.getRelatedUrl(pics[j].fileId, "180X180");
                realPices.push(relatedUrl);
            }
            historyProduct.pics = realPices;
            viewHistoryProducts.push(historyProduct);
        }

        //seo数据
        var seo = {};
        var columnObj = ColumnService.getColumn(columnId);
        var allChildrenColumn = ColumnService.getChildren(columnObj.parentId);
        var seoColumnNames = "";
        for (var i = 0; i < allChildrenColumn.length; i++) {
            seoColumnNames += allChildrenColumn[i].name + ",";
        }
        var webName = SysArgumentService.getSysArgumentStringValue("head_merchant", 'col_sysargument', 'webName_cn');
        seo.seo_description = columnObj.name + "-" + webName + ",销售" + seoColumnNames + "," + webName + seoColumnNames + "价格优惠";
        seo.seo_title = columnObj.name + "-" + webName + "," + columnObj.name + "报价";
        seo.seo_keywords = columnObj.name + "-" + webName + "," + seoColumnNames;


        var webUrl = SysArgumentService.getSysArgumentStringValue("head_merchant","col_sysargument","webUrl");
        setPageDataProperty(pageData,"webUrl",webUrl);
        setPageDataProperty(pageData,"userId",!userId ? "unknown" : userId);



        setPageDataProperty(pageData, "searchKeyword", keyword);
        //商品分类
        setPageDataProperty(pageData, "curColumn", curColumn);
        setPageDataProperty(pageData, "seo", seo);
        setPageDataProperty(pageData, "columnId", columnId);
        setPageDataProperty(pageData, "columnChildren", columnData);
        setPageDataProperty(pageData, "leftColumnData", leftColumnData);
        //面包线
        setPageDataProperty(pageData, "position", position);
        //商品列表数据
        setPageDataProperty(pageData, "productList", result);
        //可用搜索条件
        setPageDataProperty(pageData, "searchCondition", searchCondition);
        setPageDataProperty(pageData, "selectedConditions", selectedConditions);
        //用户已选搜索条件
        searchArgs.orderBy = orderBy;
        setPageDataProperty(pageData, "searchHistory", searchArgs);
        //浏览历史
        setPageDataProperty(pageData, "viewHistoryProducts", viewHistoryProducts);
        setPageDataProperty(pageData, "allSearchColumnsValue", allSearchColumnsValue);

        setPageDataProperty(pageData, "paramBrandId", brandId + "");
        setPageDataProperty(pageData, "requestURI", requestURI + "");
        setPageDataProperty(pageData, "requestParams", $.params);
        setPageDataProperty(pageData, "pageCur", parseInt(page));
        setPageDataProperty(pageData, "pageSize", parseInt(pageSize));
        setPageDataProperty(pageData, "pageNum", parseInt((result.total + pageSize - 1) / pageSize));
    });

})(dataProcessor);