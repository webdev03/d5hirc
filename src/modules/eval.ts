import tio from "tryitonline";
import { Module } from "../types";
import { template } from "../utils";
const tioLangs = (await tio.languages()).map(x => x.id);
export default {
  fn: async (ev) => {
    if(ev.message.startsWith("eval ")) {
      console.log(ev.ident, "used the eval function!")
      const msgString = ev.message.slice(5);
      const language = msgString.split(" ")[0];
      const evalString = msgString.slice(language.length + 1);
      if(!tioLangs.includes(language)) {
        ev.reply(template("Eval", ev.ident, `The language ${language} is not supported by TIO.`));
        return;
      }
      if(evalString.length > 120) {
        ev.reply(template("Eval", ev.ident, `Your code is ${evalString.length - 120} character(s) over the limit.`));
        return;
      }
      const req = await tio.evaluate({
        code: evalString,
        language: language
      }, 7000);
      if(req.status === "timed out") {
        ev.reply(template("Eval", ev.ident, `Your code timed out.`))
        return
      }
      ev.reply(template("Eval", ev.ident, `Output: ${req.output.replace(/\n/gm, "\\n")}`))
    }
  }
} satisfies Module;
