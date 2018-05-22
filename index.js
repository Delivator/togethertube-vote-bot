const got = require("got");

module.exports.generatePlaySessions = (sessionCount = 1) => {
  return new Promise((resolve, reject) => {
    let count = sessionCount;
    let sessions = [];
  
    if (sessionCount < 1) {
      reject("Session count must be 1 or more!");
    }

    let url = "https://togethertube.com/rooms/dev";

    console.log(`Generating ${count} session(s)...`);
  
    function processRequests(count) {
      if (count < 1) return;
      process.stdout.write(`${count} session(s) left.\r`)
      got(url)
        .then(res => {
          if (res.statusCode === 200) {
            let sessionCookie = res.headers["set-cookie"][0];
            let playSession = sessionCookie.split(";")[0];
            sessions.push(playSession);
            if (count === 1) {
              console.log(`Generated ${sessionCount} session(s)`);
              return resolve(sessions);
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
  });
};

module.exports.addVote = (room, playSession, data) => {
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
};
