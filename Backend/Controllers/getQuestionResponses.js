// Shayan Sheikh
import { OpenDatabase } from "../Database/OpenDatabase.js";


export async function getQuestionResponses(req, res) {
    const {QuestionID} = req.params


     let db;

    try {
        db = await OpenDatabase();

        const responses = await db.all(
            `SELECT Responses.*, User.email
             FROM Responses
             JOIN User ON User.id = Responses.user_id
             WHERE Responses.question_id = ?
             ORDER BY Responses.created_at ASC, Responses.id ASC`,
            [QuestionID]
        );

        return res.status(200).json(responses);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Unable to fetch responses"
        });

    } finally {
        if (db) await db.close();
    }

}
