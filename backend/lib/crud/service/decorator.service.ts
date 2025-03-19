import Console from "@/helpers/console";
import { defaultError, defaultResult } from "./config.service";

/**
 * Decorador para métodos de los servicios
 * @param target 
 * @param propertyKey 
 * @param descriptor 
 * @returns 
 */
export function Service(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    if (typeof originalMethod !== "function") {
        throw new Error(`ServiceHandler debe aplicarse a un método, pero se usó en: ${propertyKey}`);
    }

    descriptor.value = async function (...args: any[]) {

        const className = target.name;
        const formattedClassName = className.replace(/([a-z])([A-Z])/g, "$1 $2");
        const consoleHelper = new Console(formattedClassName);

        try {
            // Ejecutar el servicio
            const result = await originalMethod.apply(this, args);
    
            // Registrar el mensaje correcto basado en el resultado
            return defaultResult(result, consoleHelper);
    
        } catch (error: any) {
            return defaultError(error, consoleHelper);
        }
    };

    return descriptor;
}
