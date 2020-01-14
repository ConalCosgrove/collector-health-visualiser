const express = require('express');
const request = require('superagent');
const app = express();
const cors = require('cors');
const RED = '\033[0;31m';
const NO_COLOUR = '\033[0m';
const GREEN = '\033[0;32m';
const YELLOW = '\033[1;33m';
let maxNameLength = 21;
const clearCollectorStatuses = (length) => !length || length <= 0 ? 0 : clearLine(length);
const clearLine = (c) => { process.stdout.moveCursor(0,-1); process.stdout.clearLine(); clearCollectorStatuses(c - 1) };

function getColourFromStatus(status) {
  switch (status) {
    case 'Running':
      return GREEN;
    case 'Missed Heartbeat':
      return RED;
    case 'Stopped':
      return YELLOW;
    default:
      return NO_COLOUR;
  }
}

function printCollectorStatus(name, status, end) {
  const colour = getColourFromStatus(status);
  process.stdout.cursorTo(0);
  process.stdout.write(`${name}:`.padStart(21, ' ') + `\t${colour}${status}${NO_COLOUR}${end ? '':'\n'}`);
}

function print(collectors) {
  clearCollectorStatuses(collectors.length - 1);
  collectors.forEach((collector, i) => {
    printCollectorStatus(collector.name, collector.status, i === collectors.length - 1);
  });
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/collectors', (req, res) => {
  getCollectors(res);
});

app.use(express.static('public'));

function getCollectors(res) {
  request.get(`${process.env.URL}/v1/collectors?registered=true`)
  .set('Authorization', process.env.TOKEN)
  .then((resp) => {
    const collectors = resp.body.filter((collector) =>  !collector.name.includes('prd') && !collector.name.includes('Ian'));
    print(collectors);
    res.send(collectors);
  })
  .catch((err) => {
    console.log(err);
  });
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log('listening on', PORT);
});