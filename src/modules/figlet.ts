import figlet from "figlet";
import { Module } from "../types";
import { template } from "../utils";
export default {
  fn: (ev) => {
    if (ev.message.startsWith("figlet ")) {
      const text = ev.message.slice(7);
      const figl = figlet.textSync(text, {
        font: "Standard",
        width: 80
      });
      figl.split("\n").forEach((line) => {
        ev.reply(template("Figlet", ev.nick, line));
      });
    }
  }
} satisfies Module;
