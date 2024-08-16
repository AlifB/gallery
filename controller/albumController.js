const { Album, Image } = require('../model/associations');
const bcrypt = require('bcrypt');
const e = require('express');
const jwt = require('jsonwebtoken');

exports.index = async (req, res) => {
    try {
        const albumId = req.params.albumId;
        const { password } = req.body;

        const album = await Album.findByPk(albumId, {
            include: {
                model: Image,
                as: 'images',
                through: {
                    attributes: [],
                },
            },
        });

        if (!album) {
            return res.status(404).send("Album not found");
        }

        if (album.password && res.locals.albumAuth !== true) {
            return res.render('albumPasswordView', { albumId, loggedIn: req.cookies.token ? true : false });
        }

        return res.render('galleryView', { images: album.images, loggedIn: req.cookies.token ? true : false });
    }
    catch (error) {
        console.error("Error fetching albums:", error);
        res.status(500).send("Error fetching albums");
    }
}

exports.auth = async (req, res) => {
    try {
        const { albumId, password } = req.body;

        const album = await Album.findByPk(albumId);

        if (!album) {
            return res.status(404).send("Album not found");
        }

        if (bcrypt.compareSync(password, album.password)) {
            const token = jwt.sign(
                { albumId },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );
            res.cookie(albumId, token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 3600000,
            });
        }
        return res.redirect(`/album/${albumId}`);
    }
    catch (error) {
        console.error("Error authenticating album:", error);
        res.status(500).send("Error authenticating album");
    }
}