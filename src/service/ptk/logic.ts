import { LogicBase, defaultMessage, messageAttribute } from "../logicBase";
import PtkAttributes from "./dto";
import Ptk from "./model";


class PtkLogic extends LogicBase {
    public async getAllPtk(): Promise<messageAttribute<Array<PtkAttributes>>> {
        const allPtk = await Ptk.findAll()
        return this.message(200,allPtk)
    }
    public async getPtkByUuid(uuid: string): Promise<messageAttribute<PtkAttributes | defaultMessage>> {
        const onePtk = await Ptk.findOne({ where: { uuid: uuid } })
        return this.message(onePtk ? 200:404,onePtk? onePtk:{message:"Ptk tidak ditemukan"})
    }
}

export default new PtkLogic