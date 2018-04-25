const bot = require("./index");
const fs = require("fs");
const WebSocket = require("ws");

if (fs.existsSync("./sessions.json")) {
  let sessions = require("./sessions.json").sessions;
  main(sessions);
} else {
  bot.generatePlaySessions(1)
  .then(() => {
    let sessions = require("./sessions.json").sessions;
    main(sessions);
  })
  .catch(err => {
    console.error(err);
  })
}

function main(sessions) {
  const ws = new WebSocket("wss://togethertube.com/websocket/rooms/test", {headers: {"Cookie": sessions[0]}});

  ws.on("open", () => {
    let stdin = process.openStdin();

    console.log("Type a message you want to send to the chat in the console.\nType EXIT or use CTRL + C to stop.")
    stdin.addListener("data", (data) => {
      let msg = data.toString().trim();
      if (msg === "EXIT") {
        ws.close();
        stdin.end();
      } else {
        ws.send(`{"mid":"chatmessage","message":"${msg}"}`);
        console.log(`> ${msg}`);
      }
    });
  });
}