import express from 'express';
import DataBase from './db.js';
import { ObjectId } from 'mongodb';

// init app and middleware
const app = express();
app.use(express.json());
const PORT = 3000;

// db connect
let db;
DataBase.connect('bookstore', (err) => {
    if (err) {
        console.log('Not connected.');
    } else {
        console.log('Connected.');
        db = DataBase.get();
    }
});

app.listen(PORT, () => console.log(`App listening on localhost:${PORT}`)
);


// routing
app.get('/books', (req, res) => {
    const page = req.query.page || 0;
    const limit = 2;
    let books = [];
    db.collection('books')
        .find()
        .sort({ author: 1 })
        .skip(page * limit)
        .limit(limit)
        .forEach(book => books.push(book))
        .then(() => {
            res.status(200).json(books);
        }).catch(err => {
            res.status(500).json({ error: 'Could not fetch.' })
        });
});

app.get('/books/:id', (req, res) => {
    db.collection('books')
        .findOne({ _id: new ObjectId(req.params.id) })
        .then(doc => res.status(200).json(doc))
        .catch(err => res.status(500).json({ error: 'Could not fetch.' }));
});

app.post('/books', (req, res) => {
    const doc = req.body;
    db.collection('books')
        .insertOne(doc)
        .then(result => res.status(200).json(result))
        .catch(err => res.status(500).json({ error: 'Could not post.' }))
});

app.delete('/books/:id', (req, res) => {
    db.collection('books')
        .deleteOne({ _id: new ObjectId(req.params.id) })
        .then(result => res.status(200).json(result))
        .catch(err => res.status(500).json({ error: 'Could not delete.' }));
});

app.patch('/books/:id', (req, res) => {
    const update = req.body;
    db.collection('books')
        .updateOne({ _id: new ObjectId(req.params.id) }, { $set: update })
        .then(result => res.status(200).json(result))
        .catch(err => res.status(500).json({ error: 'Could not patch.' }));
});

app.post('/books/update/:id', (req, res) => {
    const update = req.body;
    db.collection('books')
        .updateOne({ _id: new ObjectId(req.params.id) }, { $push: { ganres: "programmatically added value" } })
        .then(result => res.status(200).json(result))
        .catch(err => res.status(500).json({ error: 'Could not post.' }))
});
