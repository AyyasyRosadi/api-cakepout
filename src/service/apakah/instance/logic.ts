import { defaultMessage, LogicBase, messageAttribute } from "../../logicBase";
import InstitutionAttributes from "./dto";
import InstitutionApakah from "./model";
import ListLembagaApakah from "./model";

class ListLembagaApakahLogic extends LogicBase {
    public async getAll(): Promise<messageAttribute<InstitutionAttributes[]>> {
        return this.message(200, await InstitutionApakah.findAll())
    }
    public async create(name: string): Promise<messageAttribute<defaultMessage>> {
        await ListLembagaApakah.create({
            name
        })
        return this.message(200, { message: "created" })
    }
}

export default new ListLembagaApakahLogic