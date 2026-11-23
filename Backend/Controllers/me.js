import bcrypt from "bcrypt";
import { OpenDatabase } from "../Database/OpenDatabase.js";



export async function me(req,res) {

    const id = req.session.userId



    let db;

    try{

        db = await OpenDatabase();

        const result = await db.all(`
            
            SELECT email FROM User WHERE id = ?
            
            
            `,[id])
        
        if (result.length === 0) {
                return res.status(404).json({
                error: "User not found"
            });
        }
        
        const email = result[0].email;

        res.status(200).json({
            id: id,
            email: email
        })

    }
    catch(error){

          return res.status(500).json({
       
        error: "Internal server error"
        
        });

    }
    finally{
        if(db){
            await db.close()
        }
    }
    
}
