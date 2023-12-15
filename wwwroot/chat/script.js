$(this).ready(function () {
    var urlParams = new URLSearchParams(window.location.search);
    var userID = urlParams.get('user');
    var type = 0; // 0: buyer, 1: seller, (2: admin)
    if (userID == null) {
        userID = urlParams.get('seller'); // ideal condition
        type = 1;
    }
    var seller_id = urlParams.get('receiver');

    $.get("/components/header.html", function (data) {
        $("body").prepend(data);
        $(".book-upload").css("display", "none");
        $(".logo").click(function () {
            if (type == 0)
                location.href = "MainPage" + "?user=" + userID;
            else if (type == 1)
                location.href = "SellerMainPage" + "?user=" + userID;
        });
    });

    $.get("/components/footer.html", function (data) {
        $("body").append(data);
    });

    $(".container_seller img").click(function (e) {
        e.preventDefault();

        if (type == 0)
            location.href = "SellerInfoBuyer" + "?user=" + userID;
        else if (type == 1)
            location.href = "SellerInfoBuyer" + "?seller=" + userID;
    });

    function showStar(seller_id) {
        // Get the input elements
        const starInputs = document.querySelectorAll('input[name="star"]');

        $.get
            (
                "Chat/GetRate", { "sellerID": seller_id },
                function (response) {
                    starInputs[5 - response.numberOfStars].checked = true;
                }
            )

        // Disable the remaining star inputs
        for (let i = 0; i < starInputs.length; i++) {
            starInputs[i].disabled = true;
        }
    }

    showStar(seller_id);
});