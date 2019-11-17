var express = require('express');
var app = express();
var mongoose = require('mongoose');
var databaseUrl = process.env.MONGO_DATABASE || "mongodb://localhost/myapp"
var Todo = require('./models').Todo;

// reqest bodyをパースする
app.use(express.json())

mongoose.connect(databaseUrl, { useNewUrlParser: true });

app.get('/todos', function(req, res) {
    Todo.find().exec((err, todos) => {
        if (err) {
            res.send(err)
            return
        }
        res.json(todos)
    })
});

app.post('/todos', function(req, res) {
    const todo = new Todo()
    console.log(req)
    console.log(req.body)

    todo.title = req.body.title
    todo.done = false
    todo.save((err, doc) => {
        if (err) {
            return res.send(err);
        }
        res.json(doc)
    })
})

app.listen(8080);
