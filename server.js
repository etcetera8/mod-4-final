const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());
app.use(express.static('public'));
app.get('/', (request, response) => {})
app.set('port', process.env.PORT || 3000);

app.get('/api/v1/items', (request, response) => {
  database('list').select()
    .then( items => {
      response.status(200).json(items);
    })
    .catch( error => {
      response.status(500).json({ error });
    })
})

app.post('/api/v1/items', (request, response ) => {
  const item = request.body;

  for (let requiredParam of ['item']) {
    if (!item[requiredParam]) {
      return response.status(422)
        .send(({error: `Expected format: {item: <String>}. You're missing a ${requiredParam} property.`}));
    }
  }

  database('list').insert(item, 'id')
    .then( item => {
      response.status(201).json({ id: item[0]});
    })
    .catch( error => {
      response.status(500).json({ error });
    })
})

app.listen(app.get('port'), () => {
  console.log(`Server is running on ${app.get('port')}`)
})