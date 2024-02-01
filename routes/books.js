const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const booksCtrl = require('../controllers/books');

router.post('/', auth, multer, booksCtrl.createProd);
router.put('/:id', auth, multer, booksCtrl.modifyProd);
router.delete('/:id', auth, booksCtrl.deleteProd);
router.get('/:id', booksCtrl.getOneProd);
router.get('/', booksCtrl.getAllProd);

module.exports = router;

// router.post('/', auth, booksCtrl.createProd);