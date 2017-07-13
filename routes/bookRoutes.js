var express = require('express');
var mongoose = require('mongoose');

var routes = (Book) => {
    var bookRouter = express.Router();

    bookRouter.route('/')
        .post((req, res) => {
            var book = new Book(req.body);

            book.save();
            
            res.status(201).send(book);
        })
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

    bookRouter.route('/:id')
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
            });
        })
        .put((req, res) => {
            Book.findById(req.params.id, (err, book) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    book.title = req.body.title;
                    book.author = req.body.author;
                    book.genre = req.body.genre;
                    book.read = req.body.read;

                    book.save();
                    res.json(book);
                }
            });
        });

    return bookRouter;
};

module.exports = routes;