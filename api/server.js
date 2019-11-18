var express = require('express');
var app = express();
var mongoose = require('mongoose');
var databaseUrl = process.env.MONGO_DATABASE || "mongodb://localhost/myapp"


// reqest bodyをパースする
app.use(express.json())

mongoose.connect(databaseUrl, { useNewUrlParser: true });

const router = require('./routers')
app.use('/api', router)

app.listen(8080);
