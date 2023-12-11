$(this).ready(function () {
    /*$.get("/components/header.html", function (data) {
      $("body").prepend(data);
      $(".book-upload").css("display", "none");
      $(".user").click(function() {
          location.href = 'UserInfo';
    });
    });
  
    $.get("/components/footer.html", function (data) {
      $("body").append(data);
    });*/

    var urlParams = new URLSearchParams(window.location.search);
    var userID = urlParams.get('user');

    function showItems(srcImg, title, price, rate, amount,
        productID) {
        $.get("components/productItem.html", function (data) {
            //document.createElement('i');
            $(".best-seller .product-list").append(data);
            var item = $(".best-seller .product-list .product-item:last-child()");
            //console.log(data);
            //item.find("#atag").attr("href", 'Product');
            item.find("#imgtag").attr("src", srcImg);
            item.find("#product-name").text(title);

            const formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'vnd',
            });
            item.find("#price").text(formatter.format(price));

            item.find("span").text(amount);

            item.click(function () {
                location.href = "Product" + "?user=" + userID +
                    "&product=" + productID;
            });
        }
        );
    }
    /*showItems("/assets/images/book-2.png",
        "Conan Thám tử lừng danh - Tập 100", "129.000đ", 12, 1857,
        "1234");
    showItems("/assets/images/book-3.png",
        "Light Novel Thiên sứ nhà bên - Tập 1", "129.000đ", 12, 1857);*/

    function showProducts(numDisplays) {
        $.ajax
            ({
                url: 'MainPage/DisplayProducts',
                dataType: 'json',
                data: { "n": numDisplays },
                type: 'POST',
                success: function (response) {
                    var temp = response.data;
                    for (var i = 0; i < temp.length; i++) {
                        showItems(temp[i].value.imgLink, temp[i].value.name,
                            temp[i].value.price, temp[i].value.ratingCount,
                            temp[i].value.numbersLeft, temp[i].value.productID);
                    }
                }
            });
    }
    //showProducts(8);
});