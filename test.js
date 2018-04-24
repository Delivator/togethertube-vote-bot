const bot = require("./index");
const fs = require("fs");

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
  bot.addVote("vultus", sessions[0], {mediaServiceId: "youtube", mediaId: "TQG7m1BFeRc"})
  .then(() => {
    console.log("Vote Added");
  })
  .catch(error => {
    console.error(error);
  });
}

