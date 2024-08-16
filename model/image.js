const { DataTypes } = require("sequelize");
const db = require("../database/database");
const fs = require("fs");

const Image = db.define("Image", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  src: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  thumbnail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  thumbnailAlignment: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  imageWidth: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  imageHeight: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  creationDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
    schema: "public",
    hooks: {
      beforeDestroy: (image) => {
        console.log("Deleting image beforeDestroy", image.src);
        try {
          fs.unlinkSync(image.src);
          console.log("Successfully deleted image", image.src);
        } catch (error) {
            console.error("Error deleting image:", error);
        }

        try {
            fs.unlinkSync(image.thumbnail);
            console.log("Successfully deleted image thumbnail", image.thumbnail);
        } catch (error) {
            console.error("Error deleting image thumbnail:", error);
        }
      },
    },
});

module.exports = Image;
