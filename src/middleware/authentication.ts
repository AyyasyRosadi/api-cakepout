import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import BlacklistToken from "../service/blacklistToken/model";
import userHelper from "../helper/user";


class Authentication {
    public authenticationUser(systems: string[], allowedRole: string[]): (req: Request, res: Response, next: NextFunction) => Promise<Response | void> {
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
                const user = await userHelper.getUserByUuid(token.uuid)
                if (blacklistToken || !user) {
                    return res.status(401).json({ msg: "Unauthorized" })
                }
                const userSystem = await userHelper.getUserSystemByUuidUser(user.uuid)
                if (!userSystem.some((e) => systems.includes(e.sistem.nama_sistem) && allowedRole.includes(e.role.nama_role))) {
                    return res.status(401).json({ msg: "Unauthorized" })
                }
                req.app.locals.token = token;
                req.app.locals.user = {
                    uuid: user.uuid,
                    general_user: user.general_user,
                    password: user.password,
                    apakahInstitute:user.user_apakah?.no_lembaga
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