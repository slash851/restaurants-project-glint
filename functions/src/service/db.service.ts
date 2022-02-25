import {injectable} from 'inversify';
const {Pool} = require('pg');

@injectable()
export class DbService {
    private readonly _client: any;

    public get client(): any {
        return this._client;
    }

    constructor() {
        this._client = new Pool({
            connectionString: process.env.DB_URI,
            ssl: {
                rejectUnauthorized: false,
            }
        });
    }
}
