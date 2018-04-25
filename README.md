# togethertube-vote-bot

## Installation

Clone the repo: `git clone https://github.com/Delivator/togethertube-vote-bot.git`

Navigate to the repository directory: `cd togethertube-vote-bot/`

Install the required depencies: `npm install`

## Usage

### Generating sessions:

```javascript
const bot = require("./index");

bot.generatePlaySessions(1)
  .then(() => {
    let sessions = require("./sessions.json").sessions;
    console.log(sessions);
  })
  .catch((err) => {
    console.error(err);
  });
```

This will generate (or add) one session and will save it in the `sessions.json` file located in the same directory as the script.

### Adding playlist votes:

```javascript
const bot = require("./index");
const sessions = require("./sessions.json").sessions;

const room = "test";
const options = {
  mediaServiceId: "youtube",
  mediaId: "jNQXAC9IVRw"
};

bot.addVote(room, sessions[0], options)
  .then(() => {
    console.log("Vote Added");
  })
  .catch((error) => {
    console.error(error);
  });
```

This will add one vote to the youtube video with the id `jNQXAC9IVRw` in the room named `test`.

### Using WebSocket to intertact with the chat:

```javascript
const WebSocket = require("ws");
const sessions = require("./sessions.json").sessions;

const room = "test";
const options = {
  headers: {
    "Cookie": sessions[0]
  }
};

const ws = new WebSocket(`wss://togethertube.com/websocket/rooms/${room}`, options);

ws.on("open", () => {
  ws.send('{"mid":"chatmessage","message":"Hello World!"}');
});
```

This will connect to the chat of the room `test` and sends the message `Hello World!`.