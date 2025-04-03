import multer from "multer";

const MIME_TYPES = {
    "image/jpg" : "jpg", 
    "image/jpeg" : "jpeg", 
    "image/png" : "png", 
    "image/gif" : "gif", 
    "image/webp" : "webp" 
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "images")
    },
     filename : (req, file, callback) => {
        const name = file.originalname.split(" ").join("_")
        const extension = MIME_TYPES[file.mimetype]
        callback(null, name + "_" + Date.now() + '.' + extension)
     }
})

export default multer({storage: storage}).fields([{name: "image01", maxCount: 1}, {name: "image02", maxCount: 1}, {name: "image03", maxCount: 1}])