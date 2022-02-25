import {injectable} from 'inversify';
import {Environments} from '../conf/environments';
import admin = require('firebase-admin');

export const fromFirebaseConfig: any = Environments.crypto_prod;

/**
 * Firebase Service class
 */
@injectable()
export class FirebaseService {
    initialized = false;
    dbAdmin: any;

    /**
     * constructor
     * initialize firebase
     */
    constructor() {
        if (admin.apps.length === 0) {
            admin.initializeApp({
                credential: admin.credential.cert(fromFirebaseConfig),
                databaseURL: 'https://phi-managed-staging.firebaseio.com',
            });
            this.initialized = true;
            this.dbAdmin = admin.firestore();
        }
    }
}
