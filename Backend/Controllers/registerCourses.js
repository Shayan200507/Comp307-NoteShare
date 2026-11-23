import { OpenDatabase } from "../Database/OpenDatabase.js";

export async function registerCourse(req, res) {
    const id = req.session.userId;
    const { courseId } = req.body ?? {};
    if (!Number.isSafeInteger(courseId) || courseId <= 0) {
        return res.status(400).json({ error: "courseId must be a positive integer" });
    }
    let db;

    try {
        db = await OpenDatabase();

        await db.run(`
            INSERT INTO Subscription (user_id, course_id)
            VALUES (?, ?);
        `, [id, courseId]);

        return res.status(201).json({
            message: "Successfully registered for course"
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
