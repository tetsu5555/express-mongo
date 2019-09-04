var express = require('express');
var app = express();
var mongoose = require('mongoose');
var databaseUrl = process.env.MONGO_DATABASE || "mongodb://localhost/myapp"
var Todo = require('./models').Todo;

mongoose.connect(databaseUrl, { useNewUrlParser: true });

app.get('/api/todos', function(req, res) {
    Todo.find().exec((err, todos) => {
        if (err) {
            res.send(err)
            return
        }
        res.json(todos)
    })
});

app.listen(8080);
