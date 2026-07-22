"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../config/prisma"));
const error_middleware_1 = require("../middleware/error.middleware");
const client_1 = require("../generated/client");
class AuthService {
    static async register(dto) {
        if (!dto.email || !dto.password || !dto.name) {
            throw new error_middleware_1.AppError('Name, email, and password are required', 400);
        }
        const existingUser = await prisma_1.default.user.findUnique({
            where: { email: dto.email },
        });
        if (existingUser) {
            throw new error_middleware_1.AppError('Email is already registered', 400);
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash(dto.password, salt);
        const user = await prisma_1.default.user.create({
            data: {
                name: dto.name,
                email: dto.email,
                password: passwordHash,
                role: dto.role || client_1.Role.USER,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return user;
    }
    static async login(dto) {
        if (!dto.email || !dto.password) {
            throw new error_middleware_1.AppError('Email and password are required', 400);
        }
        const user = await prisma_1.default.user.findUnique({
            where: { email: dto.email },
        });
        if (!user) {
            throw new error_middleware_1.AppError('Invalid credentials', 401);
        }
        const isMatch = await bcryptjs_1.default.compare(dto.password, user.password);
        if (!isMatch) {
            throw new error_middleware_1.AppError('Invalid credentials', 401);
        }
        const secret = process.env.JWT_SECRET || 'car_dealership_super_secret_key_2026';
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, secret, { expiresIn: '24h' });
        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    }
}
exports.AuthService = AuthService;
