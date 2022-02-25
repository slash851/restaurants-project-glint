// src/app/auth/auth.service.ts
import {Injectable} from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';
import {BehaviorSubject} from 'rxjs';
import IAuthResponse from '../models/auth.response.model';

@Injectable({
    providedIn: 'root',
})
export class AuthService {

    public authSubject: BehaviorSubject<any>;


    constructor(public jwtHelper: JwtHelperService) {
        this.authSubject = new BehaviorSubject<any>(null);
        this.authSubject.subscribe((authReponse: IAuthResponse) => {
            if (authReponse && authReponse.token) {
                localStorage.setItem('token', authReponse.token);
            }
        })
    }


    /**
     * auth guard protector
     * @return {boolean} if user is authenticated returns true
     */
    public isAuthenticated(): boolean {
        const token = localStorage.getItem('token') || undefined;
        // Check whether the token is expired and return
        // true or false
        const isTokenValid = !this.jwtHelper.isTokenExpired(token);
        if (!isTokenValid) {
            this.authSubject.next(null);
        }
        return isTokenValid;
    }

    /**
     * get token
     * @return returns valid token if not expired, if expired returns text 'token expired'
     */
    public getToken(): string {
        const token = localStorage.getItem('token') || '';
        return this.jwtHelper.isTokenExpired(token) ? 'token expired' : token;
    }

    /**
     * logout user
     */
    public logout(): string {
        localStorage.clear();
        this.authSubject.next(null);
        return 'User logged out';
    }
}
