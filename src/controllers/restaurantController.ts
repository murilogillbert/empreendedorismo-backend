import type { Request, Response, NextFunction } from 'express';
import prisma from '../services/prismaService.js';

/**
 * Controller for Restaurant related operations.
 */
export class RestaurantController {
    /**
     * List all active restaurants.
     */
    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const restaurants = await prisma.restaurant.findMany({
                where: { active: true },
                include: {
                    tables: true,
                    paymentConfig: true,
                }
            });
            res.json({ success: true, data: restaurants });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get a specific restaurant by ID.
     */
    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const restaurant = await prisma.restaurant.findUnique({
                where: { id: Number(id) },
                include: {
                    tables: true,
                    menuItems: true,
                    paymentConfig: true,
                }
            });

            if (!restaurant) {
                return res.status(404).json({ success: false, message: 'Restaurant not found' });
            }

            res.json({ success: true, data: restaurant });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Create a new restaurant.
     */
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { tradeName, cnpj, mainCategory, city, state } = req.body;
            const newRestaurant = await prisma.restaurant.create({
                data: {
                    tradeName,
                    cnpj,
                    mainCategory,
                    city,
                    state,
                    paymentConfig: {
                        create: {} // Default config
                    }
                }
            });
            res.status(201).json({ success: true, data: newRestaurant });
        } catch (error) {
            next(error);
        }
    }
}
