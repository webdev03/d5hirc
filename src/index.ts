// @ts-expect-error
import { Client } from "irc-framework";
import { MessageEvent } from "./types";
import config from "../config";
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
  const msg = event.message.trim().startsWith("d.") ? event.message.slice(2).trim() : event.message;
  const eventData = {
    nick: event.nick as string,
    ident: event.ident as string,
    hostname: event.hostname as string,
    message: msg,
    time: new Date(event.tags.time) || undefined,
    reply: event.reply,
    totalMessages: messageCounter
  } satisfies MessageEvent;
  config.alwaysModules.forEach(module => module.fn(eventData));
  if (!event.message.trim().startsWith("d.")) return;
  config.normalModules.forEach((module) => module.fn(eventData));
});

// Handle errors and disconnect events
client.on("error", (err: any) => {
  console.error("Error:", err);
  // TODO: custom error handling here
});

client.on("disconnect", (event: any) => {
  console.log("Disconnected:", event.reason);
});
