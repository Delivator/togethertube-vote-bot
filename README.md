# togethertube-vote-bot

## Installation

Install using npm: `npm install togethertube-vote-bot`

## Usage

### Generating sessions:

```javascript
const bot = require("togethertube-vote-bot");

bot.generatePlaySessions(1)
  .then((sessions) => {
    console.log(sessions);
    // Here you can save your generated sessions to a file
  })
  .catch((err) => {
    console.error(err);
  });
```

This will generate (or add) one session and will save it in the `sessions.json` file located in the same directory as the script.

### Adding playlist votes:

```javascript
const bot = require("togethertube-vote-bot");
const sessions = require("./sessions.json").sessions;

const room = "test"; // Room name
const options = {
  mediaServiceId: "youtube", // Media Service [youtube/dailymotion/soundcloud/vimeo]
  mediaId: "jNQXAC9IVRw" // Media ID
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