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
    .then(() => {
      res.status(201).json({ message: 'Objet enregistré !' });
    })
    .catch(error => {
      res.status(400).json({ error });
    });
};

exports.modifyProd = (req, res, next) => {

  const bookObject = req.file ? {
    ...JSON.parse(req.body.book),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete bookObject._userId;
  Prod.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: 'Non-Autorisé' });
      } else {
        Prod.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet modifié !' }))
          .catch(error => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
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
            .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
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

exports.rateBook = (req, res, next) => {
  const userId = req.auth.userId;
  const grade = req.body.rating;

  if (!grade || grade < 0 || grade > 5) {
      return res.status(400).json({ message: 'Note invalide !' });
  }
  Prod.findOne({ _id: req.params.id })
      .then(book => {
          const userRating = book.ratings.find(rating => rating.userId === userId);
          if (userRating) {
              return res.status(400).json({ message: 'Vous avez déjà noté ce livre !' });
          }
          book.ratings.push({ userId, grade });
          const averageRating = (book.ratings.reduce((acc, rating) => acc + rating.grade, 0) / book.ratings.length).toFixed(1);
          book.averageRating = parseFloat(averageRating); 
          return book.save();
      })
      .then(book => res.status(200).json(book))
      .catch(error => res.status(500).json({ erreur: error })); 
};

exports.getBestProd = (req, res, next) => {
  Prod.find()
    .sort({ averageRating: -1 }) // Tri par note moyenne décroissante
    .limit(3) // Limite le résultat aux 3 premiers éléments
    .then(prods => res.status(200).json(prods))
    .catch(error => res.status(400).json({ error }));
};