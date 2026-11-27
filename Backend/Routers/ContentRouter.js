// Shayan Sheikh
import express from "express"
import { LoginCheck } from "../Middleware/LoginCheck.js"
import { registerCourse } from "../Controllers/registerCourses.js"
import { getUserCourse } from "../Controllers/getUserCourse.js"
import { getAllCourses } from "../Controllers/getAllCourses.js"
import { unregisterCourse } from "../Controllers/RemoveCourse.js"
import { uploadNote } from "../Controllers/UploadNotes.js"
import upload from "../Middleware/UploadMiddleware.js"
import { getAllNotes } from "../Controllers/getAllNotes.js"
import { RetrieveFile } from "../Controllers/RetreiveFile.js"
import { getUserNotifications } from "../Controllers/getUserNotifications.js"




export const ContentHandler = express.Router()

ContentHandler.post("/registerCourses", LoginCheck, registerCourse)
ContentHandler.get("/getUserCourse", LoginCheck, getUserCourse)
ContentHandler.post("/getUserCourse", LoginCheck, getUserCourse)
ContentHandler.get("/getAllCourses", LoginCheck, getAllCourses)
ContentHandler.delete("/removeCourses", LoginCheck, unregisterCourse)
ContentHandler.post("/uploadNotes", LoginCheck, upload.single("file"), uploadNote)
ContentHandler.get("/getAllNotes", LoginCheck, getAllNotes)
ContentHandler.get("/retrieveFile/:noteId", LoginCheck, RetrieveFile)
ContentHandler.post("/getUserNotifications", LoginCheck, getUserNotifications)


