const bot = require("./index");
const WebSocket = require("ws");

bot.generatePlaySessions(1)
  .then((sessions) => {
    main(sessions);
  })
  .catch(err => {
    console.error(err);
  });

function main(sessions) {
  const ws = new WebSocket("wss://togethertube.com/websocket/rooms/test", {headers: {"Cookie": sessions[0]}});

  ws.on("open", () => {
    let stdin = process.openStdin();

    console.log("Type the message you want to send to the chat in the console.\nType EXIT or use CTRL + C to stop.")
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