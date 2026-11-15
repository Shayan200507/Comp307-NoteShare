import {OpenDatabase} from "./OpenDatabase.js"

async function createUsersTable(){

    let db
    try{

        db = await OpenDatabase()

        await db.exec(`

            CREATE TABLE IF NOT EXISTS User (
            
            id INTEGER PRIMARY KEY  AUTOINCREMENT,
            email TEXT NOT NULL,
            password TEXT NOT NULL


            
            
            )
            
            
            
            `)


        console.log("User table initialized successfully!");

    }
    catch(error){
        console.log(error)
    }
    finally{
        if(db){
            await db.close()
        }
    }

}


createUsersTable()