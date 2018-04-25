const got = require("got");
const fs = require("fs");


module.exports.generatePlaySessions = (sessionCount = 1) => {
  return new Promise((resolve, reject) => {
    let fileName = "./sessions.json";
    let count = sessionCount;
    let sessions;
  
    if (sessionCount < 1) {
      reject("Session count must be 1 or more!");
    }
  
    try {
      sessions = require(fileName);
    } catch (error) {
      fs.writeFile(fileName, JSON.stringify({sessions: []}, null, 2), (err) => {
        if (err) reject(err);
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
              fs.writeFile(fileName, JSON.stringify(sessions, null, 2), (error) => {
                if (error) reject(error);
                console.log(`Generated ${sessionCount} session(s)`);
                resolve();
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
