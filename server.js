var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.send('Todo API Root');
});

app.get('/todos', function(req, res, next) {
  res.status(200).json(todos);
})
app.get('/todos/:id', function(req, res, next) {
  var todoId = parseInt(req.params.id, 10);
  var matchedTodo = _.findWhere(todos, {id: todoId})
  if (matchedTodo) {
    res.json(matchedTodo)
  } else {
    res.status(404).send('Not Found');
  }
})



app.post('/todos', function(req, res, next) {

  //body will only allow keys that are specified to be posted
  var body = _.pick(req.body, 'description', 'completed');
  //bad request
  if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
    return res.status(400).send();
  }
  //set body.description to be trimmed value
  body.description = body.description.trim();

  body.id = todoNextId++;

  todos.push(body);
  res.json(body);
  console.log('description: ' + body.description);

  res.json(body);
})



















app.listen(PORT, function() {
  console.log("Listening on port " + PORT + ".");
})
