import { Module } from "../types";
import { template } from "../utils";

function genId() {
  const CHARS = "QWERTYUIOPASDFGHJKLZXCVBNM123456789".split("");
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return result;
}
function array<Type extends string>(p: Type[]): Type[] {
  return p;
}

const PROMPTS = array([
  "bl",
  "br",
  "cl",
  "cr",
  "dr",
  "fr",
  "tr",
  "fl",
  "gl",
  "gr",
  "pl",
  "pr",
  "sl",
  "sm",
  "sp",
  "st",
  "ab",
  "au",
  "ch",
  "ci",
  "cia",
  "ck",
  "ct",
  "dge",
  "dis",
  "dw",
  "ed",
  "ex",
  "ft",
  "ful",
  "gh",
  "in",
  "ing",
  "iou",
  "kn",
  "ld",
  "le",
  "lf",
  "lk",
  "lm",
  "lp",
  "lt",
  "ly",
  "men",
  "mis",
  "mp",
  "nce",
  "nch",
  "nd",
  "ng",
  "nk",
  "nse",
  "nt",
  "ou",
  "ov",
  "ph",
  "psy",
  "pt",
  "re",
  "sc",
  "sh",
  "shr",
  "sk",
  "sn",
  "spr",
  "str",
  "sw",
  "tch",
  "th",
  "thr",
  "tie",
  "ti",
  "tur",
  "tw",
  "un",
  "wh",
  "wr",
  "th",
  "ar",
  "he",
  "te",
  "an",
  "se",
  "in",
  "me",
  "er",
  "sa",
  "nd",
  "ne",
  "re",
  "wa",
  "ed",
  "ve",
  "es",
  "le",
  "ou",
  "no",
  "to",
  "ta",
  "ha",
  "al",
  "en",
  "de",
  "ea",
  "ot",
  "st",
  "so",
  "nt",
  "dt",
  "on",
  "ll",
  "at",
  "tt",
  "hi",
  "el",
  "as",
  "ro",
  "it",
  "ad",
  "ng",
  "di",
  "is",
  "ew",
  "or",
  "ra",
  "et",
  "ri",
  "of",
  "sh",
  "ti",
  "ul",
  "ji",
]);
function genPrompt() {
  return PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
}

type Game = {
  id: string;
  players: string[];
  started: boolean;
  currentTurn: number;
  currentPrompt: (typeof PROMPTS)[number];
  currentTime: number;
  usedWords: string[];
};

const games: Game[] = [];

