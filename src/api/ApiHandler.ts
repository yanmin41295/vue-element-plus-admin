import axios from "axios";
import {BaseController, Constructor, controllerKey, requestMappingKey} from "../../src-common/api/ApiHelper";
import UserApi from "../../src-common/api/controller/UserApi";
import {Logger} from "../../src-common/logger";

const service = axios.create({
    baseURL: import.meta.env.PROD ? '' : "/api"
})
service.interceptors.response.use(
    (response) => {
        return response.data.data
    },
    (error) => {
        return Promise.reject(error)
    }
)
function creteApiClient<T extends BaseController>(api: Constructor<T>): T {
    let apiInstance = new api()
    const controller = Reflect.getMetadata(controllerKey, api)
    return new Proxy(apiInstance, {
        get(target: T, prop: string, receiver: any): any {
            // 获取原始属性
            const original = target[prop];
            // 如果是构造函数或非函数属性，直接返回
            if (prop === 'constructor' || typeof original !== 'function') {
                return original;
            }
            const method = Reflect.getMetadata(requestMappingKey, target, prop)
            Logger.info('ApiClientProxy', controller, method)
            // 为方法创建代理
            return async (body: any) => {
                // 在 map 中查找对应的方法映射
                return await service.request({
                    method: 'post',
                    url: `/${controller}/${method}`,
                    data: body,
                });
            };
        }
    })
}

export const userApi = creteApiClient(UserApi)



