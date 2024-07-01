import userHelper from "../../helper/user";
import bcrypt from "bcrypt"
import { v4 } from "uuid";
import jwt from 'jsonwebtoken'
import UserSystemAttributes from "../userSystem/dto";
import BlacklistToken from "../blacklistToken/model";
import { LogicBase, defaultMessage, messageAttribute } from "../logicBase";
import BcryptHelper from "../../helper/bcrypt";

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


class AuthenticationLogic extends LogicBase {

    public async login(username: string, password: string, system: string): Promise<messageAttribute<defaultMessage | LoginAttributes>> {
        try {
            const user = await userHelper.getUserByUsername(username)
                if (!user || !await BcryptHelper.compare(password,user.password) || !user.user_sistems?.some((val) => val.sistem?.nama_sistem === system)) {
                return this.message(404, { message: "User tidak ditemukan" })
            }
            const jti = v4()
            const token = jwt.sign(
                {
                    uuid: user.uuid
                },
                process.env['SECRET_KEY']!,
                { jwtid: jti, expiresIn: '6h' }
            )
            return this.message(200, { status: true, user: { nama: user.nama, username: user.username, sistem: user.user_sistems?.find((e) => e.sistem?.nama_sistem === system)!, generalUser: user.general_user, apakahInstituion: user.user_apakah?.no_lembaga }, token: token })
        } catch (_) {
            return this.message(403, { message: "Gagal" })
        }
    }
    public async logout(jti: string): Promise<messageAttribute<defaultMessage>> {
        try {
            await BlacklistToken.create({ jti })
            return this.message(200, { message: "Logout berhasil" })
        } catch (_) {
            return this.message(403, { message: "Gagal" })
        }
    }
}

export default new AuthenticationLogic