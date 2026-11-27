// Shayan Sheikh
import path from "node:path";
import multer from "multer";
import { randomUUID } from "node:crypto";
const uploadPath = path.join(import.meta.dirname, "../Uploads");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "Uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${randomUUID()}.pdf`);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only PDFs allowed"));
        }
    }
});

export default upload;
