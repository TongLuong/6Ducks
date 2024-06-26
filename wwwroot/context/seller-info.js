﻿$(this).ready(function () {
    var urlParams = new URLSearchParams(window.location.search);
    var sellerID = urlParams.get("seller");
    let ignoreClickProduct = false;
    
    $(".change-info-side .success").css("display", "none");

    $(".product-item").click(function (e) {
        e.preventDefault();
        location.href = "/Product";
    });

    $(".seller-contact").click(function (e) {
        e.preventDefault();
        location.href = "/Chat" + "?receiver=" + sellerID;
    });
    //pagination function
    $(".pagination p.arrow.forward").click(function () {
        var maxPage = $(".product-list").length;
        var currPageNo = $(".product-list.active")
            .prop("class")
            .split(" ")[1]
            .split("-")[1];

        if (currPageNo != maxPage) {
            $(".pagination .current-page span:first-child()").text(Number($(".pagination .current-page span:first-child()").text()) + 1);
            $(".product-list.active").toggleClass("active");
            $(".product-list.page-" + ++currPageNo).addClass("active");
        }
    });
    //pagination back
    $(".pagination p.arrow.back").click(function () {
        var maxPage = $(".product-list").length;
        var currPageNo = $(".product-list.active")
            .prop("class")
            .split(" ")[1]
            .split("-")[1];

        if (currPageNo != 1) {
            $(".pagination .current-page span:first-child()").text(Number($(".pagination .current-page span:first-child()").text()) - 1);
            $(".product-list.active").toggleClass("active");
            $(".product-list.page-" + --currPageNo).addClass("active");
        }
    });
    
    $.get({
        url: "/SellerInfoSeller/DisplayRating",
        data: { seller: sellerID },
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

    function display_product(
        stt,
        productID,
        name,
        price,
        ratingCount,
        numberLeft,
        imgLink
    ) {
        var html =
            '<div class="product-item" id="' +
            productID +
            '">' +
            '<img src="' +
            imgLink +
            '" alt="" class="imgtag" id="imgtag" />' +
            '<div class="container">' +
            '<header class="product-name" id="">' +
            name +
            "</header>" +
            '<div class="price" id="price">' +
            price +
            "đ</div>" +
            '<div class="rate" id="rate">' +
            '<i class="fa fa-star" aria-hidden="true" name="star"></i>' +
            '<i class="fa fa-star" aria-hidden="true" name="star"></i>' +
            '<i class="fa fa-star" aria-hidden="true" name="star"></i>' +
            '<i class="fa fa-star" aria-hidden="true" name="star"></i>' +
            '<i class="fa fa-star" aria-hidden="true" name="star"></i>' +
            "<span>(" +
            numberLeft +
            ")</span>" +
            "</div>" +
            "</div>" +
            '<span class="delete-icon"><i class="fa fa-minus" aria-hidden="true"></i></span>' +
            "</div>";
        $(".product-list.page-" + stt).append(html);
        $(".product-item").find(".delete-icon").hide();
        var item = $(".product-list.page-" + stt + " .product-item:last-child()");
        const starInputs = item.find('i[name="star"]');
        for (let i = 0; i < starInputs.length; i++) {
            starInputs[i].className = "fa fa-star-o";
        }
        for (let i = ratingCount - 1; i >= 0; i--) {
            starInputs[i].className = "fa fa-star";
        }
        item
            .find("*")
            .not(".delete-icon")
            .click(function () {
                if (ignoreClickProduct) {
                    return;
                }

                location.href = "/Product" + "?product=" + productID;
            });
        item
            .find("header")
            .on("mouseenter", function () {
                $(this).animate(
                    {
                        scrollLeft: $(this).width(),
                    },
                    1000
                );
            })
            .on("mouseleave", function () {
                $(this).animate(
                    {
                        scrollLeft: -$(this).width(),
                    },
                    1000
                );
            });
    }

    function display_all_product(sellerID) {
        $.ajax({
            url: "/SellerInfoSeller/DisplayProduct",
            data: { seller: sellerID },
            type: "json",
            success: function (response) {
                $(".pagination .current-page span:nth-child(2)").text(response.page[response.len - 1]);
                for (let j = 2; j <= response.page[response.len - 1]; j++) {
                    $(".layout.product").prepend(
                        '<div class="product-list page-' + j +'"></div>'
                    );
                }
                for (let i = 0; i < response.len; i++) {
                    display_product(
                        response.page[i],
                        response.productID[i],
                        response.name[i],
                        response.price[i],
                        response.rate[i],
                        response.numbersLeft[i],
                        response.imgLink[i]
                    );
                }
            }
        });
    }

    display_all_product(sellerID);

    function delete_product(productID) {
        $.ajax({
            url: "SellerInfoSeller/DeleteProduct",
            data: { productID: productID },
            async: false,
            type: "post"
        });
    }

    //delete click function
    $("#delete-product").click(function () {
        $("html, body").animate({ scrollTop: 0 }, "300");
        $("#cancel-delete-product").show();
        $(".product-item").find(".delete-icon").show();
        ignoreClickProduct = true;

        $(".delete-icon").each(function () {
            $(this).click(function () {
                $(".delete-side").css("display", "flex");

                var item = $(this).closest(".product-item");

                $(".delete-popup button").click(function (e) {
                    if (e.target === $("#confirm-delete")[0]) {
                        /*$(".product-list").replaceWith("");
                        $(".layout.product").prepend(
                            '<div class="product-list page-1 active"></div>'
                        );*/
                        item.replaceWith("");
                        $(".delete-side").hide();
                        ignoreClickProduct = true;
                        delete_product(item.prop("id"));

                        //location.reload(true);
                    } else if (e.target === $("#cancel-delete")[0]) {
                        $(".delete-side").hide();
                        ignoreClickProduct = true;
                    }
                });
            });
        });
    });

    $("#cancel-delete-product").click(function () {
        ignoreClickProduct = false;
        $(".product-item").find(".delete-icon").hide();
        $("#cancel-delete-product").hide();
    });

    $("#change-btn").click(function () {
        $(".change-info-side").css("display", "flex");
    });

    $("#cancel-change").click(function () {
        $(".change-info-side .success").css("display", "none");
        $(".change-info-side .change-info-popup").css("display", "");

        $(".change-info-side input").val("");
        $(".change-info-side").css("display", "none");
    });
    
    $("#statistic-seller").click(function () {
        location.href = "/Statistic";
    });

    $("#change-btn").click(function () {
        $.ajax({
            url: "/UserInfo/DisplayUserInfo",
            success: function (response) {
                $("#change-pwd").val(response.pass);
                $("#change-email").val(response.email);
                $("#change-dob").val(response.dob);
                $("#change-add").val(response.address);
                $("#change-phone").val(response.phoneNumber);
            }
        });
    });

    $(".change-info-side .success #change-info-done").click(function () {
        $("#cancel-change").click();
    });

    $("#confirm-change").click(function () {
        var pass = $("#change-pwd").val();
        var email = $("#change-email").val();
        var dob = $("#change-dob").val();
        var address = $("#change-add").val();
        var phoneNumber = $("#change-phone").val();

        $.ajax({
            url: "/UserInfo/UpdateUserInfo",
            type: "post",
            data: {
                pass: pass,
                email: email,
                dob: dob,
                address: address,
                phoneNumber: phoneNumber,
            }
        });

        display_profile();

        $(".change-info-side .success").css("display", "");
        $(".change-info-side .change-info-popup").css("display", "none");
    });
    
    function display_profile() {
        $.ajax({
            url: "/SellerInfoSeller/ProfileInfo",
            success: function (response) {
                
                $('.seller_name').text(response.name);
                $('span.join-time span').text(response.time);
                $('span.product-number span').text(response.product);
            },
            error: function (e) {
                alert("error" + e);
            }
        });
    }

    display_profile();
});