export default {
  fn: (ev) => {
    if (ev.message.startsWith("bmb ")) {
      const cmd = ev.message.slice(4).split(" ");
      if (cmd[0] === "create") {
        let gameId = genId();
        while (games.find((x) => x.id === gameId)) gameId = genId();
        games.push({
          id: gameId,
          players: [ev.nick],
          usedWords: [],
          started: false,
          currentTurn: 0,
          currentPrompt: "ab",
          currentTime: Date.now(),
        });
        ev.reply(
          template(
            "BombParty",
            ev.nick,
            `Game created with ID ${gameId} ! Ask the Player 2 to run d.bmb join ${gameId}`
          )
        );
      } else if (cmd[0] === "join") {
        const gameId = cmd[1];
        const game = games.find((x) => x.id === gameId);
        if (!gameId || !game) {
          ev.reply(template("BombParty", ev.nick, `That game does not exist.`));
          return;
        }
        if (game.players.includes(ev.nick)) {
          ev.reply(template("BombParty", ev.nick, "You have already joined."));
          return;
        }
        game.players.push(ev.nick);
        ev.reply(
          template(
            "BombParty",
            ev.nick,
            `Still waiting... Run d.bmb start ${game.id} to start the game`
          )
        );
      } else if (cmd[0] === "start") {
        const gameId = cmd[1];
        const game = games.find((x) => x.id === gameId);
        if (!gameId || !game) {
          ev.reply(
            template(
              "BombParty",
              ev.nick,
              `That game does not exist or has completed.`
            )
          );
          return;
        }
        if (game.started) {
          ev.reply(
            template("BombParty", ev.nick, `That game has already started.`)
          );
          return;
        }
        if (!game.players.includes(ev.nick)) {
          ev.reply(template("BombParty", ev.nick, `You are not in the game.`));
          return;
        }
        game.started = true;
        game.currentTurn = 0;
        game.currentPrompt = genPrompt();
        game.currentTime = Date.now();
        ev.reply(
          template(
            "BombParty",
            game.players[0],
            `Prompt: ${game.currentPrompt} (Play by running d.bmb play ${game.id} {word} )`
          )
        );
      } else if (cmd[0] === "play") {
        const gameId = cmd[1];
        const game = games.find((x) => x.id === gameId);
        if (!gameId || !game) {
          ev.reply(
            template(
              "BombParty",
              ev.nick,
              `That game does not exist or has completed.`
            )
          );
          return;
        }
        if (!game.started) {
          ev.reply(
            template("BombParty", ev.nick, "The game has not started yet.")
          );
          return;
        }
        if (!game.players.includes(ev.nick)) {
          ev.reply(template("BombParty", ev.nick, "You are not in the game."));
          return;
        }
        if (
          game.currentTurn % game.players.length !==
          game.players.findIndex((x) => x === ev.nick)
        ) {
          ev.reply(template("BombParty", ev.nick, "It is not your turn."));
          return;
        }
        const word = cmd[2].trim().toLowerCase();
        if (game.usedWords.includes(word)) {
          ev.reply(template("BombParty", ev.nick, "Word already used."));
          return;
        }
        if (!word.includes(game.currentPrompt)) {
          ev.reply(
            template("BombParty", ev.nick, "Word does not follow prompt.")
          );
          return;
        }
        if (Date.now() - game.currentTime > 15000 - game.currentTurn * 100) {
          ev.reply(
            template(
              "BombParty",
              ev.nick,
              `You took more than ${
                15 - game.currentTurn * 0.1
              } seconds, you're out.`
            )
          );
          game.players = game.players.filter((x) => x !== ev.nick);
          game.currentPrompt = genPrompt();
          game.currentTime = Date.now();
          ev.reply(
            template(
              "BombParty",
              game.players[game.currentTurn % game.players.length],
              `${
                game.players.length === 1 ? "LAST PLAYER STANDING " : ""
              }Prompt: ${game.currentPrompt} (Play by running d.bmb play ${
                game.id
              } {word} )`
            )
          );
          return;
        }
        game.currentTurn++;
        let ct = game.currentTurn;
        game.currentPrompt = genPrompt();
        game.currentTime = Date.now();
        ev.reply(
          template(
            "BombParty",
            game.players[game.currentTurn % game.players.length],
            `${
              game.players.length === 1 ? "LAST PLAYER STANDING " : ""
            }Prompt: ${game.currentPrompt} (Play by running d.bmb play ${
              game.id
            } {word} )`
          )
        );
        setTimeout(() => {
          if (game.currentTurn === ct) {
            ev.reply(
              template(
                "BombParty",
                ev.nick,
                `You took more than ${
                  15 - game.currentTurn * 0.1
                } seconds, you're out.`
              )
            );
            game.players = game.players.filter((x) => x !== ev.nick);
            if (game.players.length === 0) {
              ev.reply(
                template(
                  "BombParty",
                  ev.nick,
                  `Luckily, you were the last one standing: YOU WON :D`
                )
              );
              return;
            }
            game.currentPrompt = genPrompt();
            game.currentTime = Date.now();
            ev.reply(
              template(
                "BombParty",
                game.players[game.currentTurn % game.players.length],
                `Prompt: ${game.currentPrompt} (Play by running d.bmb play ${game.id} {word} )`
              )
            );
          }
        }, 15000 - game.currentTurn * 100);
      }
    }
  },
} satisfies Module;
