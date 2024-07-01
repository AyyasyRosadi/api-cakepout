import { LogicBase, defaultMessage, messageAttribute } from "../logicBase";
import SystemAttributes from "./dto";
import System from "./model";


class SystemLogic extends LogicBase {
    public async getAllSystem(): Promise<messageAttribute<SystemAttributes[]>> {
        return this.message(200, await System.findAll())
    }
    public async createSystem(name: string): Promise<messageAttribute<defaultMessage>> {
        await System.create({ nama_sistem: name })
        return this.message(200, { message: "Succes" })
    }
}

export default new SystemLogic