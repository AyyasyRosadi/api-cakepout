import bcrypt from "../../helper/bcrypt";
import { LogicBase, defaultMessage, messageAttribute } from "../logicBase";
import RoleAttributes from "../role/dto";
import Role from "../role/model";
import SystemAttributes from "../system/dto";
import System from "../system/model";
import UserApakah from "../userApakah/model";
import UserSystemAttributes from "../userSystem/dto";
import UserSystem from "../userSystem/model";
import UserAttributes from "./dto";
import User from "./model";


class UserLogic extends LogicBase {
    private async getAllUser(): Promise<UserAttributes[]> {
        const include = [
            { model: UserApakah, as: "user_apakah", required: false },
            { model: UserSystem, attributes: { exclude: ['user_sistem'] }, required: true, include: [{ model: System }, { model: Role }] }
        ]
        return await User.findAll({ include })
    }
    public async restructurUser(): Promise<messageAttribute<any>> {
        const users = []
        for (let user of await this.getAllUser()) {
            users.push({
                uuid: user.uuid,
                nama: user.nama,
                username: user.username,
                general_user: user.general_user,
                sistem: user.user_sistems?.map((system) => ({
                    uuid_sistem: system?.uuid_sistem,
                    nama_sistem: system?.sistem?.nama_sistem,
                    super_admin: system?.super_admin,
                    uuid_role: system?.uuid_role,
                    nama_role: system?.role?.nama_role,
                    lembaga_apakah: user.user_apakah?.no_lembaga
                }))
            })
        }
        return this.message(200, users)
    }

    private async getSystem(id: string): Promise<SystemAttributes> {
        const system = await System.findOne({ where: { uuid: id } })
        return system!
    }

    private async getRole(id: string): Promise<RoleAttributes> {
        const role = await Role.findOne({ where: { uuid: id } })
        return role!
    }

    private async createUserApakah(system_id: string, user_id: string, institution_apakah: number): Promise<void> {
        await UserApakah.create({
            uuid_user: user_id,
            no_lembaga: institution_apakah,
            uuid_sistem: system_id
        })
    }

    private async updateUserApakah(user_id: string, institution_apakah: number): Promise<void> {
        await UserApakah.update({ no_lembaga: institution_apakah }, { where: { uuid_user: user_id } })
    }

    private async updateUserSystem(system_id: string, role_id: string, super_admin: boolean, user_id: string): Promise<void> {
        await UserSystem.update({ uuid_role: role_id, super_admin }, { where: { uuid_sistem: system_id, uuid_user: user_id } })
    }

    private async getUserSystemByUser(user_id: string, system_id: string): Promise<UserSystemAttributes> {
        const userSystem = await UserSystem.findOne({ where: { uuid_user: user_id, uuid_sistem: system_id }, attributes: { exclude: ['user_sistem'] } })
        return userSystem!
    }

    private async checkUserApakah(system_id: string, role_id: string, user_id: string, institution_apakah: number): Promise<void> {
        const findSystem = await this.getSystem(system_id)
        const findRole = await this.getRole(role_id)
        if (findSystem?.nama_sistem === 'apakah' && findRole?.nama_role === 'admin-lembaga') {
            const userApakah = await UserApakah.findOne({ where: { uuid_user: user_id } })
            if (userApakah) {
                await this.updateUserApakah(user_id, institution_apakah)
            } else {
                await this.createUserApakah(system_id, user_id, institution_apakah)
            }
        }
    }

    private async createUserSystem(user_id: string, system_id: string, role_id: string, super_admin: boolean, institution_apakah: number): Promise<void> {
        await UserSystem.create({
            uuid_user: user_id,
            uuid_sistem: system_id,
            uuid_role: role_id,
            super_admin
        })
    }

    public async addUserSystem(user_id: string, system_id: string, role_id: string, super_admin: boolean, institution_apakah: number): Promise<messageAttribute<defaultMessage>> {
        await this.checkUserApakah(system_id, role_id, user_id, institution_apakah)
        await this.createUserSystem(user_id, system_id, role_id, super_admin, institution_apakah)
        return this.message(200, { message: "Succes" })
    }


    public async createUser(name: string, username: string, password: string, general_user: boolean, system: any): Promise<messageAttribute<defaultMessage>> {
        try {
            const hashing = await bcrypt.hash(password)
            const newUser = await User.create({ nama: name, username, password: hashing, general_user })
            for (let i of system) {
                await this.checkUserApakah(i.system_id, i.role_id, newUser?.uuid, i.institution_apakah)
                await this.createUserSystem(newUser?.uuid, i.system_id, i.role_id, i.super_admin, i.institution_apakah)
            }
            return this.message(200, { message: "Succes" })
        } catch (e) {
            console.log(e)
            return this.message(500, { message: "Error" })
        }
    }

    public async updateUser(id: string, name: string, username: string, password: string, general_user: boolean): Promise<messageAttribute<defaultMessage>> {
        let data: any = { nama: name, username, general_user }
        if (password) {
            const hashing = await bcrypt.hash(password)
            data.password = hashing
        }
        await User.update(data, { where: { uuid: id } })
        return this.message(200, { message: "Succes" })
    }

    public async updateSystem(id: string, user_id: string, super_admin: boolean, role_id: string, institution_apakah: number): Promise<messageAttribute<defaultMessage>> {
        const userSystem = await this.getUserSystemByUser(user_id, id)
        if (!userSystem) {
            return this.message(404, { message: "User tidak terdaftar" })
        }
        await this.checkUserApakah(id, role_id, user_id, institution_apakah)
        await this.updateUserSystem(id, role_id, super_admin, user_id)
        return this.message(200, { message: "Succes" })

    }

    public async deleteUser(id: string): Promise<messageAttribute<defaultMessage>> {
        await UserApakah.destroy({ where: { uuid_user: id } })
        await UserSystem.destroy({ where: { uuid_user: id } })
        await User.destroy({ where: { uuid: id } })
        return this.message(200, { message: "Succes" })
    }

    public async deleteSystem(system_id: string, user_id: string): Promise<messageAttribute<defaultMessage>> {
        await UserSystem.destroy({ where: { uuid_user: user_id, uuid_sistem: system_id } })
        return this.message(200, { message: "Succes" })
    }
}

export default new UserLogic