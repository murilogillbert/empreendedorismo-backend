import type { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../services/prismaService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

/**
 * Controller for Authentication operations.
 */
export class AuthController {
    /**
     * Register a new user.
     */
    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const { fullName, email, phone, password } = req.body;

            // Check if user already exists
            const existingUser = await prisma.user.findUnique({
                where: { email },
            });

            if (existingUser) {
                return res.status(400).json({ success: false, message: 'User already exists' });
            }

            // Hash password
            const passwordHash = await bcrypt.hash(password, 10);

            // Create user
            const user = await prisma.user.create({
                data: {
                    fullName,
                    email,
                    phone,
                    passwordHash,
                },
            });

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: { id: user.id, email: user.email },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Login user and return JWT.
     */
    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;

            // Find user
            const user = await prisma.user.findUnique({
                where: { email },
                include: { roles: { include: { role: true } } },
            });

            if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }

            // Generate JWT
            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    roles: user.roles.map((r: any) => r.role.name)
                },
                JWT_SECRET,
                { expiresIn: '1d' }
            );

            res.json({
                success: true,
                token,
                data: {
                    id: user.id,
                    fullName: user.fullName,
                    email: user.email,
                    roles: user.roles.map((r: any) => r.role.name),
                },
            });
        } catch (error) {
            next(error);
        }
    }
}
