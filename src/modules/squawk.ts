import { Module } from "../types";
import { template } from "../utils";

const WORDS = [
  "weird",
  "i",
  "want",
  "dead",
  "Mitsubishi",
  "outlander",
  "please firepup stop killing me",
  "please 9pfs stop",
  "platypus",
  "pineapple",
  "orange",
  "apple",
  "devarsh",
  "firepuppy",
  "anirudh",
  "9pfs",
  "h",
  "hello-smile6",
  "is",
  "cool",
  "argentina",
  "antarctica",
  "usa",
  "guns",
  "boom",
  "lol",
  "why",
  "confusion",
  "neoroll",
  "wooo",
  "amc",
  "irc"
];

function genString() {
  let str = "d.squawk ";
  for (let i = 0; i < 8; i++) {
    str += WORDS[Math.floor(Math.random() * WORDS.length)] + " ";
  }
  return str.trim();
}
function replaceWithUnicodeLookalikes(inputString: string): string {
  const replacements: Record<string, string> = {
    a: "𝓪",
    b: "b",
    c: "𝒸",
    d: "𝒹",
    e: "𝑒",
    f: "𝒻",
    g: "g",
    h: "𝒽",
    i: "i",
    j: "𝒿",
    k: "𝓀",
    l: "𝓁",
    m: "𝓂",
    n: "𝓃",
    o: "ℴ",
    p: "𝓅",
    q: "q",
    r: "𝓇",
    s: "s",
    t: "t",
    u: "𝓊",
    v: "𝓋",
    w: "w",
    x: "𝓍",
    y: "𝓎",
    z: "z"
  };

  // Use regular expression to match and replace the letters
  return inputString.replace(/[a-z]/g, (match) => replacements[match] || match);
}

let lastSquawk = genString();
let lastSquawkTime = Date.now();

export default {
  fn: (ev) => {
    if (ev.totalMessages % 40 === 1) {
      ev.reply(`SQUAWK!!!! First person to type this wins!`);
      lastSquawk = genString();
      lastSquawkTime = Date.now();
      ev.reply(replaceWithUnicodeLookalikes(lastSquawk));
    }
    if (ev.message.startsWith("squawk ")) {
      const reply = ev.message.slice(7);
      if (lastSquawk.length < 1) {
        ev.reply(template("Squawk", ev.nick, `The squawk is not on yet!`));
      } else if (reply.toLowerCase() === lastSquawk.slice(9).toLowerCase()) {
        if ((Date.now() - lastSquawkTime) / 1000 < 4) {
          ev.reply(template("Squawk", ev.nick, `Cheating ain't cool`));
          return;
        }
        ev.reply(
          template(
            "Squawk",
            ev.nick,
            `You won in ${((Date.now() - lastSquawkTime) / 1000).toFixed(
              3
            )} seconds!`
          )
        );
        lastSquawk = "";
      } else {
        ev.reply(template("Squawk", ev.nick, "That's not right."));
      }
    }
  }
} satisfies Module;
