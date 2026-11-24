import { OpenDatabase } from "../Database/OpenDatabase.js";
export async function notifyCourseUsers({ noteId, courseId }) {
    const db = await OpenDatabase();

    try {
        await db.exec('BEGIN TRANSACTION');
        const users = await db.all(
            'SELECT user_id FROM Subscription WHERE course_id = ?',
            [courseId]
        );

        for (const user of users) {
            await db.run(
                'INSERT INTO Notification (user_id, note_id) VALUES (?, ?)',
                [user.user_id, noteId]
            );
        }

        await db.exec('COMMIT');
    } catch (error) {
        await db.exec('ROLLBACK');
        throw error;
    } finally {
        await db.close();
    }
}






export async function uploadNote(req, res) {
    const userId = req.session.userId;
    const { courseId, title, description } = req.body;
    const filename = req.file.filename;

    let db;

    try {
        db = await OpenDatabase();

        const result = await db.run(`
            INSERT INTO Note
            (user_id, course_id, title, description, filename)
            VALUES (?, ?, ?, ?, ?);
        `, [userId, courseId, title, description, filename]);

        await notifyCourseUsers({ noteId: result.lastID, courseId });

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

     

