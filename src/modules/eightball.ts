import { Module } from "../types";
import { template } from "../utils";

const options = [
  "It is certain",
  "It is decidedly so",
  "Without a doubt",
  "Yes definitely",
  "You may rely on it",
  "As I see it, yes",
  "Most likely",
  "Outlook good",
  "Yes",
  "Signs point to yes",
  "Reply hazy, try again",
  "Ask again later",
  "Better not tell you now",
  "Cannot predict now",
  "Concentrate and ask again",
  "Don't count on it",
  "My reply is no",
  "My sources say no",
  "Outlook not so good",
  "Very doubtful"
];

export default {
  fn: (ev) => {
    if (ev.message.startsWith("magic8")) {
      ev.reply(
        template(
          "Magic 8 Ball",
          ev.nick,
          `${options[Math.floor(Math.random() * options.length)]}`
        )
      );
    }
  }
} satisfies Module;
