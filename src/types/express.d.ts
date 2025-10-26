import { JwtPayload } from './jwt_type';

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}
