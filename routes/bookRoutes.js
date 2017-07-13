var express = require('express');
var mongoose = require('mongoose');
var promise = require('promise');
mongoose.Promise = promise;

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

    bookRouter.use('/:id', (req, res, next) => {
        Book.findById(req.params.id, (err, book) => {
            if (err) {
                res.status(500).send(err);
            } else if (book) {
                req.found = book;
                next();
            } else {
                res.status(404).send('Book not found');
            }
        });        
    });

    bookRouter.route('/:id')
        .get((req, res) => {
            res.json(req.found);
        })
        .put((req, res) => {
            req.found.title = req.body.title;
            req.found.author = req.body.author;
            req.found.genre = req.body.genre;
            req.found.read = req.body.read;

            req.found.save((err) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.json(req.found);
                }
            });
        })
        .patch((req, res) => {
            if (req.found._id) {
                delete req.body._id;
            }

            for (var prop in req.body) {
                console.log('json property ' + prop);
                req.found[prop] = req.body[prop];
            }

            req.found.save((err) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.json(req.found);
                }
            });
        });

    return bookRouter;
};

module.exports = routes;
