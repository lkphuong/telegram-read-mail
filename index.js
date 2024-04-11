const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const bot = new TelegramBot("6325369982:AAHUdY2kNM2ePKZzSjBvgru6c2ys_0U3HFg", {
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
        bot.sendMessage(msg.chat.id, content.data.text);
      }
    } else {
      bot.sendMessage(msg.chat.id, "I'm sorry, I don't send email.");
    }
  } catch (err) {
    bot.sendMessage(msg.chat.id, "I'm sorry, I don't send email.");
  }
});
