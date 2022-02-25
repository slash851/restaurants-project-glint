import {inject, injectable} from 'inversify';
import {IUser} from '../models/user.model';
import TYPES from '../constant/types';
import {DbService} from './db.service';

// const {Pool} = require('pg');

@injectable()
export class UserService {

    constructor(@inject(TYPES.DBService) private dbService: DbService) {
    }

    /**
     * return
     */
    public async getUsers(): Promise<IUser[]> {
        const query: string = 'SELECT * FROM users';
        return await this.dbService.client.query(query)
    }
}
