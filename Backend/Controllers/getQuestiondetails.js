// Shayan Sheikh
import { OpenDatabase } from "../Database/OpenDatabase.js";

export async function getQuestionDetails(req, res){
    const {QuestionID} = req.params

    let db;

     try {
        db = await OpenDatabase();

        const question = await db.get(
            `SELECT Questions.*, User.email, Course.course_code
            FROM Questions
            JOIN User ON Questions.user_id = User.id
            JOIN Course ON Questions.course_id = Course.id
            WHERE Questions.id = ?`,
            [QuestionID]
        );

        if (!question) {
            return res.status(404).json({
                error: "Question not found"
            });
        }

        return res.status(200).json(question);

    } catch (error) {
        return res.status(500).json({
            error: "Unable to fetch question"
        });
    } finally {
        if (db) await db.close();
    }
}

