import { OpenDatabase } from "../Database/OpenDatabase.js";

export async function unregisterCourse(req, res) {
    const id = req.session.userId;
    const { courseId } = req.body;
    let db;

    try {
        db = await OpenDatabase();

        await db.run(`
            DELETE FROM Subscription
            WHERE user_id = ? AND course_id = ?;
        `, [id, courseId]);

        return res.status(200).json({
            message: "Successfully unregistered from course"
        });

    } catch (error) {
        return res.status(500).json({
            error: "Internal server error"
        });
    } finally {
        if (db) {
            await db.close();
        }
    }
}
