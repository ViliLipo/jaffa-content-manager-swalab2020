const express = require('express');
const bodyParser = require('body-parser');
const contentRouter = require('./controllers/content.js');
const database = require('./models/database.js');
const { mqSend, registerReceiver } = require('./interservice/machinequeue.js');
const contentEventReceiver = require('./interservice/contentEventReceiver.js');

const contentEventQueue = 'content_event_queue';

registerReceiver(contentEventQueue, contentEventReceiver);

const app = express();
app.use(bodyParser.json());
app.use('/api/content', contentRouter);
const port = 3001;


database
  .authenticate()
  .then(() => {
    console.log('Connection to database has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
setTimeout(() => {
  mqSend(JSON.stringify({ type: 'comment', id: '1', passed: true }), contentEventQueue);
},
1000, 'foo');
