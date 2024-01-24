const express = require('express');
const router = express.Router();

const booksCtrl = require('../controllers/books');

router.post('/', booksCtrl.createProd);
router.put('/:id', booksCtrl.modifyProd);
router.delete('/:id', booksCtrl.deleteProd);
router.get('/:id', booksCtrl.getOneProd);
router.get('/', booksCtrl.getAllProd);

module.exports = router;