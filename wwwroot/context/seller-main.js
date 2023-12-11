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
    $.get("/components/header.html", function (data) {
        $("body").prepend(data);
        $(".user").click(function () {
            location.href = "SellerInfoSeller";
        });
        $(".logo").click(function () {
            location.href = "SellerMainPage";
        });
    });

    $.get("/components/footer.html", function (data) {
        $("body").append(data);
    });

    discountPrice();

    var urlParams = new URLSearchParams(window.location.search);
    var userID = urlParams.get('user');

    function showItems(srcImg, title, price, rate, amount,
        productID) {
        $.get("/components/productItem.html", function (data) {
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
                        showItems(temp[i].value.imgLink, temp[i].value.name,
                            temp[i].value.price, temp[i].value.ratingCount,
                            temp[i].value.numbersLeft, temp[i].value.productID);
                    }
                }
            });
    }
    showProducts(8);
});