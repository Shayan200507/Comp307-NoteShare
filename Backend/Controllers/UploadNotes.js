import { OpenDatabase } from "../Database/OpenDatabase.js";



export async function uploadNote(req, res) {
    const userId = req.session.userId;
    const { courseId, title, description } = req.body;
    const filename = req.file.filename;

    let db;

    try {
        db = await OpenDatabase();

        await db.run(`
            INSERT INTO Note
            (user_id, course_id, title, description, filename)
            VALUES (?, ?, ?, ?, ?);
        `, [userId, courseId, title, description, filename]);

        return res.status(201).json({
            message: "Note uploaded successfully"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Internal server error"
        });

    } finally {
        if (db) {
            await db.close();
        }
    }
}

     

