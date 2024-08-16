const Album = require('../model/album');
const Image = require('../model/image');

exports.index = async (req, res) => {
    try {
        const images = await Image.findAll({
            include: {
                model: Album,
                as: 'albums',
                where: {
                    title: 'Public',
                },
                through: {
                    attributes: [],
                },
            }
        });
        res.render('galleryView', { albumTitle: 'Public', images, loggedIn: req.cookies.token ? true : false });
    }
    catch (error) {
        console.error("Error fetching images:", error);
        res.status(500).send("Error fetching images");
    }
};
