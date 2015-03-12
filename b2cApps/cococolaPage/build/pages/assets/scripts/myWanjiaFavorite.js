/* Created by Qianglong Mo 2015 */

$(function (){
    $('#myFavoriteSelectAll').click(function (){
        if ($(this).attr('data-checked') == 'true') {
            $('.myFavoriteTable .checkbox').attr('data-checked', true).addClass('active');
        } else {
            $('.myFavoriteTable .checkbox').attr('data-checked', false).removeClass('active');
        }
    });

    $('.myFavoriteTable .checkbox').click(function (){

        console.log($('.myFavoriteTable .checkbox[data-checked="true"]').length, $('.myFavoriteTable .checkbox').length);
        if($('.myFavoriteTable .checkbox[data-checked="true"]')
                .length == $('.myFavoriteTable .checkbox').length){
            $('#myFavoriteSelectAll').attr('data-checked', true).addClass('active');
        } else {
            $('#myFavoriteSelectAll').attr('data-checked', false).removeClass('active');
        }
    });
});