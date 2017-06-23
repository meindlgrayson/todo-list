const express = require('express');
const mustache = require('mustache-express');
const bodyParser = require('body-parser');

var application = express();
application.engine('mustache', mustache());

application.set('views', './views');
application.set('view engine', 'mustache');

application.use(bodyParser.urlencoded());

var item = [];
var todo = {
  msg: '',
  completed: false,
  id: 0
};

var completeItem = [];
var incompleteItem = [];

let renderModel = {};

var checkComplete = function(){
  if (todo.completed){
    return todo;
  } 
}

var checkIncomplete = function(){
  if (!todo.completed){
    return todo;
  } 
}

var buildComplete = function(comleteOne, completeTwo){

  incompleteItem = item.filter(checkIncomplete);

  completeItem = item.filter(checkComplete);
}


application.get('/', (request, response) => {
  
  buildComplete(checkIncomplete, checkComplete);

  response.render('list');
})

application.post('/', (request, response) => {
  console.log(todo, 'todo');
  console.log(item, 'item array');
  todo = {
    msg: request.body.todo,
    completed: false,
    id: item.length
  }
  item.push(todo);
  buildComplete(checkIncomplete, checkComplete);

  renderModel = {
    item: item,
    completed: completeItem,
    incomplete: incompleteItem
  }
  console.log(completeItem);
  console.log(incompleteItem);
  response.render('list', renderModel);
})

application.post('/:id', (request, response) => {
  console.log(request.params.id)
  for(i = 0; i < item.length; i++) {
    if(item[i].id == request.params.id) {
      item[i].completed = true;
      console.log(item[i]);
    }
  }
  buildComplete(checkIncomplete, checkComplete);
  renderModel = {
    item: item,
    completed: completeItem,
    incomplete: incompleteItem
  }
  response.render('list', renderModel);
})

application.listen(3000);