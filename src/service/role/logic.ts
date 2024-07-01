import { LogicBase, defaultMessage, messageAttribute } from "../logicBase";
import RoleAttributes from "./dto";
import Role from "./model";


class RoleLogic extends LogicBase{
    public async getAllRoleBySystem(system_id:string):Promise<messageAttribute<RoleAttributes[]>>{
        return this.message(200,await Role.findAll({where:{uuid_sistem:system_id}}))
    }
    public async createRole(name:string,system_id:string):Promise<messageAttribute<defaultMessage>>{
        await Role.create({nama_role:name,uuid_sistem:system_id})
        return this.message(200,{message:"Succes"})
    }
}

export default new RoleLogic()