import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
import User from '../models/user.model.js';

const authorize = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            let token;
            if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
                token = req.headers.authorization.split(' ')[1];
            }
            if(!token) {
                return res.status(401).json({
                    success: false,
                    message: 'Unothorized access'
                });
            }
            const decoded = jwt.verify(token, JWT_SECRET);
            const user = await User.findById(decoded.id);
            if(!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }
            if(!allowedRoles.includes(user.role)) {
                return res.status(403).json({
                    success: false,
                    message: 'Forbidden access'
                });
            }
            req.user = user;
            next();
        } catch (error) {
            res.status(401).json({
                success: false,
                message: 'Unothorized access'
            });
        }
    }
}
export default authorize;