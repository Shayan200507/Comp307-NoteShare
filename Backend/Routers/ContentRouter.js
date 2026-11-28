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
import { RetrieveFile } from "../Controllers/RetrieveFile.js"
import { getUserNotifications } from "../Controllers/getUserNotifications.js"
import { DeleteNotifications } from "../Controllers/DeleteNotification.js"
import { getUserNotes } from "../Controllers/getUserNotes.js"
import { CreateQuestion } from "../Controllers/CreateQuestion.js"
import { CreateResponse } from "../Controllers/CreateResponse.js"
import { getCourseQuestions } from "../Controllers/getCourseQuestions.js"
import { getQuestionResponses } from "../Controllers/getQuestionResponses.js"
import { getQuestionDetails } from "../Controllers/getQuestiondetails.js"
import { checkDictionary } from "../Controllers/checkDictionary.js"




export const ContentHandler = express.Router()

ContentHandler.post("/registerCourses", LoginCheck, registerCourse)
ContentHandler.get("/getUserCourse", LoginCheck, getUserCourse)
ContentHandler.get("/getAllCourses", LoginCheck, getAllCourses)
ContentHandler.delete("/removeCourses", LoginCheck, unregisterCourse)
ContentHandler.post("/uploadNotes", LoginCheck, upload.single("file"), uploadNote)
ContentHandler.get("/getAllNotes", LoginCheck, getAllNotes)
ContentHandler.get("/getUserNotes", LoginCheck, getUserNotes)
ContentHandler.get("/retrieveFile/:noteId", LoginCheck, RetrieveFile)
ContentHandler.get("/getUserNotifications", LoginCheck, getUserNotifications)
ContentHandler.delete("/deleteNotification", LoginCheck, DeleteNotifications)
ContentHandler.post("/createQuestion", LoginCheck, CreateQuestion)
ContentHandler.post("/createResponse", LoginCheck, CreateResponse)
ContentHandler.get("/getCourseQuestions/:courseID", LoginCheck, getCourseQuestions)
ContentHandler.get("/getQuestionResponses/:QuestionID", LoginCheck, getQuestionResponses)
ContentHandler.get("/getQuestionDetails/:QuestionID", LoginCheck, getQuestionDetails)
ContentHandler.get("/checkDictionary/:word", LoginCheck, checkDictionary)


