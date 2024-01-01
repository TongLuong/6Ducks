$(this).ready(function () {
    var urlParams = new URLSearchParams(window.location.search);
    /*var userID = urlParams.get('user');
    var type = 0; // 0: buyer, 1: seller, (2: admin)
    if (userID == null) {
        userID = urlParams.get('seller'); // ideal condition
        type = 1;
    }*/
    var seller_id = urlParams.get('receiver');

    $.get("/components/header.html", function (data) {
        $("body").prepend(data);
        $(".book-upload").css("display", "none");
        $(".logo").click(function () {
            location.href = "MainPage";
        });
    });

    $.get("/components/footer.html", function (data) {
        $("body").append(data);
    });

    $(".container_seller img").click(function (e) {
        e.preventDefault();
        
        location.href = "UserInfo/SellerInfo";
    });

    $.get({
        url: "/SellerInfoSeller/DisplayRating",
        data: { seller: seller_id },
        success: function (response) {
            //bar
            $(".bar_1").css(
                "width",
                (response.sum ? (response.star[0] / response.sum) * 100 : 0) + "%"
            );
            $(".bar_2").css(
                "width",
                (response.sum ? (response.star[1] / response.sum) * 100 : 0) + "%"
            );
            $(".bar_3").css(
                "width",
                (response.sum ? (response.star[2] / response.sum) * 100 : 0) + "%"
            );
            $(".bar_4").css(
                "width",
                (response.sum ? (response.star[3] / response.sum) * 100 : 0) + "%"
            );
            $(".bar_5").css(
                "width",
                (response.sum ? (response.star[4] / response.sum) * 100 : 0) + "%"
            );

            $(".bar_1 span").text(
                (response.sum ? (response.star[0] / response.sum).toPrecision(4) * 100 : 0) + "%"
            );
            $(".bar_2 span").text(
                (response.sum ? (response.star[1] / response.sum).toPrecision(4) * 100 : 0) + "%"
            );
            $(".bar_3 span").text(
                (response.sum ? (response.star[2] / response.sum).toPrecision(4) * 100 : 0) + "%"
            );
            $(".bar_4 span").text(
                (response.sum ? (response.star[3] / response.sum).toPrecision(4) * 100 : 0) + "%"
            );
            $(".bar_5 span").text(
                (response.sum ? (response.star[4] / response.sum).toPrecision(4) * 100 : 0) + "%"
            );
            //star

            $("input#star-" + Math.round(Number(response.avgRating))).prop(
                "checked",
                true
            );

            $("#rating-avg").text("(" + response.avgRating + "/5) | " +
                response.sum + " đánh giá");
        }
    });

    $.ajax({
        url: "/Chat/ProfileInfo",
        data: { sellerID: seller_id },
        success: function (response) {

            $('.seller-name').text(response.name);
            //$('span.join-time span').text(response.time);
            $('.product_number span').text(response.product);
        },
        error: function (e) {
            alert("error" + e);
        }
    });
});