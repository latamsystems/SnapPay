import { NextFunction, Request, Response } from 'express';
import ApiRequest from '@/helpers/apiResponse';

interface HandlerConfig {
    service: (...args: any[]) => Promise<any>
    messages: Record<string, string>
    extractParams?: (req: Request) => any[]
}

/**
 * Decorador para métodos de los controladores
 * @param config 
 * @returns 
 */
export function Controller(config: HandlerConfig): MethodDecorator {
    return (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value

        descriptor.value = (req: Request, res: Response, next: NextFunction) => {
            const params = config.extractParams ? config.extractParams(req) : originalMethod(req)

            return config
                .service(...params, config.messages)
                .then((result: any) => {

                    if (result.error) {
                        return new ApiRequest().handleErrorResponse(res, result)
                    }

                    return new ApiRequest().success(res, result.message, result.data, result.meta)
                })
                .catch((error: Error) => {
                    return new ApiRequest().error(res, error.message)
                })
        }

        return descriptor
    }
}

