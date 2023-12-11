const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");

const BOT_MSGS = [];

// Icons made by Freepik from www.flaticon.com
const BOT_IMG = "https://image.flaticon.com/icons/svg/327/327779.svg";
const PERSON_IMG = "https://image.flaticon.com/icons/svg/145/145867.svg";
const BOT_NAME = "Fantasy Chicken";
const PERSON_NAME = "Đậu Đức Quân";

msgerForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const msgText = msgerInput.value;
    if (!msgText) return;

    //var urlParams = new URLSearchParams(window.location.search);
    //var buyerID = urlParams.get('user_id');
    //var sellerID = urlParams.get('seller_id');

    //$.ajax({
    //    url: "Chat/SaveLogChat",
    //    data: {
    //        "buyerID": buyerID,
    //        "sellerID": sellerID,
    //        "msg":msgText
    //    },
    //    async: false,
    //    cache: false,
    //    type: "post",
    //});


    appendMessage(PERSON_NAME, PERSON_IMG, "right", msgText);
    msgerInput.value = "";

    botResponse();
});

function appendMessage(name, img, side, text, time = null) {
    // Nếu không có thời gian được truyền vào, sử dụng thời gian hiện tại
    if (!time) {
        time = formatDate(new Date());
    }

    const msgHTML = `
    <div class="msg ${side}-msg">
      <div class="msg-img" style="background-image: url(${img})"></div>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${time}</div>
        </div>

        <div class="msg-text">${text}</div>
      </div>
    </div>
  `;

    msgerChat.insertAdjacentHTML("beforeend", msgHTML);
    msgerChat.scrollTop += 500;
}

function botResponse() {
    const r = random(0, BOT_MSGS.length - 1);
    const msgText = BOT_MSGS[r];
    const delay = msgText.split(" ").length * 100;

    setTimeout(() => {
        appendMessage(BOT_NAME, BOT_IMG, "left", msgText);
    }, delay);
}

// Utils
function get(selector, root = document) {
    return root.querySelector(selector);
}

function formatDate(date) {
    const h = "0" + date.getHours();
    const m = "0" + date.getMinutes();

    return `${h.slice(-2)}:${m.slice(-2)}`;
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}


function displayLogChat(userID, sellerID) {
    $.ajax({
        url: "Chat/DisplayLogChat",
        data: {
            "userID": userID,
            "sellerID": sellerID
        },
        type: "post",
        success: function (response) {
            for (let i = 0; i < response.number; i++) {
                let side = response.pos[i];
                let msg = response.msg[i];
                let time = response.time[i];
                appendMessage(name, PERSON_IMG, side, msg, time);
            }
        }
    });
}

// Gọi hàm displayLogChat khi trang web tải xong
$(document).ready(function () {
    var urlParams = new URLSearchParams(window.location.search);
    var buyerID = urlParams.get('user_id');
    var sellerID = urlParams.get('seller_id');

    displayLogChat(buyerID, sellerID);
});