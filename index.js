const express = require('express');
const app = express();
const Frontly = require('frontly');
const db = require('ognom.db');
app.use(Frontly.middleware);
app.use(express.urlencoded({
  extended: true
}));
(async () => {
  var data = await db.get('*');
  if (!data.responses) {
    await db.set('responses', []);
  }
})(); 
app.use(express.static(__dirname + '/www'));
app.get('/', (req, res) => {
  res.sendFileFrontly(__dirname + '/www/lel.html', {
    params: {
      'Add': '<!-- Comment -->'
    }
  });
});

app.get('/messages', async (req, res) => {
  var data = await db.get('responses');
  res.send(JSON.stringify(data));
});

app.get('/messages/clear', async (req, res) => {
  await db.set('responses', []);
  res.send(JSON.stringify([]));
});

app.post('/', async (req, res) => {
  await db.push('responses', {
    name: req.body.name,
    email: req.body.email,
    message: req.body.message
  });
  res.sendFileFrontly(__dirname + '/www/lel.html', {
    params: {
      'Add': `<div class="d-card">
          <h3>Your message has been sent!</h3>
        </div>`
    }
  });
});

app.listen(8080, () => {
  console.log('Listening on *:8080');
});