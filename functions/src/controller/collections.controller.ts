import {
    BaseHttpController,
    controller,
    httpDelete,
    httpGet,
    httpPost,
    request,
    response
} from 'inversify-express-utils';
import {inject} from 'inversify';
import * as express from 'express';
import TYPES from '../constant/types';
import {CollectionsService} from '../service/collections.service';
import {ICollection} from '../models/collection.model';
import {AuthService} from '../service/auth.service';

/**
 * @controller
 */
@controller('/collections')
export class CollectionsController extends BaseHttpController {


    @inject(TYPES.CollectionsService) private readonly collectionsService!: CollectionsService;
    @inject(TYPES.AuthService) private readonly authService!: AuthService;

    @httpGet('/')
    @httpGet('/:id')
    public getCollectionsByUserId(@request() req: express.Request, @response() res: express.Response): Promise<ICollection[]> {
        const token = this.httpContext.request.headers['x-auth-token'] || this.httpContext.request.headers.authorization;

        if (!token) {
            res.status(403).send({
                message: 'No token provided!'
            });
        }

        const decodedToken = this.authService.verifyToken(token);
        if (!decodedToken.uid) {
            res.status(403).json({'message': 'Invalid token!'});
        }
        return this.collectionsService.getCollections(decodedToken.uid, req.params.id);
    }

    @httpPost('/')
    public async addCollectionForUser(@request() req: express.Request, @response() res: express.Response) {
        const token = this.httpContext.request.headers['x-auth-token'] || this.httpContext.request.headers.authorization;

        if (!token) {
            res.status(403).send({
                message: 'No token provided!'
            });
        } else if (!req.body.collectionName || req.body.collectionName === '') {
            res.status(403).send({
                message: 'Collection name is required'
            });
        }

        const decodedToken = this.authService.verifyToken(token);
        if (!decodedToken.uid) {
            res.status(403).json({'message': 'Invalid token!'});
        }
        try {
            await this.collectionsService.addCollection(decodedToken.uid, req.body.collectionName);
            res.status(200).json({message: 'Collection added'});
        } catch (e) {
            res.status(403).json({message: 'Collection already exist'});

        }
    }

    @httpDelete('/:id')
    public async removeCollectionById(@request() req: express.Request, @response() res: express.Response) {
        const token = this.httpContext.request.headers['x-auth-token'] || this.httpContext.request.headers.authorization;

        if (!token) {
            res.status(403).send({
                message: 'No token provided!'
            });
        } else if (!req.params.id || req.params.id === '') {
            res.status(403).send({
                message: 'Collection id is required'
            });
        }

        const decodedToken = this.authService.verifyToken(token);
        if (!decodedToken.uid) {
            res.status(403).json({'message': 'Invalid token!'});
        }
        try {
            await this.collectionsService.removeCollection(Number(req.params.id));
            res.status(200).json({message: 'Collection removed'});
        } catch (e) {
            res.status(403).json({message: 'Cant connect that collection'});

        }
    }

    @httpPost('/add_item_to_collection/')
    public async addItemToCollection(@request() req: express.Request, @response() res: express.Response) {
        const token = this.httpContext.request.headers['x-auth-token'] || this.httpContext.request.headers.authorization;

        if (!token) {
            res.status(403).send({
                message: 'No token provided!'
            });
        } else if (!req.body.collectionId || !req.body.restaurantId) {
            res.status(403).send({
                message: 'CollectionId and RestaurantId need to be provided'
            });
        }

        const decodedToken = this.authService.verifyToken(token);
        if (!decodedToken.uid) {
            res.status(403).json({'message': 'Invalid token!'});
        }
        try {
            await this.collectionsService.addItemToCollection(req.body.restaurantId, req.body.collectionId);
            res.status(200).json({message: 'Item added to collection'});
        } catch (e) {
            res.status(403).json({message: 'Operation failed.'});

        }
    }

    @httpDelete('/remove_item_from_collection/:id')
    public async removeItemFromCollection(@request() req: express.Request, @response() res: express.Response) {
        const token = this.httpContext.request.headers['x-auth-token'] || this.httpContext.request.headers.authorization;

        if (!token) {
            res.status(403).send({
                message: 'No token provided!'
            });
        } else if (!req.body.collectionId || !req.body.restaurantId) {
            res.status(403).send({
                message: 'CollectionId and RestaurantId need to be provided'
            });
        }

        const decodedToken = this.authService.verifyToken(token);
        if (!decodedToken.uid) {
            res.status(403).json({'message': 'Invalid token!'});
        }
        try {
            await this.collectionsService.removeItemFromCollection(req.body.restaurantId, req.body.collectionId);
            res.status(200).json({message: 'Item removed from collection'});
        } catch (e) {
            res.status(403).json({message: 'Operation failed.'});

        }
    }

    @httpGet('/get_items_from_collection/:id')
    public async getItemsFromCollection(@request() req: express.Request, @response() res: express.Response) {
        if (!req.params.id) {
            res.status(403).json({message: 'Missing parameter id'})
        }
        const token = this.httpContext.request.headers['x-auth-token'] || this.httpContext.request.headers.authorization;

        // only logged user can get items
        if (!token) {
            res.status(403).send({
                message: 'No token provided!'
            });
        }

        const decodedToken = this.authService.verifyToken(token);
        if (!decodedToken.uid) {
            res.status(403).json({'message': 'Invalid token!'});
        }
        try {
            const items: any = await this.collectionsService.getItemsFromCollection(Number(req.params.id));
            res.status(200).json(items.rows);
        } catch (e) {
            res.status(403).json({message: 'Operation failed.'});

        }
    }


}
