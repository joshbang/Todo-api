var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [
  {
    id: 1,
    description: "grocery shopping",
    completed: false
  },
  {
    id: 2,
    description: "gym",
    completed: false
  },
  {
    id: 3,
    description: "School",
    completed: true
  }
]
app.get('/', function(req, res) {
  res.send('Todo API Root');
});

app.get('/todos', function(req, res, next) {
  res.status(200).json(todos);
})
app.get('/todos/:id', function(req, res, next) {
  var todoId = parseInt(req.params.id, 10);
  var matchedTodo;

  todos.forEach(function(todo) {
    if(todoId === todo.id) {
      matchedTodo = todo;
    }
  });
  if (matchedTodo) {
    res.json(matchedTodo)
  } else {
    res.status(404).send('Not Found');
  }
})
app.listen(PORT, function() {
  console.log("Listening on port " + PORT + ".");
})
