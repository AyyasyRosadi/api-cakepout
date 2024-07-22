import { defaultMessage, LogicBase, messageAttribute } from "../../logicBase";
import { SharingProgramAttributes } from "./dto";
import SharingProgram from "./model";


class SharingProgramLogic extends LogicBase {
    public async getAllSharingProgram(): Promise<messageAttribute<SharingProgramAttributes[]>> {
        const allShairngProgram = await SharingProgram.findAll()
        return this.message(200, allShairngProgram)
    }
    public async createSharingProgram(name: string): Promise<messageAttribute<defaultMessage>> {
        await SharingProgram.create({ name })
        return this.message(200, { message: 'Succes' })
    }
}

export default new SharingProgramLogic;