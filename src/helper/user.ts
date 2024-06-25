import RoleAttributes from "../service/role/dto"
import Role from "../service/role/model"
import SystemAttributes from "../service/system/dto"
import System from "../service/system/model"
import UserSystem from "../service/userSystem/model"
import UserAttributes from "../service/user/dto"
import User from "../service/user/model"
import UserApakah from "../service/userApakah/model"
import { Op } from "sequelize"

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
        const oneUser = User.findOne({
            where: { uuid },
            include: [
                {
                    model: UserApakah,
                    as: "user_apakah",
                    where: { no_lembaga: { [Op.not]: null } },
                    required: false,
                }
            ],
        })
        return oneUser
    }
    public async getUserSystemByUuidUser(uuid_user: string): Promise<Array<UserSystemAttributes>> {
        try {
            const userSystemByUser = await UserSystem.findAll({
                where: { uuid_user },
                attributes: ['uuid_user'],
                include: [
                    { model: System, attributes: ["uuid", "nama_sistem"] },
                    { model: Role, attributes: ["uuid", "nama_role"] },
                    { model: User, attributes: ["uuid", "username", "nama", "general_user"] }]
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
                    attributes: ['super_admin'],
                    include: [{
                        model: System,
                        attributes: ['nama_sistem']
                    }, {
                        model: Role,
                        attributes: ['nama_role']
                    }]
                }, {
                    model: UserApakah,
                    as: "user_apakah",
                    where: { no_lembaga: { [Op.not]: null } },
                    required: false,
                }]
            })
            return oneUser
        } catch (r) {
            return null
        }
    }
}

export default new UserHelper