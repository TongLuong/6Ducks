function discountPrice() {
    $(".discount .price").each(function () {
        var price = parseFloat($(this).text().replace(/[.]/g, ""));
        var badge =
            parseFloat(
                $(".discount .product-item").has($(this)).find(".badge").text()
            ) / 100;
        var discount = ((1 + badge) * price).toLocaleString() + "đ";
        $(this).html($("<span>").text($(this).text()));
        $(this).append($("<span>").text(discount));
    });
    $(".price span:nth-child(2)").css({
        "text-decoration": "none",
        "margin-left": "10px",
    });
    $(".price span:first-child").css("text-decoration", "line-through");
}

$(this).ready(function () {
    var urlParams = new URLSearchParams(window.location.search);
    var sellerID = urlParams.get("seller");
    var search = urlParams.get("search");
    const imgCount = 0;

    function removeVietnameseTones(str) {
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str = str.replace(/Đ/g, "D");
        // Some system encode vietnamese combining accent as individual utf-8 characters
        // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
        str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
        // Remove extra spaces
        // Bỏ các khoảng trắng liền nhau
        str = str.replace(/ + /g, " ");
        str = str.trim();
        // Remove punctuations
        // Bỏ dấu câu, kí tự đặc biệt
        str = str.replace(
            /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
            " "
        );
        return str;
    }

    function filterItem(searchStr) {
        var searchInput = removeVietnameseTones(searchStr.toUpperCase());

        var records = $(".best-seller .product-list .product-item");
        records.each(function () {
            var name = $(this).find(".product-name").text();

            if (
                searchInput == "" ||
                removeVietnameseTones(name.toUpperCase()).indexOf(searchInput) > -1
            ) {
                $(this).css("display", ""); // use default display value
            } else {
                $(this).css("display", "none");
            }
        });
    }
    
    $.ajax({
        url: "/components/header.html",
        async: false,
        success: function(data) {
            $("body").prepend(data);
        }
    });

    $.ajax({
        url: "/components/footer.html",
        async: false,
        success: function(data) {
            $("body").append(data);
        }
    });

    var numDisplayCatFooter = 6;
    var numDisplayGenFooter = 6;
    $.ajax({
        url: "/SellerMainPage/DisplayCatAndGen",
        type: "get",
        async: false,
        success: function (response) {
            $(".footer .category ul li").remove();
            $(".footer .type ul li").remove();

            for (var i = 0; i < response.dataCat.length
                && numDisplayCatFooter > 0; i++, numDisplayCatFooter--) {
                var tempCat = response.dataCat[i].value;
                var itemCat = `<li id="` + tempCat.categoryID + `">`
                    + tempCat.name + `</li>`;
                $(".footer .category ul").append(itemCat);
            }

            for (var i = 0; i < response.dataGen.length
                && numDisplayGenFooter > 0; i++, numDisplayGenFooter--) {
                var tempGen = response.dataGen[i].value;
                var itemGen = `<li id="` + tempGen.genreID + `">`
                    + tempGen.name + `</li>`;
                $(".footer .type ul").append(itemGen);
            }
        }
    });

    $.get("/components/uploadPopUp.html", function (data) {
        $("body").append(data);
        $(".cancel-upload").click(function () {
            $(".mainpage-upload-comic-form").css("display", "none");
            $(".img-view").remove();
            $("#file, #name, #quantity, #price").val("");
            $("body, html").css("overflow", "scroll");
        });
        $(".submit-upload").click(function () {
            var formData = new FormData();
            var allFiles = document.getElementById(
                "file").files.length;
            for (var i = 0; i < allFiles; i++) {
                var file = document.getElementById(
                    "file").files[i];
                formData.append("file", file);
            }

            // upload images first
            var img_path;
            $.ajax({
                type: 'POST',
                url: "SellerMainPage/UploadImgs",
                data: formData,
                contentType: false,
                processData: false,
                async: false,
                success: function (response) {
                    img_path = response.imgPath;
                },
                error: function () {
                    alert('fail');
                }
            });

            //var img_path = $("#file").val();
            var book_name = $("#name").val();
            var quantity = $("#quantity").val();
            var genre = $("#category option:selected").text();
            var price = $("input#price").val();
            var category = $("#type option:selected").text();
            var author = $("#author").val();
            var publisher = $("#publisher").val();

            $.ajax({
                url: "SellerMainPage/Upload",
                data: {
                    imgPath: img_path,
                    bookName: book_name,
                    quantity: quantity,
                    genre: genre,
                    price: Number(price),
                    category: category,
                    author: author,
                    publisher: publisher
                },
                type: "post",
                success: function () {
                    //alert('upload');
                    $(".mainpage-upload-comic-form").css("display", "none");
                    $(".mainpage-upload_success_notification").css("display", "flex");
                    $(".img-view").remove();
                    $("#file, #name, #quantity, #price").val("");

                    /*showProducts(8);
                    display_all_product(sellerID);*/
                },
                error: function () {
                    alert('error');
                }
            });
        });
        $(".upload-icon").click(function () {
            $(".file-input").click();
        });
        $(".file-input").change(function (e) {
            for (var i = 0; i < e.originalEvent.srcElement.files.length; i++) {
                var file = e.originalEvent.srcElement.files[i];

                var img = document.createElement("img");

                var reader = new FileReader();
                reader.onloadend = function (imgEle, event) {
                    imgEle.src = event.target.result;
                    imgEle.classList.add("img-view");
                    imgEle.alt = "";
                    $(".img-view").click(function () {
                        $(".preview-img").attr("src", this.src);
                        $(".preview-side").css("display", "flex");
                    });
                    $(".preview-side>i").click(function () {
                        $(".preview-side").css("display", "none");
                    });
                }.bind(reader, img);

                reader.readAsDataURL(file);
                $(".file-input").after(img);
            }
        });
    });

    $.get("/components/successPopUp.html", function (data) {
        $("body").append(data);
        $(".return-btn").click(function () {
            $(".mainpage-upload_success_notification").css("display", "none");
            $("body, html").css("overflow", "scroll");

            location.reload(true);
        });
    });

    function showItems(num, srcImg, title, price, rate, amount, productID) {
        $.ajax({
            url: "/components/productItem.html",
            async: false,
            success: function(data) {
                var appendData = $("<div>" + data + "</div>")
                    .find(".product-item")
                    .attr("id", "product-item-" + num);

                $(".best-seller .product-list").append(appendData);

                var item = $(".best-seller .product-list .product-item:last-child()");

                item.find(".imgtag").attr("id", "imgtag-" + num);
                item.find(".product-name").attr("id", "product-name-" + num);
                item.find(".price").attr("id", "price-" + num);
                item.find("span").attr("id", "span-" + num);

                // set value from db
                item.find("#imgtag-" + num).attr("src", srcImg);
                item.find("#product-name-" + num).text(title);

                const formatter = new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "vnd",
                });
                item.find("#price-" + num).text(formatter.format(price));

                var iStar = document.querySelectorAll(".best-seller .product-list " +
                    "#product-item-" + num + ' .rate i[name="star"]');
                var starDisplay = Math.floor(Number(rate));
                for (var i = starDisplay; i < iStar.length; i++) {
                    iStar[i].className = "fa fa-star-o";
                }

                item.find("#span-" + num).text(amount);

                item.click(function () {
                    location.href = "Product" + "?product=" + productID;
                });
            }
        });
    }

    function showProducts(numDisplays) {
        $.ajax({
            url: "/SellerMainPage/DisplayProducts",
            dataType: "json",
            data: { n: numDisplays },
            type: "get",
            async: false,
            success: function (response) {
                var temp = response.data;
                for (var i = 0; i < temp.length; i++) {
                    showItems(
                        i,
                        temp[i].value.imgLink[0],
                        temp[i].value.name,
                        temp[i].value.price,
                        temp[i].value.avgStar,
                        temp[i].value.numbersLeft,
                        temp[i].value.productID
                    );
                }
            }
        });
    }
    showProducts(-1);

    var maxLoadDiscount = 3;
    var maxLoadShipping = 3;
    $.ajax({
        url: "Product/LoadVoucherInfo",
        data: {
            "categoryID": "", // get all
            "sellerID": "", // get all
            "maxLoad": -1 // get all
        },
        success: function (response) {
            for (var i = 0; i < response.data.length; i++) {
                var temp = response.data[i].value;

                var item = `<div class="voucher voucher-discount 
            voucher-item-` + temp.voucherID + `">
                <img src="/assets/images/voucher.png" alt="" />
                <div class="voucher-content">
                    <span class="voucher-name">
                        Voucher dùng cho danh mục Tiểu thuyết
                    </span>
                    <span class="voucher-value">-30% tối đa 20k</span>
                </div>
              </div>`;

                var item2 = `<div class="voucher voucher-freeship 
            voucher-item-` + temp.voucherID + `">
                <img src="/assets/images/freeship.png" alt="" />
                <div class="voucher-content">
                    <span class="voucher-name">
                        Voucher dùng cho danh mục Tiểu thuyết
                    </span>
                    <span class="voucher-value">-30% tối đa 20k</span>
                </div>
              </div>`;

                if (temp.voucherType == 0 && maxLoadDiscount > 0) {
                    $(".vouchers .today-voucher").append(item);

                    var dis = "-" + Number(temp.discountPercent) * 100
                        + "% ";


                    const formatter = new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'vnd',
                    });
                    var maxValue = "tối đa " + formatter.format(
                        temp.maxValue);

                    $(".vouchers .voucher-item-" +
                        temp.voucherID + " .voucher-value").text(
                            dis + maxValue);

                    maxLoadDiscount--;
                }
                else if (temp.voucherType == 1 && maxLoadShipping > 0) {
                    $(".vouchers .free-ship").append(item2);

                    var dis = "-" + Number(temp.discountPercent) * 100
                        + "% ";

                    const formatter = new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'vnd',
                    });
                    var maxValue = "tối đa " + formatter.format(
                        temp.maxValue);

                    $(".vouchers .voucher-item-" +
                        temp.voucherID + " .voucher-value").text(
                            dis + maxValue);

                    maxLoadShipping--;
                }
            }
        }
    });

    if (search != null) {
        $("#search").val(search);
        filterItem(search);
    }
    $("#search").keyup(function () {
        filterItem($("#search").val());
    });
});