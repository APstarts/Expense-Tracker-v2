import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../database/db.js";
import passport from "passport";

const router = Router();

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const checkUser = await db.execute(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    const user = checkUser.rows[0];
    console.log(user);
    if (!user) {
      return res
        .status(500)
        .json({ message: "User doesn't exist. Please register." });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(500)
        .json({ message: "Incorrect password. Please try again." });
    }
    const payload = {
      id: user.id,
      user: user.username,
    };
    const token = jwt.sign(payload, "nokialumia", { expiresIn: "1h" });
    return res.status(200).json({
      user: { id: user.id, username: user.username },
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
});

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await db.execute("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    const user = result.rows[0];
    if (user) {
      res.status(409).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // Use parameterized query to prevent SQL injection
    await db.execute("INSERT INTO users (username, password) VALUES (?, ?)", [
      username,
      hashedPassword,
    ]);
    return res.status(201).json({ message: "User created" });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post(
  "/expenses",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { description, amount, date, category } = req.body;
    const userId = req.user.id;

    if (!description || !amount || !date || !category) {
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      // 1. Check if the category already exists for the user
      const existing = await db.execute(
        "SELECT id FROM categories WHERE user_id = ? AND name = ?",
        [userId, category.trim()]
      );

      let categoryId;

      if (existing.rows.length > 0) {
        // Category already exists
        categoryId = existing.rows[0].id;
      } else {
        // Insert new category
        const insertCategory = await db.execute(
          "INSERT INTO categories (user_id, name) VALUES (?, ?)",
          [userId, category.trim()]
        );
        categoryId = insertCategory.lastInsertRowid;
      }

      // 2. Insert the expense
      await db.execute(
        "INSERT INTO expenses (user_id, description, amount, expense_date, category_id) VALUES (?, ?, ?, ?, ?)",
        [userId, description.trim(), amount, date, categoryId]
      );

      return res.status(201).json({ message: "Expense added successfully" });
    } catch (error) {
      console.error("Add expense error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.get(
  "/categories",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const userId = req.user.id;
    try {
      const result = await db.execute(
        "SELECT * FROM categories WHERE user_id = ?",
        [userId]
      );
      return res.status(200).json({ categories: result.rows });
    } catch (error) {}
  }
);

router.get(
  "/getchartdata",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const userId = req.user.id;
    try {
      const result = await db.execute(
        `SELECT 
  expenses.id, 
  expenses.description, 
  expenses.amount, 
  expenses.expense_date, 
  categories.name AS category 
FROM 
  expenses 
JOIN 
  categories 
ON 
  expenses.category_id = categories.id 
WHERE 
  expenses.user_id = ?
`,
        [userId]
      );
      console.log(result.rows);
      return res.status(200).json({message: "Chart data fetched successfully", chartData: result.rows} );
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: error});
    }
  }
);

export { router };
