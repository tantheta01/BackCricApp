var express = require('express'),
// const cors = require('cors'),
  app = express(),
  // app.use(cors())
  port = process.env.PORT || 3000,
  bodyParser = require('body-parser');
const cors = require('cors');
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./cricAPI/cricRoutes/cricRoutes.js'); //importing route
routes(app);

app.listen(port);

console.log('vigna u returning on 5th or 6th?' + port);
