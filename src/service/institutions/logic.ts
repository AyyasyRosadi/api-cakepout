import InstitutionAttributes from "./dto";
import Institution from "./model";


class InstitutionLogic {
    public async getAllInstitution(): Promise<Array<InstitutionAttributes>> {
        const allInstitution = await Institution.findAll()
        return allInstitution
    }
}

export default new InstitutionLogic;