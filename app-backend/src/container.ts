import 'reflect-metadata';
import {glob} from "glob";
import path from "node:path";
import {BaseController, Constructor, controllerKey, requestMappingKey} from "app-common/src/api/ApiHelper.js";

async function checkIfExportsSubclass(module: any, baseClass: any): Promise<boolean> {
    try {
        // 获取默认导出
        const exported = module.default;

        // 检查是否为类且是目标类的子类
        return typeof exported === 'function' &&
            exported.prototype instanceof baseClass &&
            exported !== baseClass; // 排除自身
    } catch (error) {
        console.error('检查文件导出时出错:', error);
        return false;
    }
}

export interface SpiLoader<T> {
    load(packagePath: string): Promise<T>;
}

export class Container implements SpiLoader<Map<string, [Function, any, string]>> {
    lambdaMap: Map<string, [Function, any, string]> = new Map();

    async load(packagePath: string, packageRootPath: string = path.join(process.cwd(), './src')): Promise<Map<string, [Function, any, string]>> {
        let scanPath = path.normalize(path.join(packageRootPath, packagePath, './**/*.{ts,js}')).replace(/\\/g, '/');
        const files = await glob(scanPath)
        for (const file of files) {
            const module = await this.resolveImportPath(path.normalize(path.relative(__dirname, file)).replace(/\\/g, '/'));
            if (!await checkIfExportsSubclass(module, BaseController)) {
                continue
            }
            for (const exported of Object.values(module)) {
                const controller = exported as Constructor<BaseController>
                if (typeof exported === 'function' && Reflect.getMetadata(controllerKey, controller)) {
                    let LambdaService = exported as Constructor<BaseController>
                    const controllerPath = Reflect.getMetadata(controllerKey, LambdaService);
                    for (const propertyName of Object.getOwnPropertyNames(LambdaService.prototype)) {
                        if (propertyName === 'constructor') {
                            continue
                        }
                        const routePath = Reflect.getMetadata(requestMappingKey, LambdaService.prototype, propertyName)
                        const lambdaService = new LambdaService()
                        //@ts-ignore
                        this.lambdaMap.set(`${controllerPath}-${routePath}`, [lambdaService[propertyName], lambdaService, propertyName])
                    }
                }
            }
        }
        return this.lambdaMap;
    }

    callLambda(routerPath: string, body: any): Promise<any> {
        const lambda = this.lambdaMap.get(routerPath)
        if (!lambda) {
            throw new Error(`Lambda ${routerPath} not found`)
        }
        return lambda[0].call(lambda[1], body)
    }

    async resolveImportPath(file: string) {
        return import("./" + file)
    }
}