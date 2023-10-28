import { defineConfig } from "./src/configTypes";
import RandomModule from "./src/modules/random";
import EightBallModule from "./src/modules/eightball";
import EvalModule from "./src/modules/eval";
import FigletModule from "./src/modules/figlet";
import SquawkModule from "./src/modules/squawk";
import TicTacToe from "./src/modules/tictactoe";
import BombParty from "./src/modules/bombparty";
import AnirudhGPT from "./src/modules/anirudhgpt";
import BoredModule from "./src/modules/bored";
export default defineConfig({
  /* Edit this configuration! */
  server: "100.97.208.126",
  port: 6668,
  nick: "D5H[bot]",
  userName: "D5H",
  realName: "D5H by NeoRoll",
  channels: ["#main", "#bots"],
  alwaysModules: [SquawkModule],
  normalModules: [
    RandomModule,
    EightBallModule,
    EvalModule,
    FigletModule,
    TicTacToe,
    BombParty,
    BoredModule,
    AnirudhGPT
  ],
  opts: {
    ANIRUDHGPT_TOKEN: "sk-default"
  }
});
