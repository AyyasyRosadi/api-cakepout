import RoleAttributes from "../service/roles/dto"
import Role from "../service/roles/model"
import SystemAttributes from "../service/systems/dto"
import System from "../service/systems/model"
import UserSystem from "../service/userSystems/model"
import UserAttributes from "../service/users/dto"
import User from "../service/users/model"

interface UserSystemAttributes {
    id: number;
    uuid_user: string;
    uuid_sistem: string;
    uuid_role: string;
    super_admin: boolean;
    sistem: SystemAttributes;
    user: UserAttributes;
    role: RoleAttributes;
}


class UserHelper {
    public async getUserByUuid(uuid: string): Promise<UserAttributes | null> {
        const oneUser = User.findOne({ where: { uuid } })
        return oneUser
    }
    public async getUserSystemByUuidUser(uuid_user: string): Promise<Array<UserSystemAttributes>> {
        try {
            const userSystemByUser = await UserSystem.findAll({
                where: { uuid_user },
                include: [
                    { model: System, attributes: ["uuid", "nama_sistem"] },
                    { model: Role, include: ["uuid", "nama_role"] },
                    { model: User, include: ["uuid", "username", "nama", "general_user"] }]
            })
            return userSystemByUser
        } catch (r) {
            return []
        }
    }
    public async getUserByUsername(username: string): Promise<UserAttributes | null> {
        try {
            const oneUser = await User.findOne({
                where: {
                    username,
                },
                include: [{
                    model: UserSystem,
                    attributes: { exclude: ['user_sistem'] },
                }]
            })
            return oneUser
        } catch (r) {
            return null
        }
    }
}

export default new UserHelper