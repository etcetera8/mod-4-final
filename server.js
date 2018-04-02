const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (request, response) => {

})

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), () => {
  console.log(`Server is running on ${app.get('port')}`)
})