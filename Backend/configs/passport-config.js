import passport from 'passport';
import {Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt';
import { db } from '../database/db.js';

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'nokialumia';
passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
    try {
        // console.log(jwt_payload.id);
        const result = await db.execute("SELECT * FROM users WHERE id = ?", [jwt_payload.id]);
        const user = result.rows[0];
        if(!user){
            return done(null, false);
        } else {
            return done(null, user);
        }
    } catch (error) {
        return done(error, false);
    }
}));