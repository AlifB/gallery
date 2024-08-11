const setupRoutes = (app) => {
    const GalleryController = require("../controller/galleryController");
    const AdminController = require("../controller/adminController");
    const AuthController = require("../controller/authController");
    const authMiddleware = require("../auth/authMiddleware");
    const path = require("path");
    const crypto = require("crypto");

    app.set("view engine", "ejs");
    app.set("views", "./view");

    app.get("/", GalleryController.index);

    app.get("/admin", authMiddleware, AdminController.index);
    app.get("/admin/upload", authMiddleware, AdminController.upload);

    const multer = require("multer");
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "userdata/uploads");
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = crypto.randomBytes(8).toString('hex');
            const ext = path.extname(file.originalname);
            cb(null, uniqueSuffix + ext);
        },
    });
    const upload = multer({ 
        storage: storage,
        limits: {
            fileSize: 1024 * 1024 * 40,
        },
        fileFilter: function(req, file, cb) {
            checkFileType(file, cb);
        }
     }).single('image');
     // Check file type
    function checkFileType(file, cb) {
        // Allowed extensions
        const filetypes = /jpeg|jpg|png|gif/;
        // Check extension
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        // Check mime type
        const mimetype = filetypes.test(file.mimetype);
    
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Images Only!');
        }
    }
    app.post("/admin/upload", authMiddleware, upload, AdminController.uploadPost);
    app.delete("/admin/delete/:id", authMiddleware, AdminController.delete);

    app.get('/login', AuthController.index);
    app.post('/auth', AuthController.auth);
    app.get('/logout', AuthController.logout);
};

module.exports = setupRoutes;
