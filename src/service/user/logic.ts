import { LogicBase, messageAttribute } from "../logicBase";
import UserApakah from "../userApakah/model";
import UserSystem from "../userSystem/model";
import UserAttributes from "./dto";
import User from "./model";


class UserLogic extends LogicBase {
    public async getAllUser(): Promise<messageAttribute<UserAttributes[]>> {
        return this.message(200, await User.findAll({ include: [{ model: UserSystem }, { model: UserApakah, required: false, as: 'user_apakah' }] }))
    }
}