// Shayan Sheikh
import { OpenDatabase } from "../Database/OpenDatabase.js";

export async function CreateResponse(req, res) {

    const id = req.session.userId
     const { question_id, body } = req.body;

    let db;

    try {
        db = await OpenDatabase();

        await db.run(
            `INSERT INTO Responses (question_id, user_id, body)
             VALUES (?, ?, ?)`,
            [question_id, id, body]
        );

        return res.status(201).json({
            message: "Response created successfully"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Unable to create response"
        });

    } finally {
        if (db) await db.close();
    }
}





