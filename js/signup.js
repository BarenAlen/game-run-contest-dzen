import JustValidate from "just-validate";
import axios from "axios";

const signup = () => {
  const form = document.querySelector("#signup-form");
  const formMsg = document.querySelector("#signup-msg");
  if (Date.now() > Date.parse("2023-10-14 16:00")) {
    document.querySelector("#join-form").style.display = "none";
  }
  const validation = new JustValidate("#signup-form", {
    errorFieldCssClass: "error",
  });

  validation
    .addField("#signup-email", [
      {
        rule: "required",
        errorMessage: "Необходимо ввести email",
      },
      {
        rule: "email",
        errorMessage: "Неверный email. Напишите в формате: example@domain.ru",
      },
    ])
    .addField("#signup-tg", [
      {
        rule: "required",
        errorMessage: "Необходимо ввести логин в Telegram",
      },
    ])
    .addField("#signup-zen", [
      {
        rule: "required",
        errorMessage: "Необходимо ввести ссылку на канал в Дзене",
      },
      {
        validator: (value) => {
          return value.startsWith("https://dzen.ru/") && value.length > 16;
        },
        errorMessage:
          "Неккоректная ссылка. Напишите в формате: https://dzen.ru/gamers",
      },
    ])
    .addField("#signup-inviter-zen", [
      {
        validator: (value) => {
          if (value.length == 0) {
            return true;
          }

          return value.startsWith("https://dzen.ru/") && value.length > 16;
        },
        errorMessage:
          "Неккоректная ссылка. Напишите в формате: https://dzen.ru/gamers",
      },
    ])
    .onSuccess((event) => {
      _tmr.push({ type: "reachGoal", id: 3398841, goal: "send_form" });
      ym(51446871, "reachGoal", "send_form");

      axios({
        method: "get",
        url: "https://zen.alef.dev/ajax.php",
        params: {
          action: "send_mail",
          "signup-email": document.querySelector("#signup-email").value,
          "signup-tg": document.querySelector("#signup-tg").value,
          "signup-zen": document.querySelector("#signup-zen").value,
          "signup-inviter-zen": document.querySelector("#signup-inviter-zen")
            .value,
        },
      })
        .then(() => {
          form.style.display = "none";
          formMsg.style.display = "block";
          formMsg.classList.add("show");
        })
        .catch(console.error);

      axios
        .post(
          "https://dzen.ru/api/v1/game/event/candidate",
          {
            email: document.querySelector("#signup-email").value,
            telegramLogin: document.querySelector("#signup-tg").value,
            channelLink: document.querySelector("#signup-zen").value,
            referenceLink:
              document.querySelector("#signup-inviter-zen").value || null,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .catch(console.error);
    });
};

export default signup;
