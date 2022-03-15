import {DataTypes} from 'sequelize';

const {Sequelize} = require('@sequelize/core');
const moment = require('moment');
const fs = require('fs');
const readline = require('readline');

let totalLines = []
const postgressURI = 'postgres://dkktmbjb:BcvxuBZf2-tx0V-RnHzyv_BtW5CbbY19@jelani.db.elephantsql.com/dkktmbjb';
const dataSource = 'hours.backup.csv'


async function processLineByLine() {
    const fileStream = fs.createReadStream(dataSource);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let lineArray = [];

    for await (const line of rl) {
        lineArray.push(line)
    }
    return lineArray;
}

processLineByLine().then((lines) => {
    totalLines = lines;

    saveNextRestaurant();
});


function saveNextRestaurant() {
    if (totalLines.length > 0) {
        saveToDb(parseLine(totalLines.pop()));
    }
}

function saveToDb(pared) {
    Restaurant.create({name: pared[0]['name']}).then((restaurantModel) => {
        saveOpeningHours(pared, restaurantModel)
        // pared.forEach(pair => {
        //
        // })
    }).catch((error) => {
        console.log(error);
    });
}

function saveOpeningHours(pared: any[], restaurantModel: any) {
    if (pared.length > 0) {
        let pair = pared.pop();
        OpeningHours.create({
            restaurant_id: restaurantModel.getDataValue('id'),
            day: pair.day,
            open_from: pair.openAt,
            open_to: pair.closeAt,
        }).then((openingHoursModel) => {
            console.log('opening hour save successfully')
            saveOpeningHours(pared, restaurantModel);
        }).catch((error) => {
            console.log(error);
        });
    } else {
        saveNextRestaurant();
    }
}

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

function parseLine(line) {

    const name = line.slice(0, line.indexOf(',')).replace('"', '').replace('"', '');
    const openingGroups = line.slice(line.indexOf(',') + 1, line.length).replace('"', '').split('/');

    let pairs = []
    openingGroups.forEach(group => {
            let daysGroup = getTextTillNumber(group);
            const timeFromAndTo = group.slice(daysGroup.length, group.length).replace('"', '').split('-')


            daysGroup.split(',').forEach(day => {

                let dd = day.trim().split('-')

                // case of date range Mon-Wed
                if (dd.length > 1) {

                    const dayFrom = mapDayToInt(dd[0])
                    const dayTo = mapDayToInt(dd[1])

                    if (dayFrom < dayTo) {
                        // Mon-Fri
                        for (let i = dayFrom; i <= dayTo; i++) {
                            pairs.push({
                                name: name,
                                day: i,
                                dayString: day.trim(),
                                openAt: convertAMto24(timeFromAndTo[0]),
                                closeAt: convertAMto24(timeFromAndTo[1])
                            });
                        }
                    } else {
                        // Fri - Tue
                        // split to Friday - Sunday and Monday Tuesday
                        for (let i = dayFrom; i <= 6; i++) {
                            pairs.push({
                                name: name,
                                day: i,
                                dayString: day.trim(),
                                dd: dd,
                                openAt: convertAMto24(timeFromAndTo[0]),
                                closeAt: convertAMto24(timeFromAndTo[1])
                            });
                        }
                        for (let i = 0; i <= dayTo; i++) {
                            pairs.push({
                                name: name,
                                day: i,
                                dayString: day.trim(),
                                dd: dd,
                                openAt: convertAMto24(timeFromAndTo[0]),
                                closeAt: convertAMto24(timeFromAndTo[1])
                            });
                        }
                    }


                } else {
                    pairs.push({
                        name: name,
                        day: mapDayToInt(day.trim()),
                        dayString: day.trim(),
                        dd: dd,
                        openAt: convertAMto24(timeFromAndTo[0]),
                        closeAt: convertAMto24(timeFromAndTo[1])
                    });
                }


            })
        }
    )
    return pairs;

}

function getTextTillNumber(text) {
    return text.match(/^\D+/)[0];
}

function convertAMto24(text) {
    return moment(text.trim(), ['h:mm A']).format('HH:mm:ss');
}

function mapDayToInt(day) {
    switch (day.trim().toLowerCase().slice(0, 3)) {
        case 'mon':
            return 0;
        case 'tue':
            return 1;
        case 'wed':
            return 2;
        case 'thu':
            return 3;
        case 'fri':
            return 4;
        case 'sat':
            return 5;
        case 'sun':
            return 6;
    }
}
