// Shayan Sheikh
import { OpenDatabase } from "../Database/OpenDatabase.js";

export async function getUserNotes(req, res) {
    let db;
    const id = req.session.userId

    try {
        db = await OpenDatabase();
        const notes = await db.all(`
            SELECT n.id, n.user_id, n.course_id, n.title, n.description,
                   n.filename, n.uploaded_at, c.course_code
            FROM Note n
            LEFT JOIN Course c ON c.id = n.course_id
            WHERE n.user_id = ?
            ORDER BY n.uploaded_at DESC, n.id DESC
            ;
        `, [id]);

        return res.status(200).json(notes);
    } catch {
        return res.status(500).json({ error: "Unable to retrieve notes" });
    } finally {
        if (db) await db.close();
    }
}
