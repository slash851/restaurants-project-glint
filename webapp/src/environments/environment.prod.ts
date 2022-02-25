export const environment = {
  production: true,
  apiBaseUrl: 'https://us-central1-karolbednarz.cloudfunctions.net/restaurantapi/',
  endpoints: {
    restaurant: 'restaurants',
    auth: {
      login: 'auth/signin',
      register: 'auth/signup',
    },
    collections: 'collections',
    getItemsFromCollection: 'collections/get_items_from_collection/',
    addItemToCollection: 'collections/add_item_to_collection/',
    removeItemFromCollection: 'collections/remove_item_from_collection/'
  }
};
