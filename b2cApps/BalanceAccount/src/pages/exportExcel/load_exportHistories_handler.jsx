//#import doT.min.js
//#import pigeon.js
//#import excel.js
//#import Util.js

(function () {
    var m = $.params["m"];
    var export_file_type = $.params["t"];

    var histories = Excel.getExcelList4History(m, export_file_type, "1000000");

    var template = $.getProgram(appMd5, "pages/exportExcel/load_export_histories.html");
    var pageData = {histories: histories};
    var pageFn = doT.template(template);
    out.print(pageFn(pageData));
})();
