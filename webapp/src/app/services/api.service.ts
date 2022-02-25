import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import IUser from '../models/user.model'
import IAuthResponse from '../models/auth.response.model';
import {AuthService} from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    constructor(private httpClient: HttpClient,
                private authService: AuthService) {
    }

    /**
     * get list of restaurants
     * @param searchVariables - search criteria
     */
    public getListOfRestaurants(searchVariables: {}): Observable<any> {
        return this.httpClient.post(environment.apiBaseUrl + environment.endpoints.restaurant, searchVariables);
    }

    /**
     * add collection
     * @param collectionName
     */
    public addCollection(collectionName: string): Observable<any> {
        return this.httpClient.post(environment.apiBaseUrl + environment.endpoints.collections, {collectionName: collectionName}, {headers: this.setTokenInHeaders()});
    }

    /**
     * get items from collection
     * @param collectionId
     */
    public getItemsFromCollection(collectionId: number): Observable<any> {
        return this.httpClient.get(environment.apiBaseUrl + environment.endpoints.getItemsFromCollection + collectionId, {headers: this.setTokenInHeaders()})
    }

    /**
     * add item to collection
     * @param restaurantId
     * @param collectionId
     */
    public addItemToCollection(restaurantId:number, collectionId: number): Observable<any> {
        return this.httpClient.post(environment.apiBaseUrl + environment.endpoints.addItemToCollection,{restaurantId: restaurantId, collectionId: collectionId}, {headers: this.setTokenInHeaders()})
    }

    /**
     * remove item from collection
     * @param restaurantId
     * @param collectionId
     */
    public removeItemFromCollection(restaurantId:number, collectionId: number): Observable<any> {
        return this.httpClient.delete(environment.apiBaseUrl + environment.endpoints.removeItemFromCollection + collectionId,{headers: this.setTokenInHeaders(), body: {restaurantId: restaurantId, collectionId: collectionId}})
    }

    /**
     * remove collection by id
     * @param id
     */
    public removeCollection(id: number): Observable<any> {
        return this.httpClient.delete(environment.apiBaseUrl + environment.endpoints.collections + `/${id}`, {
            headers: this.setTokenInHeaders()
        });
    }

    /**
     * get list of users from collection
     */
    public getListUserCollections(): Observable<any> {
        return this.httpClient.get(environment.apiBaseUrl + environment.endpoints.collections, {headers: this.setTokenInHeaders()});
    }

    /**
     * login
     * @param user
     * @return token and email of user
     */
    public login(user: IUser): Observable<IAuthResponse> {
        return this.httpClient.post<IAuthResponse>(environment.apiBaseUrl + environment.endpoints.auth.login, user);
    }

    /**
     * user registration
     * @param user
     */
    public register(user: IUser): Observable<any> {
        return this.httpClient.post<any>(environment.apiBaseUrl + environment.endpoints.auth.register, user);
    }

    /**
     * util function to set bearer token in headers for required functions
     * @private
     */
    private setTokenInHeaders(): HttpHeaders {
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.authService.getToken()
        });
    }
}
