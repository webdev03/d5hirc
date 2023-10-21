import { Module } from "../types";
import { template } from "../utils";
export default {
  fn: (ev) => {
    if(ev.message.startsWith("random")) {
      ev.reply(template("Random", ev.ident, `Here's a random dice roll: ${Math.floor(Math.random() * 6) + 1}`))
    }
  }
} satisfies Module;
