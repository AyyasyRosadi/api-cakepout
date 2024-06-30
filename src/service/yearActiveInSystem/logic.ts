import { defaultMessage, LogicBase, messageAttribute } from "../logicBase";
import YearActiveInSystemAttributes from "./dto";
import YearActiveInSystem from "./model";

class YearActiveInSystemLogic extends LogicBase{
    public async get(system:string):Promise<messageAttribute<YearActiveInSystemAttributes| defaultMessage>>{
        const yearActiveInSystem = await YearActiveInSystem.findOne({where:{name:system}})
        if(yearActiveInSystem){
            return this.message(200, yearActiveInSystem)
        }
        return this.message(404, {message:"not found"})
        
    }
}

export default new YearActiveInSystemLogic