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
        var query = req.query;
        console.log('query: ' + JSON.stringify(query));

        // Add a validator before going to the db

        Book.find(query, (err, books) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json(books);
            }
        })
    });

bookRouter.route('/books/:id')
    .get((req, res) => {
        console.log(JSON.stringify(req.params));
        var _id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(_id)) {
            var response = {message: 'Invalid param _id = ' + _id, error: '400' };
            res.status(400).json(response);
        }

        Book.findById(_id, (err, book) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json(book);
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

// example
// http://localhost:8000/api/books?genre=Historical%20Fiction&author=Lev%20Nikolavich%20Tolstoy
// http://localhost:8000/api/books/5967b28e9a51582b9b6bf0b1
