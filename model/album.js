const { DataTypes } = require("sequelize");
const db = require("../database/database");
const bcrypt = require("bcrypt");

const Album = db.define(
  "Album",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    creationDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    schema: "public",
    hooks: {
      beforeCreate: (album) => {
        if(album.password) {
            const salt = bcrypt.genSaltSync(10);
            album.password = bcrypt.hashSync(album.password, salt);
        }
      },
    },
  }
);

module.exports = Album;
