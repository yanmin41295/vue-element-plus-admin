import {add} from "@app/common/src"

Bun.serve({
    port: 3001,
    routes: {
        '/test/:function': async req => {
            const sum = add(3, 3)
            return new Response(`Hello User ${req.params.function}! ${sum}`);
        },
    }
})
