import config from "../../config";
import { Module } from "../types";
import { template } from "../utils";

function limitText(text: string) {
  if (text.length <= 250) {
      return text;
  } else {
      return text.substring(0, 250) + ` [Continued ${text.length - 250}]`;
  }
}

export default {
  fn: async (ev) => {
    if (ev.message.startsWith("gpt ")) {
      const text = ev.message.slice(4);
      ev.reply(template("AnirudhGPT", ev.nick, "Received request..."));
      const req = await fetch(
        "https://api.techwithanirudh.com/v1/chat/completions",
        {
          method: "POST",
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: "Respond in less than 80 words."
              },
              {
                role: "user",
                content: text
              }
            ],
            max_tokens: 200,
            temperature: 0.6
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + config.opts.ANIRUDHGPT_TOKEN
          }
        }
      );
      if (!req.ok) {
        ev.reply(
          template("AnirudhGPT INTERNAL", ev.nick, "An error happened :(")
        );
        console.error(req);
        return;
      }
      const reqJSON = await req.json();
      const choice = reqJSON.choices[0].message.content as string;
      ev.reply(template("AnirudhGPT", ev.nick, "Here!"));
      ev.reply(limitText(choice.trim()));
      ev.reply(template("AnirudhGPT", ev.nick, "Done!"));
    }
  }
} satisfies Module;
