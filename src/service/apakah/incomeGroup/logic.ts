import { defaultMessage, LogicBase, messageAttribute } from "../../logicBase";
import IncomeGroup from "./model";


class GroupIncomeLogic extends LogicBase{
    public async create(name:string, parent_id:number):Promise<messageAttribute<defaultMessage>>{
        await IncomeGroup.create({name, parent_id})
        return this.message(200, {message:"saved"});
    }
}

export default new GroupIncomeLogic;