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
  var queryParams = req.query;
  var filteredTodos = todos;

  if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
    filteredTodos = _.where(filteredTodos, {completed: true});
  } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
    filteredTodos = _.where(filteredTodos, {completed: false})
  }
  res.status(200).json(filteredTodos);
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
  //set body.description to be trimmed value THIS IS FOR SPACES AT THE BEGINNING AND END OF STRING
  body.description = body.description.trim();
  body.id = todoNextId++;
  todos.push(body);
  res.json(body);
  console.log('description: ' + body.description);
  res.json(body);
})


app.delete('/todos/:id', function(req, res, next) {
  var todoId = parseInt(req.params.id, 10);
  var matchedTodo = _.findWhere(todos, {id: todoId})

  if (!matchedTodo) {
    res.status(404).json({"error": "no todo found with that id"});
  } else {
    todos = _.without(todos, matchedTodo)
    res.json(matchedTodo)
  }
});


app.put('/todos/:id', function(req, res, next) {
  //body will only allow keys that are specified to be posted
  var todoId = parseInt(req.params.id, 10);
  var matchedTodo = _.findWhere(todos, {id: todoId})
  var body = _.pick(req.body, 'description', 'completed');
  var validAttributes = {};

  if(!matchedTodo) {
    return res.status(404).send();
  }

  if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)) { //this would run only if boolean and completed exists
    validAttributes.completed = body.completed;
  } else if(body.hasOwnProperty('completed')){
    //bad
    return res.status(400).send();
  }

  if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
    validAttributes.description = body.description;
  } else if (body.hasOwnProperty('description')){
    return res.status(400).send();
  }

  _.extend(matchedTodo, validAttributes);
  res.json(matchedTodo)
})
















app.listen(PORT, function() {
  console.log("Listening on port " + PORT + ".");
})
