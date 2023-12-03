$(this).ready(function () {
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

  $(".list-image").css("height", $(".preview-image").height());

  $(".demo").click(function () {
    $(".preview-image").css(
      "background-image",
      $("." + this.classList[1]).css("background-image")
    );
  });

  //demo image function
  $(".product-image").ready(function () {
    var n = $(".demo-image .demo").length;
    for (let i = 1; i <= n; i++) {
      var url = 'url("/assets/images/book-1-' + i + '.png")';
      var select = ".demo-image .demo-" + i;
      $(select).css("background-image", url);
    }
    $(".show-image").css(
      "background-image",
      $(".demo-image .demo-1").css("background-image")
    );
    $(".demo-image .demo").click(function () {
      $(".show-image").css("background-image", $(this).css("background-image"));
    });
  });
  //quantity increase and reduce function
  $("#increase").click(function () {
    $("#quantity").val(Number($("#quantity").val()) + 1);
  });
  $("#reduce").click(function () {
    $("#quantity").val(function () {
      if (Number($("#quantity").val()) < 2) return 1;
      else return Number($("#quantity").val()) - 1;
    });
  });

  $(".view-seller-page").click(function (e) {
    e.preventDefault();
    location.href = "SellerInfoBuyer";
  });

  $(".show-fb").click(function (e) {
    e.preventDefault();
    $(".full-feedback").toggle();
  });

    function displayStar() {
        const starInputs = document.querySelectorAll('i[class="fa fa-star"]');

        $.get(
            "Product/DisplayRating", { "productID": 300000001 },
            function (response) {
                starInputs[response.numberOfStars].checked = true;
            }
        )

        for (let i = 0; i < starInputs.length; i++) {
            starInputs[i].disabled = true;
        }
    }

    displayStar();
});
