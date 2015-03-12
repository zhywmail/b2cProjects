$(function () {
    // toggoeGoodList
    function toggleGoodList(){
        $('.productListMore').click(function (){
            $(this).toggleClass('active')
                .parents('.product_list, .rowModA').toggleClass('active')
            ;
        });
    }
    toggleGoodList();
});