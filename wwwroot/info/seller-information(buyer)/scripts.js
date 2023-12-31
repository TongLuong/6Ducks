$(document).ready(function () {
    var urlParams = new URLSearchParams(window.location.search);
    var sellerID = urlParams.get("seller");

    $.get("/components/header.html", function (data) {
        $(".book-upload").css("display", "none");
        $(".logo").click(function () {
            location.href = '/MainPage';
        });
    });
    
    function displaySellerInfo() {
        $.ajax({
            url: "/Product/LoadSellerInfo",
            data: { "sellerID": sellerID },
            async: false,
            success: function (response) {
                $(".seller-name").text(response.displayName);
                $(".product_number span").text(response.productSale);
            }
        });
    }
    displaySellerInfo();
});