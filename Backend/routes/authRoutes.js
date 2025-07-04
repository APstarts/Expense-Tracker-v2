import { Router } from "express";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { db } from "../database/db";

const router = Router();

router.post("/login", async (req, res) => {
    try {
        const {username, password} = req.body;
        const checkUser = await db.execute("SELECT * FROM users WHERE username = ?        const user = checkUser.rows[0];", [username]);
        const user = checkUser.rows[0];
        if(!user){
            res.status(500).json({message: "User doesn't exist. Please register."});
        };
        const passwordMatch = await bcrypt.compare(password, user.password);
        if(!passwordMatch){
            res.status(500).json({message: "Incorrect password. Please try again."});
        }
        const payload = {
            id: user.id,
            user: username,
        }
        const token = jwt.sign(payload, "nokialumia", {expiresIn: "1h"});
        res.status(200).json({user: {id: user.id, username: user.username}, message: "Login successful", token,});
    } catch (error) {
        res.status(500).json({message: error});
        console.log(error);
    }
});

router.post("/register", async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        // Use parameterized query to prevent SQL injection
        await db.execute(
            "INSERT INTO users (username, password) VALUES (?, ?)", 
            [username, hashedPassword]
        );
        res.status(200).json({ message: "User created"});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export {router};