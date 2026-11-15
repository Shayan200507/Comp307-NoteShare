import bcrypt from "bcrypt";
import { OpenDatabase } from "../Database/OpenDatabase.js";


export async function Login(req,res){


    let {email,password} = req.body
 


    let db;

    try{

        db = await OpenDatabase();



        const result = await db.all(`
            
            
            SELECT * FROM User WHERE 

            email = ?;
            
            
            
            
            
            
            `,[email])


        if (result.length === 0) {
    return res.status(401).json({
        error: "Invalid email or password"
    });
    } 
    
    
    const user = result[0];
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
    return res.status(401).json({
        error: "Invalid email or password"
    });
    }



    req.session.userId = user.id;


    return res.status(200).json({message: `login successful`})
    
    




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