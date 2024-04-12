const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const cheerio = require("cheerio");

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
        const $ = cheerio.load(content.data.html);

        let text = $("p").text();

        text = text ? text : content.data.text;
        console.log(`Bot sending message to ${msg.from.username}.............`);
        bot.sendMessage(msg.chat.id, text);
      }
    } else {
      bot.sendMessage(msg.chat.id, "I'm sorry, I don't send email.");
    }
  } catch (err) {
    console.error(err);
    bot.sendMessage(msg.chat.id, "I'm sorry, I don't send email.");
  }
});
