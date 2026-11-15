import bcrypt from "bcrypt";
import { OpenDatabase } from "../Database/OpenDatabase.js";

export async function Signup(req, res) {
    const { email, password } = req.body ?? {};

    if (typeof email !== "string" || !email.trim() || typeof password !== "string" || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    let db;

    try {
        db = await OpenDatabase();

        const existingUser = await db.get(
            "SELECT id FROM User WHERE email = ?",
            [email]
        );

        if (existingUser) {
            return res.status(409).json({ message: "An account with this email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.run(
            "INSERT INTO User (email, password) VALUES (?, ?)",
            [email, hashedPassword]
        );

        req.session.userId = result.lastID;
        return res.status(201).json({ message: "Account created successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Unable to create account" });
    } finally {
        if (db) {
            await db.close();
        }
    }
}
   