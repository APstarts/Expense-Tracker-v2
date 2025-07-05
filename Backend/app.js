import express from 'express';
import cors from 'cors';
import { PORT } from './configs/envconfig.js';
import {router as authRoutes} from './routes/authRoutes.js';
import passport from 'passport';
import './configs/passport-config.js';
import bodyParser from 'body-parser';
import { userRoute } from './routes/userRoutes.js';

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(passport.initialize());


app.use("/api/", authRoutes);
app.use("/api/", userRoute);

app.listen(PORT, (req, res) => {
    console.log(`Server is running at http://localhost:${PORT}`)
});
