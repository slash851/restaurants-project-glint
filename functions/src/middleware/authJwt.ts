const jwt = require('jsonwebtoken');
import {authConfig} from '../conf/auth.config'

export class AuthJwt {
      verifyToken = (req: any, res: any, next: any) => {
            let token = req.headers['x-access-token'];

            if (!token) {
                  return res.status(403).send({
                        message: 'No token provided!',
                  });
            }

            jwt.verify(token, authConfig.secret, (err: Error, decoded: any) => {
                  if (err) {
                        return res.status(401).send({
                              message: 'Unauthorized!',
                        });
                  }
                  req.userId = decoded.id;
                  next();
            });
      };
}
