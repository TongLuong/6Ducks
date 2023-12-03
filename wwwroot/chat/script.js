$(this).ready(function () {
  $.get("/components/header.html", function (data) {
    $("body").prepend(data);
    $(".book-upload").css("display", "none");
    $(".logo").click(function() {
      window.location.href = 'MainPage'
  });
  });

  $.get("/components/footer.html", function (data) {
    $("body").append(data);
  });

  $(".container_seller img").click(function (e) {
    e.preventDefault();
      location.href = "SellerInfoBuyer";
  });

    function showStar() {
        // Get the input elements
        const starInputs = document.querySelectorAll('input[name="star"]');

        $.get
            (
                "Chat/GetRate", { "sellerID": 210000001 },
                function (response) {
                    starInputs[response.numberOfStars].checked = true;
                }
            )

        // Disable the remaining star inputs
        for (let i = 0; i < starInputs.length; i++) {
            starInputs[i].disabled = true;
        }
    }

    showStar();
});