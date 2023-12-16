$(this).ready(function () {
    // $.get("/components/header.html", function (data) {
    //   $("body").prepend(data);
    // });

    // $.get("/components/footer.html", function (data) {
    //   $("body").append(data);
    // });

    $("#pwd ~ .show-pwd").click(function (e) {
        e.preventDefault();
        $(this).css("display", "none");
        $("#pwd ~ .hide-pwd").css("display", "block");
        $("#pwd")[0].type = "text";
    });

    $("#pwd ~ .hide-pwd").click(function (e) {
        e.preventDefault();
        $(this).css("display", "none");
        $("#pwd ~ .show-pwd").css("display", "block");
        $("#pwd")[0].type = "password";
    });

    $("#re-pwd ~ .show-pwd").click(function (e) {
        e.preventDefault();
        $(this).css("display", "none");
        $("#re-pwd ~ .hide-pwd").css("display", "block");
        $("#re-pwd")[0].type = "text";
    });

    $("#re-pwd ~ .hide-pwd").click(function (e) {
        e.preventDefault();
        $(this).css("display", "none");
        $("#re-pwd ~ .show-pwd").css("display", "block");
        $("#re-pwd")[0].type = "password";
    });

    $(".login-btn span").click(function (e) {
        e.preventDefault();
        location.href = "/Login";
    });

    $(".signin-btn").click(function () {
        var displayName = $("#username").val();
        var dob = $("#birth-date").val();
        var email = $("#email").val();
        var phoneNumber = $("#phone-number").val();
        var address = $("#address").val();
        var usertype = $("#account-type").val();
        var username = displayName;
        var pass = $("#pwd").val();
        var transactionNumber = null;

        $.ajax({
            url: "SignIn/RegisterNewUser",
            data: {
                "displayName": displayName,
                "dob": dob,
                "email": email,
                "phoneNumber": phoneNumber,
                "address": address,
                "usertype": usertype,
                "username": username,
                "pass": pass,
                "transactionNumber": transactionNumber
            }
        });

        location.href = "Login";
    });
});
