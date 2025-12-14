// Support for top-level await
import {Elysia} from 'elysia'
import {Container} from "./container.ts";
import {Logger} from "app-common/src/logger.js";
import knexDb, {createTables} from "./db/index.js";

await createTables(knexDb);
const app = new Elysia()

// 添加响应拦截器统一包装响应
app.onAfterHandle(({response}) => {

    // 如果响应已经是统一格式，直接返回
    if (response && typeof response === 'object' && ('code' in response || 'data' in response)) {
        return response;
    }
    // 统一包装响应格式
    return {
        code: 200,
        message: 'success',
        data: response
    };
});

// 添加错误处理拦截器
app.onError(({code, error}) => {
    return {
        code: code === 'VALIDATION' ? 400 : 500,
        message: (error as Error).message || 'Internal Server Error',
        data: null
    };
});
// 添加测试API端点用于验证数据库连接
app.get("/health", () => ({status: "OK", timestamp: new Date()}))
const container = new Container();
await container.load("./controller")

Logger.info("Loaded lambdas:", container.lambdaMap)
container.lambdaMap.forEach(([func, instance, methodName], lambdaPath) => {
    Logger.info(`Registering lambda: ${lambdaPath}`)
    app.post(`/${lambdaPath.split('-').join('/')}`, async (req) => {
        return await func.call(instance, req.body)
    })
})

app.listen(3000)
Logger.info(
    `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
)