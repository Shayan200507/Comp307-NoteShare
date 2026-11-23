import { OpenDatabase } from "../Database/OpenDatabase.js";

export async function getAllCourses(req, res) {
    let db;

    try {
        db = await OpenDatabase();

        const result = await db.all(`
            SELECT id, course_code
            FROM Course;
        `);

        return res.status(200).json(result);

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