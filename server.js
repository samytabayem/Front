//Install express server
const express = require('express');
const path = require('path');
const cors = require('cors');

const port = process.env.PORT || 5192;

const app = express();
app.use(cors());

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist'));

app.get('/*', function (req, res) {

  res.sendFile(path.join(__dirname + '/dist/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(port, () => {
  console.log(`🔥 Server Listening on localhost:${port} 🔥`)
});
