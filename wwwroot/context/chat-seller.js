const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");

const BOT_MSGS = [];

// Icons made by Freepik from www.flaticon.com
const BOT_IMG = "https://image.flaticon.com/icons/svg/327/327779.svg";
const PERSON_IMG = "/assets/images/user.png";
var BOT_NAME = "Đậu Đức Quân";
var PERSON_NAME = "Fantasy Chicken";

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

function display_log_chat(buyerID) {
    
    $.ajax({
        url: "DisplayLogChat",
        data: {
            "receiverID": buyerID
        },
        type: "json",
        success: function (response) {
            $(".msger-chat .msg").remove();
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
        },
        error: function() {
            alert("Log chat error");
        }
    });
}

// Hàm để thêm vào bên thanh Người nhắn
function fetchMessages() {
    $.ajax({
        url: "/Chat/DisplayConversation",
        type: "json",
        async:false,
        success: function(response) {
            // Giả sử 'data' là một mảng các đối tượng, mỗi đối tượng có các thuộc tính 'status', 'imageUrl', 'username', 'message', và 'date'
            // status: xem class là msgs online hay msgs
            for (let i = 0; i < response.num; i++) {
                addMessage(response.id[i], response.name[i], response.msg[i], response.time[i]);
            }
            if (response.num > 0) {
                display_log_chat(response.id[0]);
                $.ajax({
                    url: "/Chat/SaveCurrentConversation",
                    data: { "receiverID": response.id[0] }
                });
            }
        },
        error: function() {
            alert("Cannot display conversation");
        }
    });
}

function addMessage(userID, username, message, date) {
    var html = '<div class="msgs" id="' + userID + '">' +
        '    <img class="msgs-profile" src="' + PERSON_IMG + '" alt="" />' +
               '    <div class="msgs-detail">' +
               '        <div class="msgs-username">' + username + '</div>' +
               '        <div class="msgs-content">' +
               '            <span class="msgs-message">' + message + '</span>' +
               '            <span class="msgs-date">' + date + '</span>' +
               '        </div>' +
               '    </div>' +
               '</div>';
    $('.conversation-area').append(html);
}



// Gọi hàm displayLogChat khi trang web tải xong
$(document).ready(function () {
    fetchMessages();

    $(".msgs").click(function () {
        var buyerID = $(this).prop("id");
        display_log_chat(buyerID);
        $.ajax({
            url: "/Chat/SaveCurrentConversation",
            data: { "receiverID": buyerID }
        });
    });

    function saveChat() {
        var msgText = $(".msger-input").val();
        if (!msgText) return;

        $.ajax({
            url: "SaveLogChatSeller",
            type: "post",
            data: {
                "msg": msgText
            },
            success: function (response) {
                appendMessage(PERSON_NAME, PERSON_IMG, "right", msgText);
                msgerInput.value = "";

                $("#" + response.buyerID + " .msgs-message").text(msgText);
                $("#" + response.buyerID + " .msgs-date").text(response.timeSave);
                botResponse();

            },
            error: function () {
                alert("error");
            }
        });
    }

    $(".msger-input").keydown(function (event) {
        if (event.keyCode === 13) { // Enter key
            saveChat();
        };
    });

    $("#msger-send-btn").click(function () {
        saveChat();
    });
});
