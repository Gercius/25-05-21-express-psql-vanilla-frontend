import express from "express";
import cors from "cors";
import path from "node:path";
import { db, initializeDatabase } from "./database.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "../frontend")));

// gauna users
app.get("/api/users", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM users");
        res.status(200).json({ users: result.rows });
    } catch (err) {
        console.error("Error getting users:", err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// sukuria user
app.post("/api/users", async (req, res) => {
    const { name, surname, birth_date } = req.body;
    if (!name || !surname || !birth_date) {
        return res.status(400).json({ error: "Name, surname and birth_date are required" });
    }
    try {
        await db.query("INSERT INTO users (name, surname, birth_date) VALUES ($1, $2, $3)", [
            name,
            surname,
            birth_date,
        ]);
        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        console.error("Error creating user:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// istrina user
app.delete("/api/users/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query("DELETE FROM users WHERE id = $1", [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        console.error("Error deleting user:", err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// paleidzia database ir express serveri
initializeDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.log(err.message);
    });
