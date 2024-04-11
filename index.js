const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const express = require("express");
const app = express();
const port = 3000;

require("dotenv").config();

console.log(process.env.TOKEN);

const bot = new TelegramBot(process.env.TOKEN, {
  polling: true,
});

bot.on("message", async (msg) => {
  try {
    const mails = await axios.get(
      `https://inboxes.com/api/v2/inbox/${msg.text}`
    );

    if (mails.status === 200) {
      const messages = mails.data["msgs"];

      const content = await axios.get(
        `https://inboxes.com/api/v2/message/${messages[0].uid}`
      );

      if (content.status === 200) {
        console.log("Bot sending email");
        bot.sendMessage(msg.chat.id, content.data.text);
      }
    } else {
      bot.sendMessage(msg.chat.id, "I'm sorry, I don't send email.");
    }
  } catch (err) {
    bot.sendMessage(msg.chat.id, "I'm sorry, I don't send email.");
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
