const {Sequelize} = require('@sequelize/core');
require('dotenv').config()
const postgressURI = process.env.DB_URI;

/**
 * setup sequel connection
 */
const sequelize = new Sequelize(postgressURI, {
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    }
);

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch((err: any) => {
        console.error('Unable to connect to the database:', err);
    });

export default sequelize;
