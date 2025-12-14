import fs from "node:fs";
import {execSync} from "node:child_process";

fs.watch('./src', {recursive: true}, (eventType, fileName) => {
    if (fileName) {
        console.info(eventType, fileName)
        if (!fs.existsSync(`../app-admin/src-common`)) {
            fs.mkdirSync(`../app-admin/src-common`)
        }
        execSync(`shx cp -r ./src/* ../app-admin/src-common/`, {encoding: 'utf-8'})
    }
})
