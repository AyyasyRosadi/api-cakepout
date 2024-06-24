import { defaultMessage, LogicBase, messageAttribute } from "../../logicBase";
import IncomeGroupAttributes from "./dto";
import IncomeGroup from "./model";


class GroupIncomeLogic extends LogicBase{
    public async create(name:string, parent_id:number):Promise<messageAttribute<defaultMessage>>{
        await IncomeGroup.create({name, parent_id})
        return this.message(200, {message:"saved"});
    }

    public async get():Promise<messageAttribute<IncomeGroupAttributes[]>>{
        const incomeGroup = await IncomeGroup.findAll()
        return this.message(200, incomeGroup)
    }
}

export default new GroupIncomeLogic;