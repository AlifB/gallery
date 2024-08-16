const db = require('../database/database');
const { Image, Album } = require('../model/associations');
const pathNode = require('path');
const sharp = require('sharp');
const fs = require('fs');

exports.index = async (req, res) => {
    try {
        const images = await Image.findAll({
            include: {
                model: Album,
                as: 'albums',
                through: {
                    attributes: [],
                },
            }
        });
        console.log("Images:", images);
        
        const albums = await Album.findAll();
        return res.render('adminView', { images, albums, loggedIn: req.cookies.token ? true : false });
    }
    catch (error) {
        console.error("Error fetching images:", error);
        return res.status(500).send("Error fetching images");
    }
}

exports.upload = async (req, res) => {
    try {
        const albums = await Album.findAll();
        return res.render('adminUploadView', { albums, loggedIn: req.cookies.token ? true : false });
    } catch (error) {
        return res.status(500).send("Internal server error");
    }
}

exports.uploadImage = async (req, res) => {
    try {
        console.log("Uploading image:", req.file);

        if (!req.file) {
            return res.status(400).send("Please upload an image");
        }

        const { originalname, filename, path } = req.file;
        const { thumbnailAlignment, albumId } = req.body;

        if (!albumId) {
            return res.status(400).send("Please select an album");
        }

        const album = await Album.findByPk(albumId);

        if (!album) {
            return res.status(404).send("Album not found");
        }

        const filePath = path;

        const thumbPath = filePath.replace(pathNode.extname(filePath), '_thumb' + pathNode.extname(filePath));

        try {
            const metadata = await sharp(filePath).metadata();
            console.log("Image metadata:", metadata);

            let newSize;
            if(metadata.width > metadata.height) {
                newSize = { width: 400 };
            } else {
                newSize = { height: 400 };
            }

            await sharp(filePath)
                .resize(newSize)
                .toFile(thumbPath);

            const transaction = await db.transaction();

            try {
                const image = await Image.create({
                    src: filePath,
                    thumbnail: thumbPath,
                    thumbnailAlignment: thumbnailAlignment === 'top' ? 'top' : thumbnailAlignment === 'bottom' ? 'bottom' : 'center',
                    imageWidth: metadata.width,
                    imageHeight: metadata.height,
                    creationDate: new Date(),
                }, { transaction });

                await image.setAlbums([album], { transaction });

                await transaction.commit();
            } catch (error) {
                await transaction.rollback();
                throw new Error('Error while saving image to database');
            }
        } catch (error) {
            console.error("Error resizing image:", error);

            fs.unlinkSync(filePath, (error) => {
                if (error) {
                    console.error("Error deleting image: ", error);
                } else {
                    console.log("Successfully deleted image ", filePath);
                }
            });
            
            res.status(500).send("Error resizing image");
            return;
        }
        
        return res.redirect('/admin');
    }
    catch (error) {
        console.error("Error uploading image:", error);
        return res.status('500').redirect('/admin');
    }
}

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const image = await Image.findByPk(id);

        if (!image) {
            return res.status(404).send("Image not found");
        }

        const transaction = await db.transaction();

        try {
            await image.destroy({ transaction });
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw new Error('Error while deleting image from database');
        }
        res.status(200).send('Successfully deleted image');
    }
    catch (error) {
        console.error("Error deleting image:", error);
        res.status(500).send("Error deleting image");
    }
}

exports.indexCreateAlbum = async (req, res) => {
    return res.render('adminCreateAlbumView', { loggedIn: req.cookies.token ? true : false });
}

exports.createAlbum = async (req, res) => {
    try {
        const { title, description, password } = req.body;

        if (!title) {
            return res.status(400).send("Please provide a title");
        }

        const album = await Album.create({
            title,
            description,
            password,
            creationDate: new Date(),
        });

        return res.redirect('/admin');
    }
    catch (error) {
        console.error("Error creating album:", error);
        return res.status(500).send("Error creating album");
    }
}

exports.deleteAlbum = async (req, res) => {
    try {
        const { id } = req.params;
        const album = await Album.findByPk(id);

        if (!album) {
            return res.status(404).send("Album not found");
        }

        const transaction = await db.transaction();

        try {
            await album.destroy({ transaction });
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw new Error('Error while deleting album from database');
        }

        res.status(200).send('Successfully deleted album');
    }
    catch (error) {
        console.error("Error deleting album:", error);
        res.status(500).send("Error deleting album");
    }
}