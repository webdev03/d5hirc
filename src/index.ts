// @ts-expect-error
import { Client } from "irc-framework";
import { MessageEvent } from "./types";
import config from "../config";
import RandomModule from "./modules/random";
import EightBallModule from "./modules/eightball";
import EvalModule from "./modules/eval";
import FigletModule from "./modules/figlet";
import SquawkModule from "./modules/squawk";
import TicTacToe from "./modules/tictactoe";
import BombParty from "./modules/bombparty";
const modules = [
  RandomModule,
  EightBallModule,
  EvalModule,
  FigletModule,
  TicTacToe,
  BombParty
];
const client = new Client();
let messageCounter = 0;
client.connect({
  host: config.server,
  port: config.port,
  nick: config.nick,
  username: "d5hbot",
  gecos: "d5hbot"
});
client.on("registered", () => {
  console.log("Connected!");
  config.channels.forEach((channel) => client.join(channel));
});
client.on("message", (event: any) => {
  messageCounter++;
  const msg = event.message.slice(2).trim();
  const eventData = {
    nick: event.nick as string,
    ident: event.ident as string,
    hostname: event.hostname as string,
    message: msg,
    time: new Date(event.tags.time) || undefined,
    reply: event.reply,
    totalMessages: messageCounter
  } satisfies MessageEvent;
  SquawkModule.fn(eventData);
  if (!event.message.trim().startsWith("d.")) return;
  modules.forEach((module) => module.fn(eventData));
});

// Handle errors and disconnect events
client.on("error", (err: any) => {
  console.error("Error:", err);
  // TODO: custom error handling here
});

client.on("disconnect", (event: any) => {
  console.log("Disconnected:", event.reason);
});
