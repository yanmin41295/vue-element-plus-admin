import knexDb from "./index.ts";
import {UserVo} from "app-common/src/api/model/User.js";

export const userTable = () => knexDb.table<UserVo>('users')