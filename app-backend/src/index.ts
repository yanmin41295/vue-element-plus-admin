// Support for top-level await
import {Elysia} from 'elysia'
import {Container} from "./container.ts";
import {Logger} from "@app/common/src/logger.ts";
import knexDb, {createTables} from "./db/index.ts";

await createTables(knexDb);
const app = new Elysia()

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