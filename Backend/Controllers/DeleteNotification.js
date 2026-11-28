import { OpenDatabase } from "../Database/OpenDatabase.js";


export async function DeleteNotifications(req, res) {
    const { NotificationId } = req.body;
    const id = req.session.userId


    let db;
    try {
        db = await OpenDatabase();
         await db.run(`
           DELETE FROM Notification
            WHERE id = ? AND user_id = ?
        `, [ NotificationId,id]);

        return res.status(200).json({ message: "Notification deleted successfully" });
    } catch {
        return res.status(500).json({ error: "Unable to delete notification" });
    } finally {
        if (db) await db.close();
    }
}
