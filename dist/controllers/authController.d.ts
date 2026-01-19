import type { Request, Response, NextFunction } from 'express';
/**
 * Controller for Authentication operations.
 */
export declare class AuthController {
    /**
     * Register a new user.
     */
    static register(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Login user and return JWT.
     */
    static login(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=authController.d.ts.map