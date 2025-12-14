import {BaseController} from "../ApiHelper.ts";
import {ApiHandler, Controller} from "../ApiHelper.ts";
import {UserVo} from "../model/User.ts";

@Controller('user')
export default class UserApi extends BaseController {
    @ApiHandler('findUser')
    findByUserId(userInfo: { userId: number }): Promise<UserVo> {
        throw new Error('findByUserId not implemented')
    }
}