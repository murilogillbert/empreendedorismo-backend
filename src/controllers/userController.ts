import type { Request, Response, NextFunction } from 'express';
import prisma from '../services/prismaService.js';

/**
 * Controller for User related operations.
 */
export class UserController {
    /**
     * List all active users.
     */
    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await prisma.user.findMany({
                where: { active: true },
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    phone: true,
                    roles: true,
                }
            });
            res.json({ success: true, data: users });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get a specific user by ID.
     */
    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const user = await prisma.user.findUnique({
                where: { id: Number(id) },
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    phone: true,
                    roles: true,
                }
            });

            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            res.json({ success: true, data: user });
        } catch (error) {
            next(error);
        }
    }
}
