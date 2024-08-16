const setupRoutes = (app) => {
    const GalleryController = require("../controller/galleryController");
    const AdminController = require("../controller/adminController");
    const AuthController = require("../controller/authController");
    const albumController = require("../controller/albumController");
    const albumAuth = require("../auth/albumAuth");
    const authMiddleware = require("../auth/authMiddleware");
    const upload = require("../middleware/multerConfig");

    app.set("view engine", "ejs");
    app.set("views", "./view");

    app.get("/", GalleryController.index);

    app.get("/album/:albumId", albumAuth, albumController.index);
    app.post("/album/auth", albumController.auth);
    
    app.get("/admin", authMiddleware, AdminController.index);
    app.get("/admin/upload", authMiddleware, AdminController.upload);
    app.post("/admin/upload", authMiddleware, upload, AdminController.uploadImage);
    app.delete("/admin/delete/:id", authMiddleware, AdminController.delete);
    app.get("/admin/album/create", authMiddleware, AdminController.indexCreateAlbum);
    app.post("/admin/album/create", authMiddleware, AdminController.createAlbum);
    app.delete("/admin/album/delete/:id", authMiddleware, AdminController.deleteAlbum);

    app.get('/login', AuthController.index);
    app.post('/auth', AuthController.auth);
    app.get('/logout', AuthController.logout);
};

module.exports = setupRoutes;
