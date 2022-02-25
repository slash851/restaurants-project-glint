import {controller, httpGet} from 'inversify-express-utils';
import {inject} from 'inversify';
import {UserService} from '../service/user.service';
import TYPES from '../constant/types';


/**
 * @controller
 */
@controller('/user')
export class UserController {
    constructor(@inject(TYPES.UserService) private userService: UserService) {
    }

    @httpGet('/')
    public getUsers(): Promise<any> {
        return this.userService.getUsers();
    }

    // @httpPut('/:id')
    // public updateUser(request: Request): IUser {
    //     return this.userService.updateUser(request.params.id, request.body);
    // }
}
