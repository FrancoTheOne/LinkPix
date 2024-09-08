"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Album extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Album.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
      },
      category: {
        type: DataTypes.STRING,
      },
      author: {
        type: DataTypes.STRING,
      },
      source: {
        type: DataTypes.STRING,
      },
      thumbnail: {
        type: DataTypes.STRING,
      },
      data: {
        type: DataTypes.TEXT,
      },
      rating: {
        type: DataTypes.INTEGER,
      },
      lastViewAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "Album",
    }
  );
  return Album;
};
