import type { Request, Response, NextFunction } from 'express';
/**
 * Controller for Administrative/Management operations.
 * Most methods expect a restaurantId to be provided, usually verified by middleware.
 */
export declare class ManagerController {
    /**
     * Update restaurant configuration and policies.
     */
    static updateSettings(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Add a staff member to the restaurant.
     */
    static addStaff(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * List all staff of a restaurant.
     */
    static listStaff(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Create a new menu item.
     */
    static createMenuItem(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * List menu items for the restaurant.
     */
    static listMenuItems(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Add a physical table to the restaurant.
     */
    static createTable(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get basic analytics for the restaurant.
     */
    static getAnalytics(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=managerController.d.ts.map