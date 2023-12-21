$(this).ready(function () {
  var urlParams = new URLSearchParams(window.location.search);
  var sellerID = urlParams.get("seller");

  $(".product-item").click(function (e) {
    e.preventDefault();
    location.href = "/Product";
  });

  $(".seller-contact").click(function (e) {
    e.preventDefault();
    location.href = "/Chat" + "?receiver=" + sellerID;
  });
  //pagination function
  $(".pagination p:not(.arrow)").click(function () {
    $(".pagination > .active").toggleClass("active");
    $(this).toggleClass("active");

    $(".product > .active").toggleClass("active");
    var x = Number($(this).text()[1]);
    var y = ".product .page-" + x;
    $(y).toggleClass("active");
  });
  //pagination forward
  $(".pagination p.arrow.forward").click(function () {
    if ($(".pagination > .active").next()[0] !== $(this)[0]) {
      var x = $(".pagination > .active");
      $(".pagination > .active").next().toggleClass("active");
      x.toggleClass("active");

      var y = $(".product > .active");
      $(".product > .active").next().toggleClass("active");
      y.toggleClass("active");
    }
  });
  //pagination back
  $(".pagination p.arrow.back").click(function () {
    if ($(".pagination > .active").prev()[0] !== $(this)[0]) {
      var x = $(".pagination .active");
      $(".pagination .active").prev().toggleClass("active");
      x.toggleClass("active");

      var y = $(".product > .active");
      $(".product > .active").prev().toggleClass("active");
      y.toggleClass("active");
    }
  });

  $(".about img").click(function (e) {
    e.preventDefault();
    location.href = "/SellerInfoBuyer";
  });

  $.get({
    url: "/SellerInfoSeller/DisplayRating",
    dataType: "json",
    success: function (response) {
      //bar
      $(".bar_1").css(
        "width",
        (response.sum ? (response.star[0] / response.sum) * 100 : 0) + "%"
      );
      $(".bar_2").css(
        "width",
        (response.sum ? (response.star[1] / response.sum) * 100 : 0) + "%"
      );
      $(".bar_3").css(
        "width",
        (response.sum ? (response.star[2] / response.sum) * 100 : 0) + "%"
      );
      $(".bar_4").css(
        "width",
        (response.sum ? (response.star[3] / response.sum) * 100 : 0) + "%"
      );
      $(".bar_5").css(
        "width",
        (response.sum ? (response.star[4] / response.sum) * 100 : 0) + "%"
      );

      $(".bar_1 span").text(
        (response.sum ? (response.star[0] / response.sum) * 100 : 0) + "%"
      );
      $(".bar_2 span").text(
        (response.sum ? (response.star[1] / response.sum) * 100 : 0) + "%"
      );
      $(".bar_3 span").text(
        (response.sum ? (response.star[2] / response.sum) * 100 : 0) + "%"
      );
      $(".bar_4 span").text(
        (response.sum ? (response.star[3] / response.sum) * 100 : 0) + "%"
      );
      $(".bar_5 span").text(
        (response.sum ? (response.star[4] / response.sum) * 100 : 0) + "%"
      );
      //star

      $("input#star-" + Math.round(Number(response.avgRating))).prop(
        "checked",
        true
      );

      $("#rating-avg").text("(" + response.avgRating + "/5)");
    },
  });

  function display_product(
    stt,
    productID,
    name,
    price,
    ratingCount,
    numberLeft,
    imgLink
  ) {
    var html =
      '<div class="product-item" id="' +
      productID +
      '">' +
      '<img src="' +
      imgLink +
      '" alt="" class="imgtag" id="imgtag" />' +
      '<div class="container">' +
      '<header class="product-name" id="">' +
      name +
      "</header>" +
      '<div class="price" id="price">' +
      price +
      "</div>" +
      '<div class="rate" id="rate">' +
      '<i class="fa fa-star" aria-hidden="true" name="star"></i>' +
      '<i class="fa fa-star" aria-hidden="true" name="star"></i>' +
      '<i class="fa fa-star" aria-hidden="true" name="star"></i>' +
      '<i class="fa fa-star" aria-hidden="true" name="star"></i>' +
      '<i class="fa fa-star" aria-hidden="true" name="star"></i>' +
      "<span>" +
      numberLeft +
      "</span>" +
      "</div>" +
      "</div>" +
      "</div>";

    $(".product-list.page-" + stt).append(html);
    var item = $(".product-list .product-item:last-child()");
    const starInputs = item.find('i[name="star"]');
    for (let i = 0; i < starInputs.length; i++) {
      starInputs[i].className = "fa fa-star-o";
    }
    for (let i = ratingCount - 1; i >= 0; i--) {
      starInputs[i].className = "fa fa-star";
    }
    item.click(function () {
      location.href = "/Product" + "?product=" + productID;
    });
  }

  function display_all_product() {
    $.ajax({
      url: "SellerInfoSeller/DisplayProduct",
      async: false,
      success: function (response) {
        for (let j = 2; j < response.page[response.len - 1]; j++) {
          $(".layout.product").append(
            '<div class="product-list.page-' + +'"></div>'
          );
        }
        for (let i = 0; i < response.len; i++) {
          display_product(
            response.page[i],
            response.productID[i],
            response.name[i],
            response.price[i],
            response.rate[i],
            response.numbersLeft[i],
            response.imgLink[i]
          );
        }
      },
      error: function () {
        alert("Fail display");
      },
    });
  }

  display_all_product();
});
