const Prod = require('../models/Prod');

exports.createProd = (req, res, next) => {
    delete req.body._id;
    const prod = new Prod({
      ...req.body
    });
    prod.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
  };

exports.modifyProd = (req, res, next) => {
    Prod.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
  };

exports.deleteProd = (req, res, next) => {
    Prod.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
    .catch(error => res.status(400).json({ error }));
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