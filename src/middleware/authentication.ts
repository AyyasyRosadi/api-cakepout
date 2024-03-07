import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import BlacklistToken from "../services/blacklistTokens/model";
import UserAttributes from "../services/users/dto";
import User from "../services/users/model";
import PtkAttributes from "../services/ptk/dto";
import Ptk from "../services/ptk/model";
import UserSystem from "../services/userSystems/model";
import System from "../services/systems/model";
import Role from "../services/roles/model";
import SystemAttributes from "../services/systems/dto";
import RoleAttributes from "../services/roles/dto";

interface UserSystemAttributes {
    id: number;
    uuid_user: string;
    uuid_sistem: string;
    uuid_role: string;
    super_admin: boolean;
    sistem: SystemAttributes;
    user: UserAttributes,
    role: RoleAttributes
}

class Authentication {
    // private async getPtk(nupy: string): Promise<PtkAttributes | null> {
    //     const onePtk = Ptk.findOne({ where: { nupy } })
    //     return onePtk
    // }
    private async getUser(uuid: string): Promise<UserAttributes | null> {
        const oneUser = User.findOne({ where: { uuid } })
        return oneUser
    }
    private async getUserSystem(uuid_user: string): Promise<Array<UserSystemAttributes>> {
        const userSystemByUser = await UserSystem.findAll({ where: { uuid_user }, include: [{ model: System, attributes: ["uuid", "nama_sistem"] }, { model: Role, include: ["uuid", "nama_role"] }, { model: User, include: ["uuid", "username", "nama", "general_user"] }] })
        return userSystemByUser
    }

    public authenticationUser(allowedSystem: string[], allowedRole: string[]): (req: Request, res: Response, next: NextFunction) => Promise<Response | void> {
        return async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
            const splitter = req.headers.authorization?.split(' ')
            if (splitter?.length !== 2 || splitter[0] !== "Bearer") {
                return res.status(401).json({ msg: 'Unauthorized' })
            }
            try {
                const token = jwt.verify(splitter[1], process.env['SECRET_KEY']!)
                if (typeof (token) === 'string') {
                    return res.status(401).json({ msg: 'Unauthorized' })
                }
                const blacklistToken = await BlacklistToken.findOne({ where: { jti: token?.jti } })
                const user = await this.getUser(token.uuid)
                if (blacklistToken || !user) {
                    return res.status(401).json({ msg: "Unauthorized" })
                }
                // const ptk = await this.getPtk(user.username)
                const userSystem = await this.getUserSystem(user.uuid)
                if (!userSystem.some((e) => allowedSystem.includes(e.sistem.nama_sistem) && allowedRole.includes(e.role.nama_role))) {
                    return res.status(401).json({ msg: "Unauthorized" })
                }
                req.app.locals.token = token;
                req.app.locals.user = {
                    uuid: user.uuid,
                    general_user: user.general_user,
                    password: user.password
                }
                req.app.locals.system = userSystem.map(e => {
                    return {
                        uuid_sistem: e.uuid_sistem,
                        nama_sistem: e.sistem.nama_sistem,
                        uuid_role: e.uuid_role,
                        nama_role: e.role.nama_role,
                        super_admin: e.super_admin
                    }
                })

            } catch (e) {
                return res.status(401).json({ msg: "Unauthorized" })
            }
            next()
        }
    }
    public authenticationSuperAdmin(allowedSistem: string[]): (req: Request, res: Response, next: NextFunction) => Promise<Response | void> {
        return async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
            if (!req.app.locals.system.some((e: { nama_sistem: string, super_admin: boolean }) => allowedSistem.includes(e.nama_sistem) && e.super_admin)) {
                return res.status(401).json({ msg: "Unauthorized" })
            }
            next()
        }
    }
    public authenticationGeneralUser(req: Request, res: Response, next: NextFunction): Response | void {
        if (!req.app.locals.user.general_user) {
            return res.status(401).json({ msg: "Unauthorized" })
        }
        next()
    }
}

export default new Authentication