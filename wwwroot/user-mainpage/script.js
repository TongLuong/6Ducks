﻿$(this).ready(function () {
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

    function showItems(srcImg, title, price, rate, amount) {
        $.get("components/productItem.html", function (data) {
            //document.createElement('i');
            $(".best-seller .product-list").append(data);
            var item = $(".best-seller .product-list a:last-child()");
            //console.log(data);
            item.find("#atag").attr("href", "Product?id=" + productid);
            item.find("#imgtag").attr("src", srcImg);
            item.find("#product-name").text(title);
            item.find("#price").text(price);
            item.find("span").text(amount);

            //$("#wrp").append(data);
            /*var result = $(data).find("a").attr("href", "Product");
            $("#wrp").append(result);
            $("#wrp").append($(data).find("#product-item"));
                $("#wrp").append($(data).find("img").attr("src", srcImg));
                $("#wrp").append($(data).find("header").text(title));
                $("#wrp").append($(data).find(".price").text(price));

                //TODO: function for rating
                //$("#wrp").append($(data).find(".rate").html(function () { }));

                $("#wrp").append($(data).find("span").text(amount));*/
            }
        );
    }
    showItems("/assets/images/book-2.png",
        "Conan Thám tử lừng danh - Tập 100", "129.000đ", 12, 1857);
    showItems("/assets/images/book-3.png",
        "Light Novel Thiên sứ nhà bên - Tập 1", "129.000đ", 12, 1857);
});  