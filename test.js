const bot = require("./index");
const fs = require("fs");

bot.generatePlaySessions(1)
  .then((sessions) => {
    main(sessions);
    console.log(sessions);
  })
  .catch(err => {
    console.error(err);
  });

function main(sessions) {
  bot.addVote("test", sessions[0], {mediaServiceId: "youtube", mediaId: "jNQXAC9IVRw"})
    .then(() => {
      console.log("Vote Added");
    })
    .catch(error => {
      console.error(error);
    });
}
