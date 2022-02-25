// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:5001/karolbednarz/us-central1/restaurantapi/',
  endpoints: {
    auth: {
      login: 'auth/signin',
      register: 'auth/signup'
    },
    restaurant: 'restaurants',
    collections: 'collections',
    getItemsFromCollection: 'collections/get_items_from_collection/',
    addItemToCollection: 'collections/add_item_to_collection/',
    removeItemFromCollection: 'collections/remove_item_from_collection/'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
