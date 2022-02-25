// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
import * as functions from 'firebase-functions';

import 'reflect-metadata';
import {InversifyExpressServer} from 'inversify-express-utils';
import {Container} from 'inversify';
import * as bodyParser from 'body-parser';

/* import controllers */
import './controller/home.controller';
import './controller/user.controller';
import './controller/auth.controller';
import './controller/restaurants.controller';
import './controller/collections.controller';

import TYPES from './constant/types';
import {UserService} from './service/user.service';
import {FirebaseService} from './service/firebaseService';
import {DbService} from './service/db.service';
import {CollectionsService} from './service/collections.service';
import {RestaurantsService} from './service/restaurants.service';


import 'dotenv/config';
import {AuthService} from './service/auth.service';

console.log('process.env.DB_URI=', process.env.DB_URI);

const cors = require('cors');

// display version for the server loger
const packageJson = require('./../package.json');
console.log('current version:', packageJson.version);


// load everything needed to the Container
const container = new Container();
container.bind<UserService>(TYPES.UserService).to(UserService);
container.bind<DbService>(TYPES.DBService).to(DbService).inSingletonScope();
container.bind<AuthService>(TYPES.AuthService).to(AuthService).inSingletonScope();
container.bind<RestaurantsService>(TYPES.RestaurantsService).to(RestaurantsService);
container.bind<CollectionsService>(TYPES.CollectionsService).to(CollectionsService);
container.bind<FirebaseService>(TYPES.FirebaseService).to(FirebaseService).inSingletonScope();

// start the server
const server = new InversifyExpressServer(container);

server.setConfig((app) => {
    app.use(bodyParser.urlencoded({
        extended: true,
    }));
    app.use(cors({origin: true}));
    app.options('*', cors());
    app.use(bodyParser.json());
});

const serverInstance = server.build();

// classic server:
// serverInstance.listen(3000);
// console.log('Server started on port 3000 :)');
//

// firebase server
exports.restaurantapi = functions.https.onRequest(serverInstance);
