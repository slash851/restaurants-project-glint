import {DataTypes} from 'sequelize';
import sequelize from '../db/config';

/**
 * OpeningHours model representation from db
 */
const OpeningHours = sequelize.define('opening_hours', {
    // Model attributes are defined here
    id: {
        type: DataTypes.NUMBER,
        primaryKey: true,
        autoIncrement: true,

    },
    restaurant_id: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    day: {
        type: DataTypes.NUMBER,
        allowNull: false,
        // allowNull defaults to true
    },
    open_from: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    open_to: {
        type: DataTypes.TIME,
        allowNull: false,
    }
}, {
    timestamps: false
});

export default OpeningHours;
