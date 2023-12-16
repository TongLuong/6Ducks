﻿$(this).ready(function () {
    var urlParams = new URLSearchParams(window.location.search);
    /*var userID = urlParams.get('user');
    var type = 0; // 0: buyer, 1: seller, (2: admin)
    if (userID == null) {
        userID = urlParams.get('seller'); // ideal condition
        type = 1;
    }*/
    
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

    $(".list-image").css("height", $(".preview-image").height());

    $(".demo").click(function () {
        $(".preview-image").css(
            "background-image",
            $("." + this.classList[1]).css("background-image")
        );
    });

    //demo image function
    /*$(".product-image").ready(function () {
        var n = $(".demo-image .demo").length;
        for (let i = 1; i <= n; i++) {
            var url = 'url("/assets/images/book-1-' + i + '.png")';
            var select = ".demo-image .demo-" + i;
            $(select).css("background-image", url);
        }
        $(".show-image").css(
            "background-image",
            $(".demo-image .demo-1").css("background-image")
        );
        $(".demo-image .demo").click(function () {
            $(".show-image").css("background-image", $(this).css("background-image"));
        });
    });*/
    //quantity increase and reduce function
    $("#increase").click(function () {
        $("#quantity").val(Number($("#quantity").val()) + 1);
    });
    $("#reduce").click(function () {
        $("#quantity").val(function () {
            if (Number($("#quantity").val()) < 2) return 1;
            else return Number($("#quantity").val()) - 1;
        });
    });

    $(".view-seller-page").click(function (e) {
        e.preventDefault();
        location.href = "UserInfo/SellerInfo";
    });

    $(".show-fb").click(function (e) {
        e.preventDefault();
        $(".full-feedback").toggle();
    });

    $(".disabled > .wrapper").hide();
    $("button.buy_product-button").click(function () {
        $(".disabled").css("display", "flex");
        $(".buy-product").show();
        $("body").css("overflow", "hidden");
    });
    $(".buy-product #buy-cancel").click(function () {
        $(".disabled > .wrapper").hide();
        $(".disabled").css("display", "none");
        $("body").css("overflow", "scroll");
    });
    $(".buy-product #buy-confirm").click(function () {
        $(".buy-product").hide();
        $(".cash").show();
    });
    $(".cash #buy-cancel").click(function () {
        $(".disabled > .wrapper").hide();
        $(".disabled").css("display", "none");
        $("body").css("overflow", "scroll");
    });
    $(".cash #buy-confirm").click(function () {
        $(".disabled > .wrapper").hide();
        $(".success").show();
    });
    $(".success #buy-done").click(function () {
        $(".disabled > .wrapper").hide();
        $(".disabled").css("display", "none");
        $("body").css("overflow", "scroll");
    });
    $(".cash form").css("opacity", "0");
    let checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener("change", function () {
            checkboxes.forEach(function (c) {
                if (c !== checkbox) c.checked = false;
            });
            if ($(".cash .left").has(this).length) {
                $(".cash .left form").css("opacity", "1");
                $(".cash .right form").css("opacity", "0");
            } else {
                $(".cash .left form").css("opacity", "0");
                $(".cash .right form").css("opacity", "1");
            }
        });
    });
    
    var product_id = urlParams.get('product');
    var seller_id;

    function displayStar(productID) {
        const starInputs = document.querySelectorAll('i[name="starprod"]');
        const starInputsFb = document.querySelectorAll('i[name="star-fb-avg"]');
        $.get(
            "Product/DisplayRating", { "productID": productID },
            function (response) {
                for (let i = 0; i < starInputs.length; i++) {
                    starInputs[i].className = "fa fa-star-o";
                    starInputsFb[i].className = "fa fa-star-o";
                }

                for (let i = response.numberOfStars - 1;
                    i >= 0; i--) {
                    starInputs[i].className = "fa fa-star";
                    starInputsFb[i].className = "fa fa-star";
                }

                $("#ratingAvg").text("(" + response.avgRating + ")");
                $("#rating-fb-avg").text("(" + response.avgRating + ")");
            }
        )

        $.get(
            "Product/ShowRatingTable", { "productID": productID },
            function (response) {
                $("._1star").css('width', response.star[0] / response.sum * 100 + '%');
                $("._2star").css('width', response.star[1] / response.sum * 100 + '%');
                $("._3star").css('width', response.star[2] / response.sum * 100 + '%');
                $("._4star").css('width', response.star[3] / response.sum * 100 + '%');
                $("._5star").css('width', response.star[4] / response.sum * 100 + '%');
            }
        )
    }
    
    displayStar(product_id);
    
    function displayProdInfo(productID) {
        $.ajax({
            url: "Product/LoadProductInfo",
            data: { "productID": productID },
            async: false,
            success: function (response) {
                $(".header-info").attr("id", response.sellerID);
                
                /*var fs = require('fs');
                var file = fs.readdirSync(response.imgLink);*/
                
                $(".show-image").css("background-image", "url(" +
                    response.imgLink[0] + ")");

                var sideImgs = $(".demo");
                sideImgs.each(function (i) {
                    $(this).css("background-image", "url(" +
                        response.imgLink[i] + ")");
                });

                $("#prodName").text(response.name);
                //$("#ratingAvg").text(response.avgStar);
                $("#author").text(response.author);
                $("#publisher").text(response.publisher);
                $("#genreID").text(response.genreName);
                $("#categoryID").text(response.catName);

                const formatter = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'vnd',
                });
                $("#price").text(formatter.format(response.price));
            }
        });
    }

    displayProdInfo(product_id);
    
    function displaySellerInfo(sellerID) {
        $.ajax({
            url: "Product/LoadSellerInfo",
            data: { "sellerID": sellerID },
            async: false,
            success: function (response) {
                $("#shop-name").text(response.displayName);
                $("#starting-time").text(response.startingTime);
                $("#product-sole").text(response.productSale);

                seller_id = sellerID;
            }
        });
    }
    displaySellerInfo($(".header-info").attr("id"));

    $(".contact-seller").click(function () {
        location.href = "Chat" + "?receiver=" + seller_id;
    });

    function showFeedback(username, star, detail) {
        $.get("components/feedbackTemplate.html", function (data) {

            $(".full-feedback").append(data);
            var item = $(".full-feedback .feedback-item:last-child()");

            const starInputs = item.find('i[name="star-fb"]');
            //alert(Object.keys(starInputs).length);

            item.find(".username").text(username);
            item.find(".cmt-side p").text(detail);

            for (let i = 0; i < starInputs.length; i++) {
                starInputs[i].className = "fa fa-star-o";
            }
            for (let i = star - 1;
                i >= 0; i--) {
                starInputs[i].className = "fa fa-star";
            }
        }
        );
    }

    function displayFeedback(productID) {
        $.get("Product/LoadFeedback", { "productID": productID },
            function (response) {
                for (let i = 0; i < response.number; i++) {
                    showFeedback(response.username[i], response.star[i], response.detail[i]);
                }
            }
        )
    }

    displayFeedback(product_id);

    $(".add_product-button").click(function () {
        var currency = $("#price").text();
        var price = Number(currency.replace(/[^0-9.-]+/g, ""));

        $.ajax({
            url: "Cart/AddCartItems",
            data: {
                "buyerID": "",
                "productID": product_id,
                "quantity": 1,
                "price": price
            },
            async: false
        })
    });
});
