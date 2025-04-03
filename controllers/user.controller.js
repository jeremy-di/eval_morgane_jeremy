import models from '../db/db.js'
import bcrypt from 'bcrypt'
import userValidation from '../validation/user.validation.js'
import jwt from "jsonwebtoken"

async function register(req, res) {
    try {
        const { body } = req
        
        const { error } = userValidation(body).userRegistration
        
        if ( error ) {
            return res.status(401).json(error.details[0].message)
        }
        
        models.User.findOne({
            where: {
                email: body.email
            }
        })
        .then(user => {
            if(user) {
                res.status(500).json({ msg: "Email déjà utilisé" })
            } else {
                bcrypt.hash(body.password, 10)
                .then(hash => {
                    if(!hash) {
                        return res.status(500).json({ msg: 'Erreur serveur' });
                    };
            
                    delete body.password;
            
                    new models.User({
                        email: body.email,
                        password: hash
                    })
                    .save()
                    .then((user) => {
                        console.log(user);
                        res.status(201).json({ msg: 'Utilisateur crée' })
                    })
                    .catch((error) => res.status(500).json(error));
                })
                .catch((error) => console.log(error));
            }
        })

    } catch (error) {
       console.log(error)
       res.sendStatus(500) 
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;
        const { error } = userValidation(req.body).userLogin
        if ( error ) {
            return res.status(401).json(error.details[0].message)
        }
        const user = await models.User.findOne({
            where: {
                email: req.body.email
            }
        })
            if(!user) {
                return res.status(404).json({msg: "User not found"});
            }

        const match = await bcrypt.compare(password, user.password);

        if(!match) {
            return res.status(500).json({ msg: 'Erreur serveur' });
        }

        res.status(200).json({
            id: user.id,
            email: user.email,
            token: jwt.sign({
                id: user.id,
            },
            process.env.JWT_SIGN_SECRET, {
                expiresIn: '12h'
            })
        })
    } catch (error) {
        console.log(error)
        res.sendStatus(500) 
    }
}

export { register, login }