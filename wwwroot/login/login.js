$(this).ready(function () {
    // $.get("/components/header.html", function (data) {
    //   $("body").prepend(data);
    // });

    // $.get("/components/footer.html", function (data) {
    //   $("body").append(data);
    // });

    $(".signin").click(function (e) {
        e.preventDefault();
        location.href = "SignIn";
    });

    $("input#username, input#pwd").keydown(function (event) {
        if (event.keyCode === 13) {
            $(".login-btn").trigger("click");
        }
    });

    $(".login-btn").click(function () {
        var username = $("#username").val();
        var pwd = $("#pwd").val();

        $.ajax({
            url: "Login/CheckLogin",
            data:
            {
                "username": username,
                "email": null,
                "pwd": pwd
            },
            cache: false,
            success: function (response) {
                if (response.status) {
                    location.href = "MainPage";
                }
                else {
                    $("#invalid-label").css("display", "block");
                }
            }
        });

        //document.write(document.getElementById("username").value);
        //location.href = "MainPage";
    });

    $(".show-pwd").click(function (e) {
        e.preventDefault();
        $(this).css("display", "none");
        $(".hide-pwd").css("display", "block");
        $("#pwd")[0].type = "text";
    });

    $(".hide-pwd").click(function (e) {
        e.preventDefault();
        $(this).css("display", "none");
        $(".show-pwd").css("display", "block");
        $("#pwd")[0].type = "password";
    });
});
