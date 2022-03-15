import OpeningHours from './models/openingHours.model';
import Restaurant from './models/restaurants.model';
import {loadFileLineByLine} from './services/file.service';
import {dataSource} from './config';
import {parseLine} from './services/openingHoursProcessor.service';

let totalLines = []

//load file with raw data line by line
loadFileLineByLine(dataSource).then((lines) => {
    totalLines = lines;
    //when file is loaded save the results in database
    saveDataToDB();
});

/**
 * save restaurant asyncronically as currently used version of DB has limit of connections for free tier
  */
function saveDataToDB() {
    if (totalLines.length > 0) {
        // save restaurant with parsed line
        saveRestaurant(parseLine(totalLines.pop()));
    }
}

/**
 * save restaurant using its model
 * @param pared
 */
function saveRestaurant(pared) {
    Restaurant.create({name: pared[0]['name']}).then((restaurantModel) => {
        // for each restaurant save its opening hours
        saveOpeningHours(pared, restaurantModel)
    }).catch((error) => {
        console.log(error);
    });
}

/**
 * save Opening hours of restauratn
 * @param pared
 * @param restaurantModel
 */
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
        saveDataToDB();
    }
}



