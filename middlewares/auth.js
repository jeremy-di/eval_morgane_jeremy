import passport from "passport";
import passportJWT from 'passport-jwt'
import models from '../db/db.js'

passport.use(
    new passportJWT.Strategy({
        jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: '2thrtdjgjt2hjhkprtiy3hmprtmythemjiruf6hrtaqwxvklptje35htps78'
    },
        function(jwtPayLoad, done) {
            return models.User.findByPk(jwtPayLoad.id)
            .then(user => {
                return done(null, user)
            })
            .catch(error => {
                return done(error)
            })
        }
    )
)