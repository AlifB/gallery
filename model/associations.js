const Album = require("./album");
const Image = require("./image");
const db = require("../database/database");

// define relationships
Album.belongsToMany(Image, {
  through: "AlbumImages",
  foreignKey: "albumId",
  as: "images",
  onDelete: "CASCADE",
  hooks: true,
});

Image.belongsToMany(Album, {
  through: "AlbumImages",
  foreignKey: "imageId",
  as: "albums",
  hooks: true,
});

module.exports = { Album, Image };
