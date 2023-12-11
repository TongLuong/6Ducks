function discountPrice() {
  $(".discount .price").each(function() {
    var price =  parseFloat($(this).text().replace(/[.]/g, ''));
    var badge = parseFloat($(".discount .product-item").has($(this)).find(".badge").text()) / 100;
    var discount = ((1 + badge) * price).toLocaleString() + "đ";
    $(this).html($("<span>").text($(this).text()));
    $(this).append($("<span>").text(discount));
  });
  $(".price span:nth-child(2)").css({
    "text-decoration": "none",
    "margin-left": "10px"
  })
  $(".price span:first-child").css("text-decoration", "line-through");
};

$(this).ready(function () {
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
        str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
        return str;
    }

    function filterItem() {
        var searchInput = removeVietnameseTones(
            $("#search").val().toUpperCase());

        var records = $(".best-seller .product-list .product-item");
        records.each(function () {
            var name = $(this).find(".product-name").text();

            if (searchInput == ""
                || removeVietnameseTones(
                    name.toUpperCase()).indexOf(searchInput) > -1) {
                $(this).css("display", ""); // use default display value
            }
            else {
                $(this).css("display", "none");
            }
        });
    }

    $.get("/components/header.html", function (data) {
        $("body").prepend(data);
        $(".user").click(function () {
            location.href = "SellerInfoSeller";
        });
        $(".logo").click(function () {
            location.href = "SellerMainPage";
        });

        $("#search").keyup(filterItem);
    });

    $.get("/components/footer.html", function (data) {
        $("body").append(data);
    });

    discountPrice();

    var urlParams = new URLSearchParams(window.location.search);
    var userID = urlParams.get('user');

    function showItems(num, srcImg, title, price, rate, amount,
        productID) {
        $.get(
            "/components/productItem.html",
            function (data) {
                var appendData = $("<div>" + data + "</div>").find(
                    ".product-item").attr("id", "product-item-" + num);

                $(".best-seller .product-list").append(appendData);

                var item = $(".best-seller .product-list .product-item:last-child()");

                item.find(".imgtag").attr("id", "imgtag-" + num);
                item.find(".product-name").attr("id", "product-name-" + num);
                item.find(".price").attr("id", "price-" + num);
                item.find("span").attr("id", "span-" + num);

                // set value from db
                item.find("#imgtag-" + num).attr("src", srcImg);
                item.find("#product-name-" + num).text(title);

                const formatter = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'vnd',
                });
                item.find("#price-" + num).text(formatter.format(price));

                item.find("#span-" + num).text(amount);

                item.click(function () {
                    location.href = "Product" + "?user=" + userID +
                        "&product=" + productID;
                });
            }
        );
    }

    function showProducts(numDisplays) {
        $.ajax
            ({
                url: 'SellerMainPage/DisplayProducts',
                dataType: 'json',
                data: { "n": numDisplays },
                type: 'POST',
                success: function (response) {
                    var temp = response.data;
                    for (var i = 0; i < temp.length; i++) {
                        showItems(i, temp[i].value.imgLink, temp[i].value.name,
                            temp[i].value.price, temp[i].value.ratingCount,
                            temp[i].value.numbersLeft, temp[i].value.productID);
                    }
                }
            });
    }
    showProducts(8);
});