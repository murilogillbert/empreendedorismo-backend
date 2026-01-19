import type { Request, Response, NextFunction } from 'express';
/**
 * Controller for Restaurant related operations.
 */
export declare class RestaurantController {
    /**
     * List all active restaurants.
     */
    static getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get a specific restaurant by ID.
     */
    static getById(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Create a new restaurant.
     */
    static create(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=restaurantController.d.ts.map