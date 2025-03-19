import { NextFunction, Request, Response } from "express";

/**
 * Función para manejar errores asíncronos en Express
 * @param fn - Función asíncrona
 * @returns Promise
 */
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;