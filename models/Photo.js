const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Photo extends Model {}

Photo.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
          },
          user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
          },
          photo_data: {
            type: DataTypes.STRING,
            allowNull: false
          }
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'photo'
    }
);

module.exports = Photo;