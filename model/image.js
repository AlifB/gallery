const db = require("../database/database");

const Image = db.define("Image", {
  id: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  src: {
    type: db.Sequelize.STRING,
    allowNull: false,
  },
  thumbnail: {
    type: db.Sequelize.STRING,
    allowNull: false,
  },
  thumbnailAlignment: {
    type: db.Sequelize.STRING,
    allowNull: false,
  },
  imageWidth: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
  },
  imageHeight: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
  },
  creationDate: {
    type: db.Sequelize.DATE,
    allowNull: false,
  },
}, {
    schema: "public",
});

module.exports = Image;
