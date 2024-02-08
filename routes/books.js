const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const booksCtrl = require('../controllers/books');

router.get('/bestrating', booksCtrl.getBestProd);
router.post('/:id/rating', auth, booksCtrl.rateBook);

router.post('/', auth, multer.upload, multer.transformImage, booksCtrl.createProd);
router.put('/:id', auth, multer.upload, multer.transformImage, booksCtrl.modifyProd);
router.delete('/:id', auth, booksCtrl.deleteProd);
router.get('/:id', booksCtrl.getOneProd);
router.get('/', booksCtrl.getAllProd);





module.exports = router;
