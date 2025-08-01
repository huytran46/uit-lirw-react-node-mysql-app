const express = require('express');
const booksController = require('../controllers/BooksController');
const authorsController = require('../controllers/AuthorsController');
const S3Controller = require('../controllers/S3Controller');

const router = express.Router();

router.get('/authors', authorsController.get);
router.post('/authors', authorsController.create);
router.put('/authors/:id', authorsController.update);
router.delete('/authors/:id', authorsController.delete);

router.get('/books', booksController.get);
router.post('/books', booksController.create);
router.put('/books/:id', booksController.update);
router.delete('/books/:id', booksController.delete);

router.get('/s3', S3Controller.getSignedImageUrl);

module.exports = router;