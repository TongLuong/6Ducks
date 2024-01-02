$(this).ready(function () {
    var urlParams = new URLSearchParams(window.location.search);
    var product_id = urlParams.get('product');
    var seller_id;

    $(".list-image").css("height", $(".preview-image").height());

    $(".total-cost").text("0");
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'vnd',
    });
    $(".total-cost").on('change', function () {
        $(".total-cost").text(formatter.format($(".total-cost").text()));
    });

    $(".demo").click(function () {
        $(".preview-image").css(
            "background-image",
            $("." + this.classList[1]).css("background-image")
        );
    });

    $("#quantity").val("1");
    
    $("#quantity").on('change', function () {
        var currency = $("#price").text();
        var curr_price = Number(currency.replace(/[^0-9.-]+/g, ""));
        var quantity = Number($("#quantity").val());
        var shipping_price = Number($("#cost").val());

        $(".total-cost").val(curr_price * quantity + shipping_price);
    });

    $(".view-seller-page").click(function (e) {
        e.preventDefault();
        location.href = "UserInfo/SellerInfo" + "?seller=" + seller_id;
    });

    $(".show-fb").click(function (e) {
        e.preventDefault();
        $(".full-feedback").toggle();
    });

    $(".disabled > .wrapper").hide();

    var shippingPrice = {};
    $.get(
        "Product/LoadShippingMethods",
        {},
        function (response) {
            for (var i = 0; i < response.data.length; i++) {
                var temp = response.data[i].value;

                var op = `<option value="` + temp.smethodID + `">`
                    + temp.name + `</option>`;

                $("#method").append(op);
                shippingPrice[temp.smethodID] = temp.price;

                if (i == 0) {
                    $('#method option[value="'
                        + temp.smethodID + '"]').attr("selected", true);
                    $("#cost").val(temp.price);
                }
            }
        }
    );
    
    $.get(
        "Product/LoadPaymentMethods",
        {},
        function (response) {
            $("#cod-method").attr("id", response.data[0].value.pmethodID);
            $("#banking-method").attr("id", response.data[1].value.pmethodID);
        }
    );

    $("button.buy_product-button").click(function () {
        $(".buy-product .warning").css("display", "none");
        $(".disabled").css("display", "flex");
        $(".buy-product").show();
        $("body").css("overflow", "hidden");

        var currency = $("#price").text();
        var curr_price = Number(currency.replace(/[^0-9.-]+/g, ""));
        var quantity = Number($("#quantity").val());
        var shipping_price = Number($("#cost").val());
        $(".total-cost").val(curr_price * quantity + shipping_price);
    });
    $(".buy-product #buy-cancel").click(function () {
        $(".disabled > .wrapper").hide();
        $(".disabled").css("display", "none");
        $("body").css("overflow", "scroll");
    });
    $(".buy-product #buy-next").click(function () {
        var formEle = $(".buy-product .left .buyer-info input");
        var checkResult = true;
        formEle.each(function () {
            if ($(this).val() == "" || $(this).val() == null) {
                $(".buy-product .warning").not(".warning-voucher").css(
                    "display", "");
                checkResult = false;
                return false;
            }
        });

        if (!checkResult)
            return;

        $(".buy-product .warning").not(".warning-voucher").css("display", "none");

        $(".buy-product").hide();
        $(".cash").show();

        $('.cash .left input[name="cod-method"]').prop("checked", true);
        $(".cash .left form").css("display", "");
    });
    $(".cash #buy-cancel").click(function () {
        $(".disabled > .wrapper").hide();
        $(".disabled").css("display", "none");
        $("body").css("overflow", "scroll");

        $("#quantity").val("1");
    });

    $(".success #buy-done").click(function () {
        $(".disabled > .wrapper").hide();
        $(".disabled").css("display", "none");
        $("body").css("overflow", "scroll");
    });
    //$(".cash form").css("opacity", "0");
    let checkboxes = document.querySelectorAll('input[type="checkbox"]');
    $(".cash .right form input, " +
        ".cash .right form select").prop("disabled", true);
    $(".cash .left form input, " +
        ".cash .left form select").prop("disabled", true);
    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener("change", function () {
            checkboxes.forEach(function (c) {
                if (c !== checkbox) c.checked = false;
            });

            $(".cash .left input, .cash .right input").val("");

            if ($(".cash .left").has(this).length) {
                $(".cash .right form input, " +
                    ".cash .right form select").prop("disabled", true);
                $(".cash .left form input, " +
                    ".cash .left form select").prop("disabled", false);
            } else {
                $(".cash .right form input, " +
                    ".cash .right form select").prop("disabled", false);
                $(".cash .left form input, " +
                    ".cash .left form select").prop("disabled", true);
            }
        });
    });

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

    var currCategoryID;
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
                $(".buy-product .left img").attr("src", response.imgLink[0]);

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

                currCategoryID = response.categoryID;
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
                "sellerID": seller_id,
                "productID": product_id,
                "quantity": 1,
                "price": price
            },
            async: false,
            success: function () {
                alert("ĐÃ THÊM VÀO GIỎ HÀNG");
            }
        })
    });

    var totalDiscount = [1, 1];
    var maxDiscount = [0, 0];
    var minBill = [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER];
    var voucherChosenID = [null, null];
    var maxLoadDiscount = 1;
    var maxLoadShipping = 1;
    var maxLoadMainPageVouchers = 4;
    $.ajax({
        url: "Product/LoadVoucherInfo",
        data: {
            "categoryID": currCategoryID,
            "sellerID": seller_id,
            "maxLoad": -1 // get all
        },
        success: function (response) {
            for (var i = 0; i < response.data.length; i++) {
                var temp = response.data[i].value;

                var item = `<div class="voucher-item voucher-discount 
            voucher-item-` + temp.voucherID + `">
                <div class="voucher-image"></div>
                <div class="description">
                    <span class="des">
                        Voucher dùng cho danh mục Tiểu thuyết
                    </span>
                    <span class="condition text">
                        Đơn tối thiểu:
                        <span class="min-bill">10000</span>đ<br />
                        Giảm tối đa:
                        <span class="max-discount">100000</span>đ
                    </span>
                </div>
                <button class="voucher-using" type="button">Dùng</button>
              </div>`;

                var item2 = `<div class="voucher-item voucher-freeship 
            voucher-item-` + temp.voucherID + `">
                <div class="voucher-image"></div>
                <div class="description">
                    <span class="des">
                        Voucher dùng cho danh mục Tiểu thuyết
                    </span>
                    <span class="condition text">
                        Đơn tối thiểu:
                        <span class="min-bill">10000</span>đ<br />
                        Giảm tối đa:
                        <span class="max-discount">100000</span>đ
                    </span>
                </div>
                <button class="voucher-using" type="button">Dùng</button>
              </div>`;

                if (maxLoadMainPageVouchers > 0) {
                    $(".mainpage-productinfo .voucher .voucher-box").append(
                        item
                    );

                    $(".mainpage-productinfo .voucher .voucher-box .voucher-item-" +
                        temp.voucherID + " .des").html(temp.description +
                            '<span class="discount">(' +
                            (Number(temp.discountPercent) * 100) +
                            '%)</span>');
                    $(".mainpage-productinfo .voucher .voucher-box .voucher-item-" +
                        temp.voucherID + " .min-bill").text(temp.minBill);

                    var maxValue = temp.maxValue;
                    if (temp.maxValue == "")
                        maxValue = "∞";
                    $(".mainpage-productinfo .voucher .voucher-box .voucher-item-" +
                        temp.voucherID + " .max-discount").text(maxValue);

                    $(".mainpage-productinfo .voucher .voucher-box " +
                        ".voucher-item-" + temp.voucherID +
                        " .voucher-using").remove();

                    maxLoadMainPageVouchers--;
                }

                if (temp.voucherType == 0 && maxLoadDiscount > 0) {
                    $(".buy-product .right .wrapper").append(item);
                    
                    $(".buy-product .right .voucher-item-" +
                        temp.voucherID + " .des").html(temp.description +
                            '<span class="discount">(' +
                            (Number(temp.discountPercent) * 100) + 
                            '%)</span>');
                    $(".buy-product .right .voucher-item-" +
                        temp.voucherID + " .min-bill").text(temp.minBill);

                    var maxValue = temp.maxValue;
                    if (temp.maxValue == "")
                        maxValue = "∞";
                    $(".buy-product .right .voucher-item-" +
                        temp.voucherID + " .max-discount").text(maxValue);

                    addDiscount(temp.discountPercent, temp.voucherID);
                    maxDiscount[0] = $(".buy-product .right .voucher-item-" +
                        temp.voucherID + " .max-discount").text();
                    minBill[0] = $(".buy-product .right .voucher-item-" +
                        temp.voucherID + " .min-bill").text();
                    maxLoadDiscount--;
                }
                else if (temp.voucherType == 1 && maxLoadShipping > 0) {
                    $(".buy-product .right .wrapper").append(item2);
                    
                    $(".buy-product .right .voucher-item-" +
                        temp.voucherID + " .des").html(temp.description +
                            '<span class="discount">(' +
                            (Number(temp.discountPercent) * 100) +
                            '%)</span>');
                    $(".buy-product .right .voucher-item-" +
                        temp.voucherID + " .min-bill").text(temp.minBill);

                    var maxValue = temp.maxValue;
                    if (temp.maxValue == "")
                        maxValue = "∞";
                    $(".buy-product .right .voucher-item-" +
                        temp.voucherID + " .max-discount").text(maxValue);

                    addFreeShip(temp.discountPercent, temp.voucherID);
                    maxDiscount[1] = $(".buy-product .right .voucher-item-" +
                        temp.voucherID + " .max-discount").text();
                    minBill[1] = $(".buy-product .right .voucher-item-" +
                        temp.voucherID + " .min-bill").text();
                    maxLoadShipping--;
                }
            }
        }
    });
    
    function addDiscount(discountPercent, voucherID) {
        $(".buy-product .right .voucher-item-" + voucherID
            + " .voucher-using").click(function () {
                var quantity = $("#quantity").val();
                var price = $("#price").text();
                price = Math.round(Number(price.replace(/[^0-9.-]+/g, "")))
                    * quantity;

                var temp;
                if ($(this).text().trim() == "Dùng") {
                    if (Number(price) < minBill[0]) {
                        //alert("Giá trị đơn hàng không thỏa!");
                        $(".buy-product .content .right .warning").css(
                            "display", "");
                        return;
                    }

                    $(".buy-product .content .right .warning").css(
                        "display", "none");

                    $(this).text("Hủy");
                    
                    totalDiscount[0] *= (1 - discountPercent);
                    voucherChosenID[0] = voucherID;
                    temp = Number(price) * totalDiscount[0];
                    if (temp > maxDiscount[0])
                        temp = Number(price) - Number(maxDiscount[0]);
                }
                else if ($(this).text().trim() == "Hủy") {
                    $(this).text("Dùng");
                    
                    totalDiscount[0] /= (1 - discountPercent);
                    voucherChosenID[0] = null;
                    temp = Number(price) * totalDiscount[0];
                }

                var temp2 = Number($("#cost").val()) * totalDiscount[1];
                if (temp2 > maxDiscount[1] && totalDiscount[1] != 1)
                    temp2 = Number($("#cost").val()) - Number(maxDiscount[1]);

                $(".total-cost").val(
                    Math.round(temp + temp2)
                );
            });
    };

    function addFreeShip(discountPercent, voucherID) {
        $(".buy-product .right .voucher-item-" + voucherID
            + " .voucher-using").click(function () {
                var quantity = $("#quantity").val();
                var price = $("#price").text();
                price = Math.round(Number(price.replace(/[^0-9.-]+/g, "")))
                    * quantity;

                var temp;
                if ($(this).text().trim() == "Dùng") {
                    if (Number(price) < minBill[1]) {
                        //alert("Giá trị đơn hàng không thỏa!");
                        $(".buy-product .content .right .warning").css(
                            "display", "");
                        return;
                    }

                    $(".buy-product .content .right .warning").css(
                        "display", "none");

                    $(this).text("Hủy");

                    totalDiscount[1] *= (1 - discountPercent);
                    voucherChosenID[1] = voucherID;
                    temp = Number($("#cost").val()) * totalDiscount[1];
                    if (temp > maxDiscount[1])
                        temp = Number($("#cost").val()) - Number(maxDiscount[1]);
                }
                else if ($(this).text().trim() == "Hủy") {
                    $(this).text("Dùng");

                    totalDiscount[1] /= (1 - discountPercent);
                    voucherChosenID[1] = null;
                    temp = Number($("#cost").val()) * totalDiscount[1];
                }

                var temp2 = Number(price) * totalDiscount[0];
                if (temp2 > maxDiscount[0] && totalDiscount[0] != 1)
                    temp2 = Number(price) - Number(maxDiscount[0]);

                $(".total-cost").val(
                    Math.round(temp2 + temp)
                );
            });
    };

    $(".cash #buy-confirm").click(function () {
        //var currency = $(".total-cost").val();
        var payment = $('input[name="cod-method"], ' +
            'input[name="banking-method"] input:checked');

        //var totalPrice = Number(currency.replace(/[^0-9.-]+/g, ""));
        var address = $("#address").val();
        var pmethodID = payment.prop("id");
        var smethodID = $("#method").val();
        var billID;

        $.ajax({
            url: "Product/CreateBill",
            data: {
                "buyerID": "",
                "sellerID": seller_id,
                "billStatus": "",
                "totalPrice": 0, // ignore
                "address": address,
                "pmethodID": pmethodID,
                "smethodID": smethodID,
                "discountVoucher": voucherChosenID[0],
                "freeshipVoucher": voucherChosenID[1]
            },
            async: false,
            success: function (response) {
                billID = response.billID;
            }
        });
        
        var quantity = $("#quantity").val();
        var price = $("#price").text();
        price = Math.round(Number(price.replace(/[^0-9.-]+/g, "")));

        var currBillPrice;
        $.ajax({
            url: "Product/AddBillItems",
            data: {
                "billID": billID,
                "productID": product_id,
                "quantity": quantity,
                "price": price
            },
            async: false,
            success: function (response) {
                currBillPrice = response.currBillPrice;
            }
        });
        $(".total-cost").val(currBillPrice);

        for (var i = 0; i < voucherChosenID.length; i++) {
            if (voucherChosenID[i] != null) {
                $.ajax({
                    url: "Product/AddVoucherToBill",
                    data: {
                        "billID": billID,
                        "voucherID": voucherChosenID[i]
                    },
                    async: false
                });
            }
        }

        $(".disabled > .wrapper").hide();
        $(".success").show();
    });

    //quantity increase and reduce function
    $("#increase").click(function () {
        var allBtnVoucher = $(".buy-product .right .voucher-using");
        allBtnVoucher.each(function () {
            if ($(this).text().trim() == "Hủy")
                $(this).trigger('click');
        });

        $("#quantity").val(Number($("#quantity").val()) + 1);

        var quantity = $("#quantity").val();
        var price = $("#price").text();
        price = Math.round(Number(price.replace(/[^0-9.-]+/g, "")))
            * quantity;

        /*if ((Number(price) < minBill[0] && voucherChosenID[0] != null) ||
            (Number(price) < minBill[1] && voucherChosenID[1] != null)) {
            //alert("Giá trị đơn hàng không thỏa!");
            $(".buy-product .content .right .warning").css(
                "display", "");
            return;
        }*/

        $(".buy-product .content .right .warning").css(
            "display", "none");

        $(".total-cost").val(
            Math.round(Number(price) * totalDiscount[0])
            + Number($("#cost").val()) * totalDiscount[1]
        );
    });
    $("#reduce").click(function () {
        $("#quantity").val(function () {
            if (Number($("#quantity").val()) < 2)
                return 1;
            else {
                var allBtnVoucher = $(".buy-product .right .voucher-using");
                allBtnVoucher.each(function () {
                    if ($(this).text().trim() == "Hủy")
                        $(this).trigger('click');
                });

                var quantity = $("#quantity").val() - 1;
                var price = $("#price").text();
                price = Math.round(Number(price.replace(/[^0-9.-]+/g, "")))
                    * quantity;

                /*if ((Number(price) < minBill[0] && voucherChosenID[0] != null) ||
                    (Number(price) < minBill[1] && voucherChosenID[1] != null)) {
                    //alert("Giá trị đơn hàng không thỏa!");
                    $(".buy-product .content .right .warning").css(
                        "display", "");
                    return;
                }*/

                $(".buy-product .content .right .warning").css(
                    "display", "none");

                $(".total-cost").val(
                    Math.round(Number(price) * totalDiscount[0])
                    + Number($("#cost").val()) * totalDiscount[1]
                );

                return Number($("#quantity").val()) - 1;
            }
        });
    });

    $("#method").on('change', function (e) {
        $("#cost").val(shippingPrice[this.value]);

        var quantity = $("#quantity").val();
        var price = $("#price").text();
        price = Math.round(Number(price.replace(/[^0-9.-]+/g, "")))
            * quantity;

        if ((Number(price) < minBill[0] && voucherChosenID[0] != null) ||
            (Number(price) < minBill[1] && voucherChosenID[1] != null)) {
            //alert("Giá trị đơn hàng không thỏa!");
            $(".buy-product .content .right .warning").css("display", "");
            return;
        }

        $(".buy-product .content .right .warning").css("display", "none");

        $(".total-cost").val(
            Math.round(Number(price) * totalDiscount[0])
            + Number($("#cost").val()) * totalDiscount[1]
        );
    });
})