const got = require("got");
const fs = require("fs");

function generatePlaySessions(sessionCount = 1) {
  let fileName = "./sessions.json";
  let count = sessionCount;
  let sessions;

  if (sessionCount < 1) {
    return console.log("Session count must be 1 or more!")
  }

  try {
    sessions = require(fileName);
  } catch (error) {
    fs.writeFile(fileName, JSON.stringify({sessions: []}, null, 2), (err) => {
      if (err) return console.error(err);
      console.log("Session file has been created!")
      sessions = require(fileName);
    });
  }

  let url = "https://togethertube.com/rooms/dev";

  function processRequests(count) {
    if (count < 1) return;
    got(url)
      .then(res => {
        if (res.statusCode === 200) {
          let sessionCookie = res.headers["set-cookie"][0];
          let playSession = sessionCookie.split(";")[0];
          sessions.sessions.push(playSession);
          if (count === 1) {
            console.log(`Generated ${sessionCount} session(s)`)
            fs.writeFile(fileName, JSON.stringify(sessions, null, 2), (error) => {
              if (error) return console.error(error);
            });
          }
        }
        processRequests(count -= 1);
      })
      .catch(err => {
        console.log(err);
        processRequests(count -= 1);
      });
  }
  processRequests(count);
}

function addVote(room, playSession, data) {
  return new Promise((resolve, reject) => {
    let url = `https://togethertube.com/api/v1/rooms/${room}/playlist/votes`;
    let options = {
      json: true,
      headers: {
        "Cookie": playSession
      },
      body: data
    };
    got.post(url, options)
      .then(res => {
        if (res.statusCode === 201) {
          resolve();
        } else {
          reject(res.statusCode);
        }
      })
      .catch(err => {
        reject(err);
      })
  });
}

// let sessions = require("./sessions.json").sessions;

// function addVotes(x) {
//   if (x < 1) return;
//   if (x > sessions.length) return console.log(`sessions.json file only includes ${sessions.length} sessions but ${x} where requested`);
//   addVote("test", sessions[x-1], {
//     mediaServiceId: "youtube",
//     mediaId: "TQG7m1BFeRc"
//   })
//   .then(() => {
//     console.log("Vote added!");
//     addVotes(x-1);
//   })
//   .catch(err => {
//     console.error(err);
//     addVotes(x-1)
//   });
// }
// addVotes(15);
