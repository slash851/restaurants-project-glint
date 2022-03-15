import sequelize from '../db/config';
import {DataTypes} from '@sequelize/core';

/**
 * Restaurant model representation from db
 */
const Restaurant = sequelize.define('restaurants', {
    // Model attributes are defined here
    id: {
        type: DataTypes.NUMBER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING
        // allowNull defaults to true
    },
}, {
    timestamps: false

    // Other model options go here
});

export default Restaurant;
