import type { Request, Response, NextFunction } from 'express';
/**
 * Controller for User related operations.
 */
export declare class UserController {
    /**
     * List all active users.
     */
    static getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get a specific user by ID.
     */
    static getById(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=userController.d.ts.map