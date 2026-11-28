import { OpenDatabase } from "../Database/OpenDatabase.js";


export async function getCourseQuestions(req, res) {

    const {courseID} = req.params

     let db;

    try {
        db = await OpenDatabase();

        const questions = await db.all(
    `SELECT Questions.*, User.email
     FROM Questions
     JOIN User ON User.id = Questions.user_id
     WHERE Questions.course_id = ?
     ORDER BY Questions.created_at DESC, Questions.id DESC`,
            [courseID]
        );

        return res.status(200).json(questions);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Unable to fetch questions"
        });

    } finally {
        if (db) await db.close();
    }
}

