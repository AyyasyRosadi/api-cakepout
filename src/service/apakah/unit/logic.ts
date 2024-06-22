import { LogicBase, messageAttribute } from "../../logicBase";
import UnitAttributes from "./dto";
import Unit from './model'


class UnitLogic extends LogicBase{
    public async getAll():Promise<messageAttribute<UnitAttributes[]>>{
        const unit = await Unit.findAll({attributes:{exclude:['createdAt', 'updatedAt']}});
        return this.message(200, unit);
    }
}

export default new UnitLogic;