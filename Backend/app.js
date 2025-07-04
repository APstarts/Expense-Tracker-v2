import express from 'express';
import cors from 'cors';
import { PORT } from './configs/envconfig.js';
import {router as authRoutes} from './routes/authRoutes.js';
import { db } from './database/db.js';
import passport from 'passport';
import './configs/passport-config.js';

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());
app.use(passport.initialize());


app.use("/api/", authRoutes);

app.listen(PORT, (req, res) => {
    console.log(`Server is running at http://localhost:${PORT}`)
});
