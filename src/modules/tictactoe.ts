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

type TicTacToeBoard = ("X" | "O" | null)[];

type Game = {
  id: string;
  player1: string;
  player2: string | null;
  board: TicTacToeBoard;
};

function renderBoard(board: TicTacToeBoard) {
  return `${board[0] || 1} | ${board[1] || 2} | ${board[2] || 3}\n${
    board[3] || 4
  } | ${board[4] || 5} | ${board[5] || 6}\n${board[6] || 7} | ${
    board[7] || 8
  } | ${board[8] || 9}`;
}

function getBoardState(board: TicTacToeBoard) {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  if (board.includes(null)) {
    return "In Progress";
  } else {
    return "Draw";
  }
}
const games: Game[] = [];

export default {
  fn: (ev) => {
    if (ev.message.startsWith("ttt ")) {
      const cmd = ev.message.slice(4).split(" ");
      if (cmd[0] === "create") {
        let gameId = genId();
        while (games.find((x) => x.id === gameId)) gameId = genId();
        games.push({
          id: gameId,
          board: Array(9).fill(null),
          player1: ev.nick,
          player2: null
        });
        ev.reply(
          template(
            "TicTacToe",
            ev.nick,
            `Game created with ID ${gameId} ! Ask the Player 2 to run d.ttt join ${gameId}`
          )
        );
      } else if (cmd[0] === "join") {
        const gameId = cmd[1];
        const game = games.find((x) => x.id === gameId);
        if (!gameId || !game) {
          ev.reply(template("TicTacToe", ev.nick, `That game does not exist.`));
          return;
        }
        if (game.player1 === ev.nick) {
          ev.reply(
            template(
              "TicTacToe",
              ev.nick,
              "You can't join your own game. If you're lonely just ask NeoRoll"
            )
          );
          return;
        }
        if (game.player2) {
          ev.reply(
            template("TicTacToe", ev.nick, "The game already has 2 players.")
          );
          return;
        }
        game.player2 = ev.nick;
        renderBoard(game.board)
          .split("\n")
          .forEach((line) => {
            ev.reply(template("TicTacToe", game.player1, line));
          });
        ev.reply(
          template(
            "TicTacToe",
            game.player1,
            `Pick a choice by running d.ttt play ${game.id} {choice}`
          )
        );
      } else if (cmd[0] === "play") {
        {
          const gameId = cmd[1];
          const game = games.find((x) => x.id === gameId);
          if (!gameId || !game) {
            ev.reply(
              template(
                "TicTacToe",
                ev.nick,
                `That game does not exist or has completed.`
              )
            );
            return;
          }
          if (!game.player2) {
            ev.reply(
              template("TicTacToe", ev.nick, "The game has not started yet.")
            );
            return;
          }
          if (game.player1 !== ev.nick && game.player2 !== ev.nick) {
            ev.reply(
              template("TicTacToe", ev.nick, "You are not in the game.")
            );
            return;
          }
          if (
            (game.board.filter((x) => x !== null).length % 2 === 0 &&
              ev.nick !== game.player1) ||
            (game.board.filter((x) => x !== null).length % 2 === 1 &&
              ev.nick !== game.player2)
          ) {
            ev.reply(template("TicTacToe", ev.nick, "It is not your turn."));
            return;
          }
          const num = Number(cmd[2]);
          if (Number.isNaN(num) || num > 9 || num < 1) {
            ev.reply(template("TicTacToe", ev.nick, "Invalid grid selection."));
            return;
          }
          if (game.board[num - 1]) {
            ev.reply(
              template("TicTacToe", ev.nick, "Grid space already taken.")
            );
            return;
          }
          const letter =
            game.board.filter((x) => x !== null).length % 2 === 0 ? "X" : "O";
          game.board[num - 1] = letter;
          const otherPlayerNick = letter === "X" ? game.player2 : game.player1;
          renderBoard(game.board)
            .split("\n")
            .forEach((line) => {
              ev.reply(template("TicTacToe", otherPlayerNick, line));
            });
          const boardState = getBoardState(game.board);
          if (boardState === "In Progress") {
            ev.reply(
              template(
                "TicTacToe",
                otherPlayerNick,
                `Pick a choice by running d.ttt play ${game.id} {choice}`
              )
            );
          } else if (boardState === "Draw") {
            ev.reply(template("TicTacToe", otherPlayerNick, `It's a draw!`));
            games.splice(
              games.findIndex((x) => x.id === game.id),
              1
            );
          } else {
            ev.reply(
              template(
                "TicTacToe",
                otherPlayerNick,
                `${
                  boardState === "X" ? game.player1 : game.player2
                } (${boardState}) won!`
              )
            );
            games.splice(
              games.findIndex((x) => x.id === game.id),
              1
            );
          }
        }
      }
    }
  }
} satisfies Module;
