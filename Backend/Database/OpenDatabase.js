// Shayan Sheikh
import sqlite3 from "sqlite3"
import {open} from "sqlite"
import path from "path"



const pathURL = path.join(import.meta.dirname,"Users.db")


export async function OpenDatabase(){
    
    let db
    try{ 
        db = await open({
            filename: pathURL,
            driver: sqlite3.Database
        })

        return db
    }
    catch(error){
        console.log(error)
        throw error
    }

    
       
}
