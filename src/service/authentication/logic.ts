import userHelper from "../../helper/user";
import { ActionAttributes } from "../interfaces";
import bcrypt from "bcrypt"
import { v4 } from "uuid";
import jwt from 'jsonwebtoken'
import UserSystemAttributes from "../userSystem/dto";
import BlacklistToken from "../blacklistToken/model";
import message from "../../helper/message";

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
            return message.sendMessage(false)
        }
    }
    public async logout(jti: string): Promise<ActionAttributes> {
        try {
            await BlacklistToken.create({ jti })
            return message.sendMessage(true)
        } catch (_) {
            return message.sendMessage(false)
        }
    }
}

export default new AuthenticationLogic