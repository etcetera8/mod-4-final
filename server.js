const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'production';
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
    .then( list => {
      response.status(201).json( {id: list[0]} );
    })
    .catch( error => {
      response.status(500).json({ error });
    })
})

app.delete('/api/v1/items/:id', (request, response) => {
  database('list').where('id', request.params.id).del()
  .then(item => {
    if (item) {
      response.status(202).json(item);
    } else {
      response.status(404).json({ error: "No list item matching that id"});
    }
  })
  .catch(error => {
    response.status(500).json({ error });
  })
})

app.patch('/api/v1/items/:id', (request, response) => {
  const { id } = request.params;
  const packed = request.body;

  database('list').where('id', request.params.id).update(packed)
    .then( packed => {
      if (packed) {
        response.status(200).json({ id })
      } else {
        response.status(404).json({error: 'No item with that id'})
      }
    })
    .catch( error => {
      response.status(500).json({ error });
    })
})

app.listen(app.get('port'), () => {
  console.log(`Server is running on ${app.get('port')}`)
})

module.exports = app;
