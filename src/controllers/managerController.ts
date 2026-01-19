import type { Request, Response, NextFunction } from 'express';
import prisma from '../services/prismaService.js';

/**
 * Controller for Administrative/Management operations.
 * Most methods expect a restaurantId to be provided, usually verified by middleware.
 */
export class ManagerController {

    // --- RESTAURANT SETTINGS ---

    /**
     * Update restaurant configuration and policies.
     */
    static async updateSettings(req: Request, res: Response, next: NextFunction) {
        try {
            const { restaurantId } = req.params;
            const {
                tradeName, description, mainCategory,
                allowsPayBefore, allowsPayAfter, allowsBoth,
                reserva_mesa_paga, reserva_mesa_gratis,
                taxa_servico_percentual
            } = req.body;

            const updated = await prisma.restaurant.update({
                where: { id: Number(restaurantId) },
                data: {
                    tradeName,
                    description,
                    mainCategory,
                    paymentConfig: {
                        update: {
                            allowsPayBefore,
                            allowsPayAfter,
                            allowsBoth,
                            paidTableReservation: reserva_mesa_paga,
                            freeTableReservation: reserva_mesa_gratis,
                            serviceFeePercent: taxa_servico_percentual,
                        }
                    }
                },
                include: { paymentConfig: true }
            });

            res.json({ success: true, data: updated });
        } catch (error) {
            next(error);
        }
    }

    // --- STAFF MANAGEMENT ---

    /**
     * Add a staff member to the restaurant.
     */
    static async addStaff(req: Request, res: Response, next: NextFunction) {
        try {
            const { restaurantId } = req.params;
            const { userId, role } = req.body; // role: GARCOM, GERENTE, COZINHA, BAR

            const staff = await prisma.restaurantEmployee.create({
                data: {
                    restaurantId: Number(restaurantId),
                    userId: Number(userId),
                    role: role,
                }
            });

            res.status(201).json({ success: true, data: staff });
        } catch (error) {
            next(error);
        }
    }

    /**
     * List all staff of a restaurant.
     */
    static async listStaff(req: Request, res: Response, next: NextFunction) {
        try {
            const { restaurantId } = req.params;
            const staff = await prisma.restaurantEmployee.findMany({
                where: { restaurantId: Number(restaurantId) },
                include: { user: { select: { id: true, fullName: true, email: true } } }
            });
            res.json({ success: true, data: staff });
        } catch (error) {
            next(error);
        }
    }

    // --- MENU MANAGEMENT ---

    /**
     * Create a new menu item.
     */
    static async createMenuItem(req: Request, res: Response, next: NextFunction) {
        try {
            const { restaurantId } = req.params;
            const { name, description, price, ingredients } = req.body;

            const item = await prisma.menuItem.create({
                data: {
                    restaurantId: Number(restaurantId),
                    name,
                    description,
                    price,
                    ingredients: ingredients ? {
                        create: ingredients.map((ing: any) => ({
                            ingredientId: ing.ingredientId,
                            quantity: ing.quantity,
                            notes: ing.notes
                        }))
                    } : undefined
                }
            });

            res.status(201).json({ success: true, data: item });
        } catch (error) {
            next(error);
        }
    }

    /**
     * List menu items for the restaurant.
     */
    static async listMenuItems(req: Request, res: Response, next: NextFunction) {
        try {
            const { restaurantId } = req.params;
            const items = await prisma.menuItem.findMany({
                where: { restaurantId: Number(restaurantId) },
                include: { ingredients: { include: { ingredient: true } } }
            });
            res.json({ success: true, data: items });
        } catch (error) {
            next(error);
        }
    }

    // --- TABLE MANAGEMENT ---

    /**
     * Add a physical table to the restaurant.
     */
    static async createTable(req: Request, res: Response, next: NextFunction) {
        try {
            const { restaurantId } = req.params;
            const { identifier, capacity } = req.body;

            const table = await prisma.table.create({
                data: {
                    restaurantId: Number(restaurantId),
                    identifier,
                    capacity,
                }
            });

            res.status(201).json({ success: true, data: table });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get basic analytics for the restaurant.
     */
    static async getAnalytics(req: Request, res: Response, next: NextFunction) {
        try {
            const { restaurantId } = req.params;

            // Top 5 most ordered items (simulated aggregation)
            const topItems = await prisma.orderItem.groupBy({
                by: ['menuItemId'],
                where: { order: { session: { restaurantId: Number(restaurantId) } } },
                _count: { menuItemId: true },
                orderBy: { _count: { menuItemId: 'desc' } },
                take: 5,
            });

            // Busy times (sessions per day of week)
            const sessions = await prisma.session.findMany({
                where: { restaurantId: Number(restaurantId) },
                select: { createdAt: true }
            });

            const dayStats = sessions.reduce((acc: any, s: any) => {
                const day = new Date(s.createdAt).toLocaleDateString('pt-BR', { weekday: 'long' });
                acc[day] = (acc[day] || 0) + 1;
                return acc;
            }, {});

            res.json({
                success: true,
                data: {
                    topItems,
                    busyDays: dayStats
                }
            });
        } catch (error) {
            next(error);
        }
    }
}
