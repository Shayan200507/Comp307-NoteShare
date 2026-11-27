// Shayan Sheikh
import express from "express"
import { Signup } from "../Controllers/Signup.js"
import {Login} from "../Controllers/Login.js"
import {LoginCheck} from "../Middleware/LoginCheck.js"
import {me} from "../Controllers/me.js"
import {Logout} from "../Controllers/Logout.js"



export const AuthHandler = express.Router()

AuthHandler.post("/signup", Signup)
AuthHandler.post("/login",Login)
AuthHandler.post("/logout",Logout)
AuthHandler.get("/me",LoginCheck,me)

