import { Module } from "../types";
import { template } from "../utils";
export default {
  fn: async(ev) => {
    if (ev.message.startsWith("bored")) {
      const req = await fetch(`https://www.boredapi.com/api/activity/`);
      if(!req.ok) return;
      const json = await req.json();
      ev.reply(
        template(
          "Bored",
          ev.nick,
          json.activity
        )
      );
    }
  }
} satisfies Module;
