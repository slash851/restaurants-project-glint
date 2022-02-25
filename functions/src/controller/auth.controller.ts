import {controller, httpPost, request, response} from 'inversify-express-utils';
import {inject} from 'inversify';
import * as express from 'express';
import TYPES from '../constant/types';
import {AuthService} from '../service/auth.service';
import {IUser} from '../models/user.model';

/**
 * @controller
 */
@controller('/auth')
export class AuthController {
    constructor(@inject(TYPES.AuthService) private authService: AuthService) {
    }

    @httpPost('/signin')
    public async signIn(@request() req: express.Request, @response() res: express.Response) {
        const user: IUser = req.body;
        if (!user.email || !user.password) {
            res.status(400).json({response: 'User or password missing'});
        }
        try {
            const signInResponse: any = await this.authService.signIn(user.email, user.password);
            res.status(200).json(signInResponse);
        } catch (err) {
            res.status(403).json({message: 'Incorrect user or password'});
        }
    }

    @httpPost('/signup')
    public signUp(@request() req: express.Request, @response() res: express.Response): Promise<any> {
        const user: IUser = req.body
        if (!user.email || !user.password) {
            res.status(400).json({message: 'User or password missing'})
        }
        return this.authService.signUp(user).then((signedResponse: any) => {
            res.status(200).json(signedResponse);
        }).catch((e: any) => {
            console.log(e);
            res.status(403).json({message: 'User already exist'})
        });
    }

}
