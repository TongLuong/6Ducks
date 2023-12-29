const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");

const BOT_MSGS = [];

// Icons made by Freepik from www.flaticon.com
const BOT_IMG = "https://images.unsplash.com/photo-1702234728311-baaa6c8aa212?q=80&w=1772&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
const PERSON_IMG = "https://images.unsplash.com/photo-1701743808933-3467556d43c3?q=80&w=1772&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
var BOT_NAME = "Fantasy Chicken";
var PERSON_NAME = "Đậu Đức Quân";


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


function displayLogChat(receiverID) {
    $.ajax({
        url: "DisplayLogChat",
        data: {
            "receiverID": receiverID
        },
        type: "json",
        success: function (response) {
            BOT_NAME = response.sellerName;
            PERSON_NAME = response.userName;
            for (let i = 0; i < response.number; i++) {
                let side = response.pos[i];
                let msg = response.msg[i];
                let time = response.time[i];
                var sender_name;
                if (side == "right") { sender_name = PERSON_NAME; }
                if (side == "left") { sender_name = BOT_NAME; }
                appendMessage(sender_name, PERSON_IMG, side, msg, time);
            }
        }
    });
}

function saveChat() {
    var msgText = $(".msger-input").val();
    if (!msgText) return;

    $.ajax({
        url: "SaveLogChat",
        type: "post",
        data: {
            "receiverID": receiverID,
            "msg": msgText
        },
        success: function () {
            appendMessage(PERSON_NAME, PERSON_IMG, "right", msgText);
            msgerInput.value = "";

            botResponse();
        }
    });
}

//Gọi hàm displayLogChat khi trang web tải xong
$(document).ready(function () {
    var urlParams = new URLSearchParams(window.top.location.search);
    var receiverID = urlParams.get('receiver');
    displayLogChat(receiverID);

    $(".msger-input").keydown(function (event) {
        if (event.keyCode === 13) { // Enter key
            saveChat();
        };
    });

    $("#msger-send-btn").click(function () {
        saveChat();
    });


});