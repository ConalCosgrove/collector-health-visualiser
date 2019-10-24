const express = require('express');
const request = require('superagent');
const app = express();
const cors = require('cors');


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