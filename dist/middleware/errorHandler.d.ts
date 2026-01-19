import type { Request, Response, NextFunction } from 'express';
/**
 * Centralized error handler middleware.
 * Captures all errors thrown in the application and returns a consistent JSON response.
 */
export declare const errorHandler: (err: any, req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=errorHandler.d.ts.map