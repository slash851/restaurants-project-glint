import {inject, injectable} from 'inversify';
import TYPES from '../constant/types';
import {DbService} from './db.service';
import {ICollection} from '../models/collection.model';

@injectable()
export class CollectionsService {

    constructor(@inject(TYPES.DBService) private dbService: DbService) {
    }


    /**
     * get list of collections per user or specific collection if ID is specified
     * @param {string} userId
     * @param {string?} collectionId
     * @return {Promise<ICollection>} list of collections user have
     */
    public async getCollections(userId: string, collectionId?: string): Promise<ICollection[]> {
        let query: string = `SELECT * FROM collections WHERE "owner" LIKE '${userId}'`

        // if request contains collection ID return only this collection
        if (collectionId) {
            query += ` AND "id"=${collectionId}`
        }
        const response = await this.dbService.client.query(query);

        return response.rows;
    }

    /**
     * get specific collection by collection id and userId
     * @param {string} userId
     * @param {number} collectionId
     * @return {Promise<ICollection>} list of collections user have
     */
    public async getCollectionByCollectionId(collectionId: number): Promise<ICollection[]> {
        const query: string = `SELECT * FROM collections WHERE "id"=${collectionId};`
        const response = await this.dbService.client.query(query);
        return response.rows;
    }

    /**
     * add new collection
     * @param {string} userId
     * @param {string} collectionName
     */
    public async addCollection(userId: string, collectionName: string): Promise<any> {
        const query: string = `INSERT INTO collections ("name", "owner") VALUES ('${collectionName}', '${userId}')`;
        try {
            await this.dbService.client.query(query);
            return {message: 'collection added'}
        } catch (e) {
            throw e;
        }
    }

    /**
     * remove new collection
     * @param {string} userId
     * @param {string} collectionName
     */
    public async removeCollection(collectionId: number): Promise<any> {

        try {

            //remove all objects from junction table first
            let query: string = `DELETE FROM collection_restaurant WHERE collection_id=${collectionId}`;
            await this.dbService.client.query(query);

            // remove actual collection
            query = `DELETE FROM collections WHERE id=${collectionId}`;
            await this.dbService.client.query(query);


            return {message: 'collection removed'}
        } catch (e) {
            throw e;
        }
    }

    /**
     * add restaurant to selected collection
     * @param uid
     * @param collectionName
     */
    async addItemToCollection(restaurantId: number, collectionId: number) {
        const query: string = `INSERT INTO collection_restaurant ("collection_id", "restaurant_id") VALUES ('${collectionId}', '${restaurantId}')`;
        try {
            await this.dbService.client.query(query);
            return {message: 'restaurant added to the collection'}
        } catch (e) {
            throw e;
        }
    }

    /**
     * remove restaurant to selected collection
     * @param uid
     * @param collectionName
     */
    async removeItemFromCollection(restaurantId: number, collectionId: number) {
        const query: string = `DELETE FROM collection_restaurant WHERE collection_id='${collectionId}' AND restaurant_id='${restaurantId}'`;
        try {
            await this.dbService.client.query(query);
            return {message: 'restaurant removed from the collection'}
        } catch (e) {
            throw e;
        }
    }

    /**
     * show items in collection
     * @param uid
     * @param collectionName
     */
    async getItemsFromCollection(collectionId: number) {
        const query: string = `
SELECT * FROM collections RIGHT JOIN collection_restaurant ON (collections.id=collection_id) LEFT JOIN restaurants ON restaurants.id = collection_restaurant.restaurant_id WHERE collection_id=${collectionId}`;
        try {
            return await this.dbService.client.query(query);
        } catch (e) {
            throw e;
        }
    }
}
