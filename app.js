var express = require('express');
var mongoose = require('mongoose');

var mongoUri = 'mongodb://admin:MtOL2SqA8qCmzNzx@cluster0-shard-00-00-kaayz.mongodb.net:27017,cluster0-shard-00-01-kaayz.mongodb.net:27017,cluster0-shard-00-02-kaayz.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin';
var db = mongoose.connect(mongoUri, {
    useMongoClient: true
});

var Book = require('./model/bookModel.js');

var app = express();

var port = process.env.PORT || 3000;

var bookRouter = express.Router();

bookRouter.route('/books')
    .get((req, res) => {
        Book.find((err, books) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json(books);
            }
        })
    });

app.use('/api', bookRouter);

app.get('/', (req, res) => {
    res.send('Welcome to my API');
});

app.listen(port, () => {
    console.log('Gulp running on port ' + port);
});