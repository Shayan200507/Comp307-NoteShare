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





async function createCourseTables() {
    const db = await OpenDatabase() 
    try {
        await db.exec(`
            PRAGMA foreign_keys = ON;

            CREATE TABLE IF NOT EXISTS Course (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                course_code TEXT NOT NULL UNIQUE
            );

            CREATE TABLE IF NOT EXISTS Subscription (
                user_id INTEGER NOT NULL,
                course_id INTEGER NOT NULL,

                PRIMARY KEY (user_id, course_id),

                FOREIGN KEY (user_id) REFERENCES User(id),
                FOREIGN KEY (course_id) REFERENCES Course(id)
            );
        `);

        console.log("Course tables created successfully");
    } finally {
        await db.close();
    }
}








async function createUploadsTable() {
    const db = await OpenDatabase() 
    try {
        await db.exec(`

            PRAGMA foreign_keys = ON;
            CREATE TABLE IF NOT EXISTS Note (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                course_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                filename TEXT NOT NULL,
                uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,

                FOREIGN KEY (user_id) REFERENCES User(id),
                FOREIGN KEY (course_id) REFERENCES Course(id)
            );
        `);

        console.log("Uploads Table created successfully");
    } finally {
        await db.close();
    }
}


await createUploadsTable()