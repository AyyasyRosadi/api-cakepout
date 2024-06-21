import { defaultMessage, LogicBase, messageAttribute } from "../../logicBase";
import Program from "./model";

class ProgramLogic extends LogicBase{
    public async create(institution: number, program_no:number, item:string, modifable:boolean):Promise<messageAttribute<defaultMessage>>{
        await Program.create({
            institution_no:institution,
           program_no, 
            item,
            modifable
        })
        return this.message(200, {message:"saved"})
    }
}

export default new ProgramLogic