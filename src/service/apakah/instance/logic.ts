import { defaultMessage, LogicBase, messageAttribute } from "../../logicBase";
import ListLembagaApakah from "./model";

class ListLembagaApakahLogic extends LogicBase{
    public async create(name: string):Promise<messageAttribute<defaultMessage>>{
        await ListLembagaApakah.create({
            name
        })
        return this.message(200, {message:"created"})
    }
}

export default new ListLembagaApakahLogic