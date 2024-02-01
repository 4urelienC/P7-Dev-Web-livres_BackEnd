const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => {
                    console.error('Error saving user:', error);
                    res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur' });
                });
        })
        .catch(error => {
            console.error('Error hashing password:', error);
            res.status(500).json({ error: 'Erreur lors du hachage du mot de passe' });
        });
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => {
                    console.error('Error comparing passwords:', error);
                    res.status(500).json({ error: 'Erreur lors de la comparaison des mots de passe' });
                });
        })
        .catch(error => {
            console.error('Error finding user:', error);
            res.status(500).json({ error: 'Erreur lors de la recherche de l\'utilisateur' });
        });
};