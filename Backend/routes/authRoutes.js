import { Router } from "express";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { db } from "../database/db.js";

const router = Router();

router.post("/login", async (req, res) => {
    try {
        const {username, password} = req.body;
        const checkUser = await db.execute("SELECT * FROM users WHERE username = ?",[username]);
        const user = checkUser.rows[0];
        console.log(user);
        if(!user){
           return res.status(500).json({message: "User doesn't exist. Please register."});
        };
        const passwordMatch = await bcrypt.compare(password, user.password);
        if(!passwordMatch){
           return res.status(500).json({message: "Incorrect password. Please try again."});
        }
        const payload = {
            id: user.id,
            user: username,
        }
        const token = jwt.sign(payload, "nokialumia", {expiresIn: "1h"});
        return res.status(200).json({user: {id: user.id, username: user.username}, message: "Login successful", token,});
    } catch (error) {
        console.log(error);
       return  res.status(500).json({message: error});
    }
});

router.post("/register", async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await db.execute("SELECT * FROM users WHERE username = ?", [username]);
        const user = result.rows[0];
        if(user){
            res.status(409).json({message: "User already exists"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        // Use parameterized query to prevent SQL injection
        await db.execute(
            "INSERT INTO users (username, password) VALUES (?, ?)", 
            [username, hashedPassword]
        );
        return res.status(201).json({ message: "User created"});
    } catch (err) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

export {router};