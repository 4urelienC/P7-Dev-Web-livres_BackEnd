const Prod = require('../models/Prod');
const fs = require('fs');

exports.createProd = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Prod({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });

  book.save()
  .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
  .catch(error => {res.status(400).json({ error })})
};

exports.modifyProd = (req, res, next) => {
  const bookObject = req.file ? {
    ...JSON.parse(req.body.book),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete bookObject._userId;
  Prod.findOne({_id: req.params.id})
    .then((book) => {
      if(book.userId != req.auth.userId){
        res.status(401).json({ message: 'Non-Autorisé'})
      } else {
        Prod.updateOne({ _id: req.params.id}, {...bookObject, _id: req.params.id})
        .then(() => res.status(200).json({message: 'Objet modifié !'}))
        .catch(error => res.status(401).json({error}));
      }
    })
    .catch((error) => {
      res.status(400).json({error});
    })
  };

  exports.deleteProd = (req, res, next) => {
    Prod.findOne({ _id: req.params.id })
      .then((book) => {
        if (book.userId != req.auth.userId) {
          res.status(401).json({ message: 'Non-autorisé' });
        } else {
          const filename = book.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => {
            Prod.deleteOne({ _id: req.params.id })
              .then(() => {res.status(200).json({ message: 'Objet supprimé !' })})
              .catch((error) => res.status(400).json({ error }));
          });
        }
      })
      .catch((error) => res.status(400).json({ error }));
  };

exports.getOneProd = (req, res, next) => {
    Prod.findOne({ _id: req.params.id })
    .then(prod => res.status(200).json(prod))
    .catch(error => res.status(404).json({ error }));
  };

exports.getAllProd = (req, res, next) => {
    Prod.find()
    .then(prods => res.status(200).json(prods))
    .catch(error => res.status(400).json({ error }));
  };