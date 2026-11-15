import express from "express"
import session  from "express-session"
import cors from "cors";
import {AuthHandler} from "./Routers/AuthRouter.js"
import {ContentHandler} from "./Routers/ContentRouter.js"



const server = express()
const PORT = 8000


server.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

server.use(express.json())


server.use(session({
    secret: process.env.SPIRAL_SESSION_SECRET|| 'dev-secret' ,
    resave: false,
    saveUninitialized: false,
    cookie: {

      httpOnly: true,
      secure: false,
      sameSite: "lax"
    }

}))


server.use("/api/auth",AuthHandler)
server.use("/api/Content",ContentHandler)






server.use((req,res)=>{

  res.status(404).json({

     error: "request not found"

  })

})



server.listen(PORT,()=>{console.log(`Connected: ${PORT}`)}).on("error",(err) =>{
    console.log(`failed to start server: ${err}`)
})