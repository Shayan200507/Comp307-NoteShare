import { OpenDatabase } from "../Database/OpenDatabase.js";

export async function getAllNotes(req, res) {
    let db;

    try {
        db = await OpenDatabase();
        const notes = await db.all(`
            SELECT n.id, n.user_id, n.course_id, n.title, n.description,
                   n.filename, n.uploaded_at, c.course_code
            FROM Note n
            LEFT JOIN Course c ON c.id = n.course_id
            ORDER BY n.uploaded_at DESC, n.id DESC;
        `);

        return res.status(200).json(notes);
    } catch {
        return res.status(500).json({ error: "Unable to retrieve notes" });
    } finally {
        if (db) await db.close();
    }
}
