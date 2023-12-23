$(document).ready(function () {
    var urlParams = new URLSearchParams(window.location.search);
    /*var userID = urlParams.get('user');
      var type = 0; // 0: buyer, 1: seller, (2: admin)
      if (userID == null) {
          userID = urlParams.get('seller'); // ideal condition
          type = 1;
      }*/
    $(".delete-side").hide();
    $(".overlay-cart .success").css("display", "none");

    $(".overlay-cart .cash").css("display", "none");
    $(".overlay-cart .voucher").css("display", "none");
    $(".overlay-cart #confirm-buy").css("display", "none");
    $(".overlay-cart #next-2").css("display", "none");
    $(".overlay-cart #cancel-2").css("display", "none");
    $(".overlay-cart #cancel-3").css("display", "none");
    $(".cash .left #cod-method").attr("checked", true);
    $(".cash .left form").css("display", "");
    $(".cash .voucher form").css("display", "none");

    $("#next-1").click(function () {
        $(".overlay-cart .buy").css("display", "none");
        $(".overlay-cart .voucher").css("display", "block");
        $(".overlay-cart #next-1").css("display", "none");
        $(".overlay-cart #cancel-1").css("display", "none");
        $(".overlay-cart #next-2").css("display", "");
        $(".overlay-cart #cancel-2").css("display", "");
    });

    $("#next-2").click(function () {
        $(".overlay-cart .voucher").css("display", "none");
        $(".overlay-cart .cash").css("display", "");

        $(".overlay-cart #confirm-buy").css("display", "");
        $(".overlay-cart #next-2").css("display", "none");
        $(".overlay-cart #cancel-2").css("display", "none");
        $(".overlay-cart #cancel-3").css("display", "");

        let checkboxes = document.querySelectorAll(
            '.overlay-cart input[type="checkbox"]'
        );
        checkboxes.forEach(function (checkbox) {
            checkbox.addEventListener("change", function () {
                if (!checkbox.checked) {
                    checkbox.checked = true;
                    return;
                }

                checkboxes.forEach(function (c) {
                    if (c !== checkbox) c.checked = false;
                });
                if ($(".cash .left").has(this).length) {
                    if (this.checked) $(".cash .left form").css("display", "");
                    else $(".cash .left form").css("display", "none");
                    $(".cash .voucher form").css("display", "none");
                } else {
                    $(".cash .left form").css("display", "none");
                    if (this.checked) $(".cash .voucher form").css("display", "");
                    else $(".cash .voucher form").css("display", "none");
                }
            });
        });
    });

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
    $(".overlay-cart").hide();

    $.ajax({
        url: "Cart/LoadCartItems",
        data: {},
        async: false,
        success: function (response) {
            for (var i = 0; i < response.data.length; i++) {
                var temp = response.data[i].value;

                var cartItem =
                    '<div class="cart-item cart-item-' +
                    i +
                    '">' +
                    '<img src = "" alt = ""/>' +
                    '<div class="detail">' +
                    '<span class="book-name">Điều kì diệu của tiệm tạp hóa Namiya</span>' +
                    '<span class="quantity">Số lượng: <span>1</span></span>' +
                    '<span class="item-price">Đơn giá: <span>86000</span>đ</span>' +
                    "</div>" +
                    '<span class="item-total-price">Tổng: <span>86000</span>đ</span>' +
                    '<input type = "checkbox" name = "item-choose"/>' +
                    '<div class="delete-cart-item"><i class="fa fa-times" aria-hidden="true"></i></div>' +
                    "</div>";

                $(".waiting-cart-list").append(cartItem);

                $(".cart-item-" + i + " .book-name").text(temp.name);
                $(".cart-item-" + i + " .quantity span").text(temp.quantity);
                $(".cart-item-" + i + " img").attr("src", temp.imgLink[0]);
                $(".cart-item-" + i + ' input[type="checkbox"]').attr(
                    "id",
                    temp.productID + "-" + temp.sellerID + "-"
                    + temp.categoryID
                );
                $(".cart-item-" + i + " .item-price span").text(temp.price);

                var totalPrice = Number(temp.quantity) * Number(temp.price);
                $(".cart-item-" + i + " .item-total-price span").text(
                    totalPrice);

                //Delete cart-item
                deleteCartItems(i, temp.productID);
            }
        },
    });

    function deleteCartItems(index, productID) {
        $(".cart-item-" + index + " .delete-cart-item").click(function () {
            $(".delete-side").show();

            var item = $(this);

            $(".delete-popup button").click(function (e) {
                if (e.target === $("#confirm-delete")[0]) {
                    item.closest(".cart-item").replaceWith("");
                    $(".delete-side").hide();

                    $.ajax({
                        url: "Cart/DeleteCartItems",
                        data: {
                            buyerID: "",
                            productID: productID,
                        },
                    });
                } else if (e.target === $("#cancel-delete")[0]) {
                    $(".delete-side").hide();
                }
            });
        });
    }

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
            }
            else {
                $(".cash .right form input, " +
                    ".cash .right form select").prop("disabled", false);
                $(".cash .left form input, " +
                    ".cash .left form select").prop("disabled", true);
            }

            var totalPrice = 0;
            var itemList = $(".cart-item");
            itemList.each(function () {
                if ($(this).find('input[type="checkbox"]').prop("checked")) {
                    var priceText = $(this).find(".item-total-price span").text();
                    totalPrice += Number(priceText);
                }
            });
            var shipping_price = Number($("#cost").val());
            $(".total-price span").text(totalPrice + shipping_price);
        });
    });

    $("#mark-all").click(function () {
        if (
            $('.cart-list input[type="checkbox"]').prop("checked") &&
            $(this).text() == "Hủy chọn tất cả"
        ) {
            $(this).text("Chọn tất cả");
            $('.cart-list input[type="checkbox"]').prop("checked", false);
            $(".total-price span").text("0");
        } else {
            $(this).text("Hủy chọn tất cả");
            $('.cart-list input[type="checkbox"]').prop("checked", true);

            var totalPrice = 0;
            var itemList = $(".cart-item");
            itemList.each(function () {
                if ($(this).find('input[type="checkbox"]').prop("checked")) {
                    var priceText = $(this).find(".item-total-price span").text();
                    totalPrice += Number(priceText);
                }
            });
            //var shipping_price = Number($("#cost").val());
            $(".total-price span").text(totalPrice);
        }
    });

    var shippingPrice = {};
    $.ajax({
        url: "Product/LoadShippingMethods",
        async: false,
        success: function (response) {
            for (var i = 0; i < response.data.length; i++) {
                var temp = response.data[i].value;

                var op =
                    `<option value="` + temp.smethodID + `">` + temp.name + `</option>`;

                $("#method").append(op);
                shippingPrice[temp.smethodID] = temp.price;

                if (i == 0) {
                    $('#method option[value="' + temp.smethodID + '"]').attr(
                        "selected",
                        true
                    );
                    $("#cost").val(temp.price);
                }
            }
        }
    });
    
    $.get("Product/LoadPaymentMethods", {}, function (response) {
        $("#cod-method").attr("id", response.data[0].value.pmethodID);
        $("#banking-method").attr("id", response.data[1].value.pmethodID);
    });

    var totalDiscount = [1, 1];
    var maxDiscount = [0, 0];
    var minBill = [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER];
    var voucherChosenID = [null, null];
    var maxLoadDiscount = 1;
    var maxLoadShipping = 1;
    $("#make-buy").click(function () {
        var shipping_price = Number($("#cost").val());
        var totalPrice = $(".total-price span").text();
        totalPrice = Math.round(Number(totalPrice.replace(/[^0-9.-]+/g, "")));
        $(".total").val(totalPrice + shipping_price);

        var itemsChosen = [];
        var itemsChosenID = [];
        var itemsChosenSellerID = [];
        var itemsChosenCatID = [];
        var itemsChosenQuant = [];
        var itemsChosenTotalPrice = [];
        var sellerTotalPrice = {};
        var allCheckbox = $('.cart-item input[type="checkbox"');

        allCheckbox.each(function (i) {
            if (this.checked) {
                itemsChosen.push(i);

                var id = $(this).attr("id").split("-");
                itemsChosenID.push(id[0]);
                itemsChosenSellerID.push(id[1]);
                itemsChosenCatID.push(id[2]);
            }
        });
        $(".buy-cart-list .cart-item").remove();

        // load vouchers
        var loadedVouchers = [];
        for (var i = 0; i < itemsChosen.length; i++) {
            $.ajax({
                url: "Product/LoadVoucherInfo",
                data: {
                    "categoryID": itemsChosenCatID[i],
                    "sellerID": itemsChosenSellerID[i],
                    "maxLoad": -1
                },
                success: function (response) {
                    for (var i = 0; i < response.data.length; i++) {
                        var temp = response.data[i].value;

                        if (loadedVouchers.includes(temp.voucherID))
                            continue;
                        loadedVouchers.push(temp.voucherID);

                        var item = `<div class="voucher-item voucher-discount 
                        voucher-item-` + temp.voucherID + `">
                            <div class="voucher-image"></div>
                            <div class="description">
                                <span class="des">
                                    Voucher dùng cho danh mục Tiểu thuyết<br />
                                    <span class="discount">30%</span>
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
                                    Voucher dùng cho danh mục Tiểu thuyết<br />
                                    <span class="discount">30%</span>
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

                        if (temp.voucherType == 0 && maxLoadDiscount > 0) {
                            $(".overlay-cart .voucher .wrapper").append(item);

                            $(".overlay-cart .voucher .wrapper .voucher-item-" +
                                temp.voucherID + " .discount").text(
                                    Number(temp.discountPercent) * 100 + "%");
                            $(".overlay-cart .voucher .wrapper .voucher-item-" +
                                temp.voucherID + " .des").text(temp.description);
                            $(".overlay-cart .voucher .wrapper .voucher-item-" +
                                temp.voucherID + " .min-bill").text(temp.minBill);

                            var maxValue = temp.maxValue;
                            if (temp.maxValue == "")
                                maxValue = "∞";
                            $(".overlay-cart .voucher .wrapper .voucher-item-" +
                                temp.voucherID + " .max-discount").text(maxValue);

                            addDiscount(temp.discountPercent, temp.voucherID);
                            maxDiscount[0] = $(".overlay-cart .voucher .wrapper .voucher-item-" +
                                temp.voucherID + " .max-discount").text();
                            minBill[0] = $(".overlay-cart .voucher .wrapper .voucher-item-" +
                                temp.voucherID + " .min-bill").text();
                            maxLoadDiscount--;
                        }
                        else if (temp.voucherType == 1 && maxLoadShipping > 0) {
                            $(".overlay-cart .voucher .wrapper").append(item2);

                            $(".overlay-cart .voucher .wrapper .voucher-item-" +
                                temp.voucherID + " .discount").text(
                                    Number(temp.discountPercent) * 100 + "%");
                            $(".overlay-cart .voucher .wrapper .voucher-item-" +
                                temp.voucherID + " .des").text(temp.description);
                            $(".overlay-cart .voucher .wrapper .voucher-item-" +
                                temp.voucherID + " .min-bill").text(temp.minBill);

                            var maxValue = temp.maxValue;
                            if (temp.maxValue == "")
                                maxValue = "∞";
                            $(".overlay-cart .voucher .wrapper .voucher-item-" +
                                temp.voucherID + " .max-discount").text(maxValue);

                            addFreeShip(temp.discountPercent, temp.voucherID);
                            maxDiscount[1] = $(".overlay-cart .voucher .wrapper .voucher-item-" +
                                temp.voucherID + " .max-discount").text();
                            minBill[1] = $(".overlay-cart .voucher .wrapper .voucher-item-" +
                                temp.voucherID + " .min-bill").text();
                            maxLoadShipping--;
                        }
                    }
                }
            });
        }

        // load cart items
        for (var i = 0; i < itemsChosen.length; i++) {
            var buyItem =
                `<div class="cart-item buy-cart-item-` +
                itemsChosen[i] +
                `">
                    <img src="/assets/images/DieuKyDieuCuaTiemTapHoaNamiya/book-1-1.png" alt="" />
                    <span class="detail">Điều kì diệu ở tiệm tạp hóa Namiya</span>
                    <span class="item-total-price"><span>86.000</span>đ</span>
                </div>`;
            $(".buy-cart-list").append(buyItem);

            var itemChosen = $(".cart-item-" + itemsChosen[i]);
            $(".buy-cart-item-" + itemsChosen[i] + " img").attr(
                "src",
                itemChosen.find("img").attr("src")
            );
            $(".buy-cart-item-" + itemsChosen[i] + " .detail").text(
                itemChosen.find(".book-name").text()
            );
            $(".buy-cart-item-" + itemsChosen[i] + " .item-total-price span").text(
                itemChosen.find(".item-total-price span").text()
            );

            itemsChosenQuant.push(itemChosen.find(".quantity span").text());
            itemsChosenTotalPrice.push(
                itemChosen.find(".item-total-price span").text()
            );

            if (!(itemsChosenSellerID[i] in sellerTotalPrice)) {
                sellerTotalPrice[itemsChosenSellerID[i]] = 0;
            }
            sellerTotalPrice[itemsChosenSellerID[i]] += Number(
                itemsChosenTotalPrice[i]);
        }

        var totalNoShipping = Number($(".total-price span").text());
        /*Object.values(sellerTotalPrice).reduce((a, b) => a + b, 0);*/
        var sellerTotalPriceRatio = {};
        for (var i = 0; i < itemsChosen.length; i++) {
            sellerTotalPriceRatio[itemsChosenSellerID[i]] =
                sellerTotalPrice[itemsChosenSellerID[i]] / totalNoShipping;
        }

        //$(".total").val($(".total-price span").text());

        // handling buy
        $("#confirm-buy").click(function () {
            var payment = $(
                'input[name="cod-method"], ' +
                'input[name="banking-method"] input:checked'
            );

            //var totalPrice = $(".total").val();
            var address = $("#address").val();
            var pmethodID = payment.prop("id");
            var smethodID = $("#method").val();

            var sellerBillPair = {}; // sellerID: billID

            for (var i = 0; i < itemsChosen.length; i++) {
                if (!(itemsChosenSellerID[i] in sellerBillPair)) {
                    $.ajax({
                        url: "Product/CreateBill",
                        data: {
                            buyerID: "", // ignore
                            sellerID: itemsChosenSellerID[i],
                            billStatus: "", // ignore
                            totalPrice: 0, // ignore?
                            address: address,
                            pmethodID: pmethodID,
                            smethodID: smethodID,
                            discountVoucher: voucherChosenID[0],
                            freeshipVoucher: voucherChosenID[1]
                        },
                        async: false,
                        success: function (response) {
                            sellerBillPair[itemsChosenSellerID[i]] = response.billID;
                        },
                    });
                }

                $.ajax({
                    url: "Product/AddBillItems",
                    data: {
                        billID: sellerBillPair[itemsChosenSellerID[i]],
                        sellerID: itemsChosenSellerID[i],
                        productID: itemsChosenID[i],
                        quantity: itemsChosenQuant[i],
                        price: itemsChosenTotalPrice[i] / itemsChosenQuant[i],
                    },
                    async: false,
                });

                for (var j = 0; j < voucherChosenID.length; j++) {
                    if (voucherChosenID[i] != null) {
                        $.ajax({
                            url: "Product/AddVoucherToBill",
                            data: {
                                "billID": sellerBillPair[itemsChosenSellerID[i]],
                                "voucherID": voucherChosenID[j]
                            },
                            async: false
                        });
                    }
                }
            }

            var keysSellerID = Object.keys(sellerTotalPrice);
            var currTotalPrice = $(".total").val();
            for (var i = 0; i < keysSellerID.length; i++) {
                $.ajax({
                    url: "Product/UpdateTotalPriceOnBill",
                    data: {
                        "billID": sellerBillPair[keysSellerID[i]],
                        "newTotalPrice": Math.round(currTotalPrice *
                            sellerTotalPriceRatio[keysSellerID[i]])
                    }
                });
            }

            for (var i = 0; i < itemsChosen.length; i++) {
                $(".cart-item-" + itemsChosen[i]).replaceWith("");

                $.ajax({
                    url: "Cart/DeleteCartItems",
                    data: {
                        buyerID: "",
                        productID: itemsChosenID[i],
                    },
                    async: false,
                });
            }

            $(".overlay-cart .wrapper").css("display", "none");
            $(".overlay-cart .success").css("display", "");
            $(".overlay-cart #next-1").css("display", "");
        });

        // handling UI
        $(".overlay-cart").show();
        $("#cancel-1").click(function () {
            $(".overlay-cart").hide();
            $(".overlay-cart input").not("#cost").val("");

            $(".overlay-cart .buy").css("display", "");
        });

        $("#cancel-2").click(function () {
            $(".overlay-cart .voucher input").not("#cost").val("");

            $(".overlay-cart .buy").css("display", "");
            $(".overlay-cart .voucher").css("display", "none");

            $(".overlay-cart #cancel-1").css("display", "");
            $(".overlay-cart #cancel-2").css("display", "none");

            $(".overlay-cart #next-1").css("display", "");
            $(".overlay-cart #next-2").css("display", "none");
        });

        $("#cancel-3").click(function () {
            $(".overlay-cart .cash input").not("#cost").val("");

            $(".overlay-cart .voucher").css("display", "");
            $(".overlay-cart .cash").css("display", "none");


            $(".overlay-cart #cancel-2").css("display", "");
            $(".overlay-cart #cancel-3").css("display", "none");

            $(".overlay-cart #next-2").css("display", "");
            $(".overlay-cart #confirm-buy").css("display", "none");
        });
    });

    function addDiscount(discountPercent, voucherID) {
        $(".overlay-cart .voucher .wrapper .voucher-item-" + voucherID
            + " .voucher-using").click(function () {
                var price = $(".total-price span").text();
                price = Math.round(Number(price.replace(/[^0-9.-]+/g, "")));

                if (Number(price) < minBill[0]) {
                    alert("Giá trị đơn hàng không thỏa!");
                    return;
                }

                var temp;
                if ($(this).text().trim() == "Dùng") {
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

                $(".total").val(
                    Math.round(temp + temp2)
                );
            });
    };

    function addFreeShip(discountPercent, voucherID) {
        $(".overlay-cart .voucher .wrapper .voucher-item-" + voucherID
            + " .voucher-using").click(function () {
                var price = $(".total-price span").text();
                price = Math.round(Number(price.replace(/[^0-9.-]+/g, "")));

                if (Number(price) < minBill[1]) {
                    alert("Giá trị đơn hàng không thỏa!");
                    return;
                }

                var temp;
                if ($(this).text().trim() == "Dùng") {
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

                $(".total").val(
                    Math.round(temp2 + temp)
                );
            });
    };

    $("#method").on("change", function (e) {
        $("#cost").val(shippingPrice[this.value]);

        var price = $(".total-price span").text();
        price = Math.round(Number(price.replace(/[^0-9.-]+/g, "")));

        /*if (Number(price) < minBill[0] ||
            Number(price) < minBill[1]) {
            alert("Giá trị đơn hàng không thỏa!");
            return;
        }*/

        $(".total").val(
            Math.round(Number(price) * totalDiscount[0])
            + Number($("#cost").val()) * totalDiscount[1]
        );
    });

    $("#buy-done").click(function () {
        $(".overlay-cart .success").css("display", "none");
        location.reload(true);
    });
});
