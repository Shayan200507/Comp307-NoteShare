// Shayan Sheikh
import { OpenDatabase } from "../Database/OpenDatabase.js";

export async function RetrieveFile(req, res) {

    const { noteId } = req.params;
    let db;


    try{
        db = await OpenDatabase();

        const note = await db.get(`
            SELECT *
            FROM Note
            WHERE id = ?;
        `, [noteId]);

        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }

        res.status(200).json({
            ...note,
            pdfUrl: `http://localhost:8000/Uploads/${note.filename}`
            });




    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Unable to retrieve file" });
    } finally {
        if (db) {
            await db.close();
        }
    }


}
