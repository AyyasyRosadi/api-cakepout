import { LogicBase, messageAttribute } from "../logicBase";
import { SharingProgramAttributes } from "./dto";
import SharingProgram from "./model";


class SharingProgramLogic extends LogicBase {
    public async getAllSharingProgram(): Promise<messageAttribute<SharingProgramAttributes[]>> {
        const allShairngProgram = await SharingProgram.findAll()
        return this.message(200, allShairngProgram)
    }
}

export default new SharingProgramLogic;