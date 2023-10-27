import config from "../../config";
import { Module } from "../types";
import { template } from "../utils";

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
                role: "user",
                content: text
              }
            ],
            temperature: 0.5
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
      ev.reply(choice.trim());
      ev.reply(template("AnirudhGPT", ev.nick, "Done!"));
    }
  }
} satisfies Module;
