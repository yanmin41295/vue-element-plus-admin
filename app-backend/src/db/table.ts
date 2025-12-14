import {UserVo} from "@app/common/src/api/model/User.ts";
import knexDb from "./index.ts";

export const userTable = () => knexDb.table<UserVo>('users')