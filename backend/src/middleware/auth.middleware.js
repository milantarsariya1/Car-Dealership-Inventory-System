"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const error_middleware_1 = require("./error.middleware");
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return next(new error_middleware_1.AppError('Access denied. No token provided.', 401));
    }
    try {
        const secret = process.env.JWT_SECRET || 'car_dealership_super_secret_key_2026';
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        req.user = decoded;
        next();
    }
    catch (error) {
        return next(new error_middleware_1.AppError('Invalid or expired token.', 401));
    }
};
exports.authenticateToken = authenticateToken;
const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new error_middleware_1.AppError('Unauthorized.', 401));
        }
        if (!allowedRoles.includes(req.user.role)) {
            return next(new error_middleware_1.AppError('Forbidden: Insufficient privileges.', 403));
        }
        next();
    };
};
exports.requireRole = requireRole;
