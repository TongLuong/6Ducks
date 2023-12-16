$(this).ready(function () {
    $(".product-item").click(function (e) {
        e.preventDefault();
        location.href = "/Product";
    });

    $(".seller-contact").click(function (e) {
        e.preventDefault();
        location.href = "/Chat";
    });
    //pagination function
    $(".pagination p:not(.arrow)").click(function () {
        $(".pagination > .active").toggleClass("active");
        $(this).toggleClass("active");

        $(".product > .active").toggleClass("active");
        var x = Number($(this).text()[1]);
        var y = ".product .page-" + x;
        $(y).toggleClass("active");
    });
    //pagination forward
    $(".pagination p.arrow.forward").click(function () {
        if ($(".pagination > .active").next()[0] !== $(this)[0]) {
            var x = $(".pagination > .active");
            $(".pagination > .active").next().toggleClass("active");
            x.toggleClass("active");

            var y = $(".product > .active");
            $(".product > .active").next().toggleClass("active");
            y.toggleClass("active");
        }
    });
    //pagination back
    $(".pagination p.arrow.back").click(function () {
        if ($(".pagination > .active").prev()[0] !== $(this)[0]) {
            var x = $(".pagination .active");
            $(".pagination .active").prev().toggleClass("active");
            x.toggleClass("active");

            var y = $(".product > .active");
            $(".product > .active").prev().toggleClass("active");
            y.toggleClass("active");
        }
    });

    $(".about img").click(function (e) {
        e.preventDefault();
        location.href = "/SellerInfoBuyer";
    });

    $.get({
        url: "/SellerInfoSeller/DisplayRating",
        dataType: "json",
        success: function (response) {
            //bar
            $(".bar_1").css('width', (response.sum ? response.star[0] / response.sum * 100 : 0) + "%");
            $(".bar_2").css('width', (response.sum ? response.star[1] / response.sum * 100 : 0) + "%");
            $(".bar_3").css('width', (response.sum ? response.star[2] / response.sum * 100 : 0) + "%");
            $(".bar_4").css('width', (response.sum ? response.star[3] / response.sum * 100 : 0) + "%");
            $(".bar_5").css('width', (response.sum ? response.star[4] / response.sum * 100 : 0) + "%");

            $(".bar_1 span").text((response.sum ? response.star[0] / response.sum * 100 : 0) + "%");
            $(".bar_2 span").text((response.sum ? response.star[1] / response.sum * 100 : 0) + "%");
            $(".bar_3 span").text((response.sum ? response.star[2] / response.sum * 100 : 0) + "%");
            $(".bar_4 span").text((response.sum ? response.star[3] / response.sum * 100 : 0) + "%");
            $(".bar_5 span").text((response.sum ? response.star[4] / response.sum * 100 : 0) + "%");
            //star

            $("input#star-" + Math.round(Number(response.avgRating))).prop("checked", true);

            $("#rating-avg").text("(" + response.avgRating + "/5)");
        }
    });
});
