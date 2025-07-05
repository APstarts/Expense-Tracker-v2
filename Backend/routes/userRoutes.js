import {Router} from 'express';
import passport from 'passport';

const userRoute = Router();

userRoute.use(passport.authenticate("jwt", {session: false}));

userRoute.get("/dashboard", (req, res) => {
    res.json({message: "Dashboard access granted!", user: req.user});
});

export {userRoute};