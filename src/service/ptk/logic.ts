import PtkAttributes from "./dto";
import Ptk from "./model";


class PtkLogic {
    public async getAllPtk(): Promise<Array<PtkAttributes>> {
        const allPtk = await Ptk.findAll()
        return allPtk
    }
    public async getPtkByUuid(uuid: string): Promise<PtkAttributes | boolean> {
        const onePtk = await Ptk.findOne({ where: { uuid: uuid } })
        if (!onePtk) {
            return false
        }
        return onePtk
    }
}

export default new PtkLogic