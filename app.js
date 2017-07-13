var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var mongoUri = 'mongodb://admin:MtOL2SqA8qCmzNzx@cluster0-shard-00-00-kaayz.mongodb.net:27017,cluster0-shard-00-01-kaayz.mongodb.net:27017,cluster0-shard-00-02-kaayz.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin';
var db = mongoose.connect(mongoUri, {
    useMongoClient: true
});

var Book = require('./model/bookModel.js');
var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

bookRouter = require('./routes/bookRoutes')(Book);

app.use('/api/books', bookRouter);

app.get('/', (req, res) => {
    res.send('Welcome to my API');
});

app.listen(port, () => {
    console.log('Gulp running on port ' + port);
});

// example
// http://localhost:8000/api/books?genre=Historical%20Fiction&author=Lev%20Nikolavich%20Tolstoy
// http://localhost:8000/api/books/5967b28e9a51582b9b6bf0b1
