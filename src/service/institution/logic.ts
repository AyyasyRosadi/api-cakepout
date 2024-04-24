import { LogicBase, messageAttribute } from "../logicBase";
import InstitutionAttributes from "./dto";
import Institution from "./model";


class InstitutionLogic extends LogicBase {
    public async getAllInstitution(): Promise<messageAttribute<Array<InstitutionAttributes>>> {
        const allInstitution = await Institution.findAll()
        return this.message(200,allInstitution)
    }
}

export default new InstitutionLogic;