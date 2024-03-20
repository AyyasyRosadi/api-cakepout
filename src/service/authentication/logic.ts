import userHelper from "../../helper/user";
import { ActionAttributes } from "../interfaces";
import bcrypt from "bcrypt"
import { v4 } from "uuid";
import jwt from 'jsonwebtoken'
import UserSystemAttributes from "../userSystems/dto";
import RoleAttributes from "../roles/dto";
import BlacklistToken from "../blacklistTokens/model";

interface LoginAttributes {
    status: boolean,
    token: string,
    user: {
        nama: string,
        username: string,
        sistem: UserSystemAttributes,
        generalUser: boolean
    }
}

const systemName = 'cakepout'

class AuthenticationLogic {

    public async login(username: string, password: string): Promise<ActionAttributes | LoginAttributes> {
        try {
            const user = await userHelper.getUserByUsername(username)
            if (!user || !await bcrypt.compare(password, user.password)) {
                return { status: false, message: 'user not found' }
            }
            const jti = v4()
            const token = jwt.sign(
                {
                    uuid: user.uuid
                },
                process.env['SECRET_KEY']!,
                { jwtid: jti, expiresIn: '6h' }
            )
            return { status: true, user: { nama: user.nama, username: user.username, sistem: user.user_sistems?.find((e) => e.sistem?.nama_sistem === systemName)!, generalUser: user.general_user }, token: token }
        } catch (_) {
            return { status: false, message: 'bad request' }
        }
    }
    public async logout(jti: string): Promise<ActionAttributes> {
        try {
            await BlacklistToken.create({ jti })
            return { status: true, message: 'logout succes' }
        } catch (_) {
            return { status: false, message: 'bad request' }
        }
    }
}

export default new AuthenticationLogic