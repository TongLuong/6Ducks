$(this).ready(function () {
    $.get("/components/header.html", function (data) {
      $("body").prepend(data);
      $(".book-upload").css("display", "none");
      $(".user").click(function() {
          location.href = 'UserInfo';
    });
    });
  
    $.get("/components/footer.html", function (data) {
      $("body").append(data);
    });

    $.get("/components/productItem.html", function (data) {
        //document.createElement('i');
        $(data).find("a").attr("href", "..");
        $(data).find("img").attr("src", "/assets/images/book-1-1.png");
        $(data).find("header").text("yeahh");
        $(data).find(".price").text("100");

        //TODO: function for rating
        $(data).find(".rate").html(function () { });

        $(data).find("span").text(10);

        $("#wrapper").append(data);
    }
    );

    function showItems(srcImg, title, price, rate, amount) {
        var result = null;
        $.get("/components/productItem.html", function (data) {
                //document.createElement('i');
            $(data).find("a").attr("href", "Product");
            $(data).find("img").attr("src", srcImg);
            $(data).find("header").text(title);
            $(data).find(".price").text(price);

            //TODO: function for rating
            $(data).find(".rate").html(function () { });

            $(data).find("span").text(amount);

            result = data;
            }
        );
        $("body").append(data);
        return result;
    }
    showItem("", "yeahh", 198, 12, 100);
    /*$.get("/components/productItem.html", function (data) {
        $.get(".wrapper best-seller").append(showItem("", "yeahh", 198, 12, 100));
        }
    )*/
});  