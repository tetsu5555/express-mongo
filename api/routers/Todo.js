var Todo = require('../models/Todo');
var express = require('express');
const router = express.Router()

router.get('/', function(req, res) {
  Todo.find().exec((err, todos) => {
      if (err) {
        res.send(err)
        return
      }
      res.json(todos)
  })
});

router.post('/', function(req, res) {
  const todo = new Todo()

  todo.title = req.body.title
  todo.done = false
  todo.save((err, doc) => {
      if (err) {
          return res.send(err);
      }
      res.json(doc)
  })
})

module.exports = router
