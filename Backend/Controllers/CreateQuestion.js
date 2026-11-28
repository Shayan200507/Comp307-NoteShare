// Shayan Sheikh

import { OpenDatabase } from "../Database/OpenDatabase.js";

export async function CreateQuestion(req, res) {

    const id = req.session.userId
    const { course_code, title, body } = req.body ?? {};
    if (typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({ error: "Question title is required" });
    }
    let db;


    try {
    db = await OpenDatabase();

    const course = await db.get('SELECT id FROM Course WHERE course_code = ?', [course_code]);
    if (!course) {
        return res.status(404).json({ error: "Course not found" });
    }

    await db.run(
        `INSERT INTO Questions (user_id, course_id, title, body)
         VALUES (?, ?, ?, ?)`,
        [id, course.id, title.trim(), body]
    );

    return res.status(201).json({
        message: "Question created successfully"
    });

} catch (error) {
    console.error(error);

    return res.status(500).json({
        error: "Unable to create question"
    });

} finally {
    if (db) await db.close();
}
















}
