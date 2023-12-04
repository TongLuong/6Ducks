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

    function showItems(srcImg, title, price, rate, amount) {
        var result = "";
        $.get("/components/productItem.html", function (data) {
                //document.createElement('i');
                $("#wrp").append($(data).find("a").attr("href", "Product"));
                $("#wrp").append($(data).find("img").attr("src", srcImg));
                $("#wrp").append($(data).find("header").text(title));
                $("#wrp").append($(data).find(".price").text(price));

                //TODO: function for rating
                //$("#wrp").append($(data).find(".rate").html(function () { }));

                $("#wrp").append($(data).find("span").text(amount));
            }
        );
        
        return result;
    }
    showItems("/assets/images/book-1-1.png", "yeahh", 198, 12, 100);
    /*$.get("/components/productItem.html", function (data) {
        $.get(".wrapper best-seller").append(showItem("", "yeahh", 198, 12, 100));
        }
    )*/
});  