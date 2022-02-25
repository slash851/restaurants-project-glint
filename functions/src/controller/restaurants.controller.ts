import {controller, httpGet, httpPost} from 'inversify-express-utils';
import {IRestaurant} from '../models/restaurant.model';
import TYPES from '../constant/types';
import {inject} from 'inversify';
import {RestaurantsService} from '../service/restaurants.service';
import {Request} from 'express';


/**
 * @controller
 */
@controller('/restaurants')
export class RestaurantsController {
      constructor(@inject(TYPES.RestaurantsService) private restaurantsService: RestaurantsService) {
      }

      @httpPost('/')
      public getRestaurants(request: Request): Promise<IRestaurant[]> {
            return this.restaurantsService.getRestaurants(RestaurantsController.normalizeProperty(request.body.name), RestaurantsController.normalizeProperty(request.body.openAt), RestaurantsController.normalizeProperty(request.body.day))
      }

      /**
       * nullize empty values
       * @param prop
       * @private
       */
      private static normalizeProperty(prop: any): any {
            return prop === '' ? null : prop;
      }

      @httpGet('/test')
      public testPath(): {} {
            return {'dupa': 'zbita'};
      }

}
