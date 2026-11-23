import { OpenDatabase } from "../Database/OpenDatabase.js";


export async function getUserCourse(req,res){

    const id = req.session.userId
    if (req.method === 'POST' && req.body?.userId !== id) {
        return res.status(403).json({ error: 'User ID does not match your session' });
    }
    let db;

    try{

        db = await OpenDatabase();

        const result = await db.all(`
            
            SELECT c.id, c.course_code
            FROM Course c
            JOIN Subscription s ON s.course_id = c.id
            WHERE s.user_id = ?;    
            
            
            `,[id])
        
        res.status(200).json(result);



    }
    catch(error){
    
        
        return res.status(500).json({
       
        error: "Internal server error"
        
        });
    }
    finally{
        if(db){
            await db.close();
        }
    }



}
