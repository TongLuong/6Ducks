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

const imgCount = 0;

$(this).ready(function () {
    var urlParams = new URLSearchParams(window.location.search);
    var userID = urlParams.get('user');
    var type = 0; // 0: buyer, 1: seller, (2: admin)
    if (userID == null) {
        userID = urlParams.get('seller'); // ideal condition
        type = 1;
    }

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
            if (type == 0)
                location.href = "UserInfo" + "?user=" + userID;
            else if (type == 1)
                location.href = "SellerInfoSeller" + "?seller=" + userID;
        });
        $(".logo").click(function () {
            if (type == 0)
                location.href = "MainPage" + "?user=" + userID;
            else if (type == 1)
                location.href = "SellerMainPage" + "?seller=" + userID;
        });
        var button =
            `<div class="book-upload">
              <div>
                <img src="/assets/images/book.png" alt="" />
                Đăng bán truyện
              </div>
            </div>`;


        $(".toolbar").append(button);
        $(".book-upload").click(function () {
            $(".mainpage-upload-comic-form").css("display", "flex");
            $("body, html").css("overflow", "hidden");
        });

        $("#search").keyup(filterItem);
    });

    $.get("/components/footer.html", function (data) {
        $("body").append(data);
    });

    $.get("components/uploadPopUp.html", function (data) {
        $("body").append(data);
        $(".cancel-upload").click(function () {
            $(".mainpage-upload-comic-form").css("display", "none");
            $(".img-view").remove();
            $("#file, #name, #quantity, #price").val("");
            $("body, html").css("overflow", "scroll");
        });
        $(".submit-upload").click(function () {
            $(".mainpage-upload-comic-form").css("display", "none");
            $(".mainpage-upload_success_notification").css("display", "flex");
            $(".img-view").remove();
            $("#file, #name, #quantity, #price").val("");

            var urlParams = new URLSearchParams(window.location.search);
            var seller_id = urlParams.get('seller');
            var img_path = $("#upload-icon").attr('src');
            var book_name = $("#name").val();
            var quantity = $("#quantity").val();
            var genre = $("#category").text;
            var price = $("#quantity").val();
            var category = $("#type").text;
            //var author = $("#quantity").val();
            //var publisher = $("#quantity").val();

            $.ajax({
                url: "SellerMainPage/Upload",
                data: {
                    "sellerID": seller_id,
                    "imgPath": img_path,
                    "bookName": book_name,
                    "quantity": quantity,
                    "genre": genre,
                    "price": price,
                    "category": category,
                    "author": author,
                    "publisher": publisher
                },
                type: "post",
                success: function (response) {
                    //display product again
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
                reader.onloadend = function () {
                    img.src = reader.result;
                    img.classList.add("img-view");
                    img.alt = "";
                    $(".img-view").click(function () {
                        $(".preview-img").attr("src", this.src);
                        $(".preview-side").css("display", "flex");
                    });
                    $(".preview-side>i").click(function () {
                        $(".preview-side").css("display", "none");
                    });
                };
                reader.readAsDataURL(file);
                $(".file-input").after(img);
            }
        });
    });

    $.get("components/successPopUp.html", function (data) {
        $("body").append(data);
        $(".return-btn").click(function () {
            $(".mainpage-upload_success_notification").css("display", "none");
            $("body, html").css("overflow", "scroll");
        });
    });

    discountPrice();

    var urlParams = new URLSearchParams(window.location.search);
    var userID = urlParams.get('user');
    var type = 0; // 0: buyer, 1: seller, (2: admin)
    if (userID == null) {
        userID = urlParams.get('seller'); // ideal condition
        type = 1;
    }

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
                    if (type == 0)
                        location.href = "Product" + "?user=" + userID +
                            "&product=" + productID;
                    else if (type == 1)
                        location.href = "Product" + "?seller=" + userID +
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