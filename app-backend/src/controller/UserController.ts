import {userTable} from "../db/table.js";
import UserApi from "app-common/src/api/controller/UserApi.js";
import {UserVo} from "app-common/src/api/model/User.js";

export default class UserController extends UserApi {

    async findByUserId(userInfo: { userId: number }): Promise<UserVo> {
        // 直接使用类属性 usersTable，无需每次都调用 knexDb.table('users')
        const users = await userTable().where('id', userInfo.userId);
        const user = users[0] as UserVo;
        if (user) {
            return {id: user.id, username: user.username, email: user.email};
        } else {
            return {id: userInfo.userId, username: 'user', email: 'user@email.com'};
        }
    }
}