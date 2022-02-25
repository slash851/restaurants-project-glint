import {inject, injectable} from 'inversify';
import TYPES from '../constant/types';
import {DbService} from './db.service';
import {IRestaurant} from '../models/restaurant.model';
import {DbUtils} from '../Utils/Utils'

@injectable()
export class RestaurantsService {

      constructor(@inject(TYPES.DBService) private dbService: DbService) {
      }


      /**
       * get list of restaurants by quered parameters
       * @return {Promise<IRestaurant>} list of restaurants
       * @param {string} nameLike
       * @param {string} openAt
       * @param {string} day
       */
      public async getRestaurants(nameLike?: string, openAt?: string, day?: number): Promise<IRestaurant[]> {
            const query = RestaurantsService.buildRestaurantQuery(nameLike, openAt, day);
            const response = await this.dbService.client.query(query);
            return response.rows;
      }

      /**
       *
       * @param name
       * @param openAt
       * @param day
       * @private
       */
      private static buildRestaurantQuery(name?: string, openAt?: string, day?: number): string {
            let query = `SELECT name,id FROM opening_hours RIGHT JOIN restaurants ON (opening_hours.restaurant_id = restaurants.id)`;
            query += name ? DbUtils.addWhereOrAndToQuery(query) + `LOWER(name) LIKE '%${name.toLocaleLowerCase()}%'` : '';
            query += openAt ? DbUtils.addWhereOrAndToQuery(query) + `open_from <= '${openAt}' AND open_to > '${openAt}'` : '';
            query += day !== undefined && day !== null ? DbUtils.addWhereOrAndToQuery(query) + `day IN (${day})` : '';
            query += ' GROUP BY name,id';
            return query;
      }
}
