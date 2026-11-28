import { OpenDatabase } from "../Database/OpenDatabase.js";

export async function getUserNotifications(req, res) {
    const userId = req.session.userId;


    let db;
    try {
        db = await OpenDatabase();
        const notifications = await db.all(`
            SELECT notification.id, notification.user_id, notification.note_id,
                   notification.created_at, note.title, note.description,
                   note.course_id, note.uploaded_at, course.course_code
            FROM Notification notification
            JOIN Note note ON note.id = notification.note_id
            JOIN Course course ON course.id = note.course_id
            WHERE notification.user_id = ?
            ORDER BY notification.created_at DESC, notification.id DESC;
        `, [userId]);

        return res.status(200).json(notifications);
    } catch {
        return res.status(500).json({ error: "Unable to retrieve notifications" });
    } finally {
        if (db) await db.close();
    }
}
