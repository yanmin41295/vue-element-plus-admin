import 'reflect-metadata';

export const controllerKey = '$controller';
export const requestMappingKey = '$requestMapping';

export abstract class BaseController {
    [key: string]: Function
}

export type  Constructor<T = any> = new (...args: any[]) => T;
export type MethodNames<T> = {
    [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never
}[keyof T];

export function ApiHandler(path: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata(requestMappingKey, path, target, propertyKey);
    };
}

export function Controller(path: string) {
    return function (target: any) {
        Reflect.defineMetadata(controllerKey, path, target);
    };
}