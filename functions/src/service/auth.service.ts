import {inject, injectable} from 'inversify';
import TYPES from '../constant/types';
import {IUser} from '../models/user.model';
import {DbService} from './db.service';
import {authConfig} from '../conf/auth.config';
import bcrypt = require('bcryptjs');
import jwt = require('jsonwebtoken');

@injectable()
export class AuthService {

    constructor(@inject(TYPES.DBService) private dbService: DbService) {
    }

    /**
     * add new collection for user
     * @param {IUser} user
     */

    public signUp(user: IUser): Promise<any> {

        // hash the password so its not visible in db
        let password = bcrypt.hashSync(user.password, 8)

        const query: string = `insert into users ("email","password","createdAt","updatedAt") values ('${user.email}','${password}',current_timestamp,current_timestamp)`;

        return this.dbService.client.query(query).then(() => {
            return {response: 'User created'};
        }).catch((error: any) => {
            console.log(error);
            throw error;
        });
    }

    public async signIn(email: string, password: string): Promise<any> {
        const getUserQuery: string = `SELECT * FROM users WHERE "email" = '${email}'`;
        let response;
        try {
            response = await this.dbService.client.query(getUserQuery);
        } catch (e) {
            throw e;
        }


        if (response.rows.length === 0)
            throw Error('User Not found.');

        //todo: map to IUser
        let user = response.rows[0]

        let passwordIsValid = bcrypt.compareSync(
            password,
            user.password
        );

        if (!passwordIsValid) {
            throw Error('Invalid password');
        }

        const token = jwt.sign({id: user.id}, authConfig.secret, {
            expiresIn: 86400 // 24 hours
        });

        return {token: token, email: email}

    }

    verifyToken(token: string | string[] | undefined): any {
        if (!token || typeof token !== 'string') return null
        token = token.replace('Bearer ', '');
        return jwt.verify(token, authConfig.secret, (err, jwtResponse: any) => {
            if (err) {
                return {
                    message: 'Unauthorized!',
                    verified: false,
                    uid: null
                };
            }
            return {
                message: 'Authorized!',
                verified: true,
                uid: jwtResponse.id
            };
        });
    }
}

