import DetailOfActivityAttributes from "./dto";
import DetailOfActivity from "./model";


class DetailOfActivityLogic {
    public async getAllDetailOfActivity():Promise<Array<DetailOfActivityAttributes>>{
        const allDetailOfActivity = await DetailOfActivity.findAll()
        return allDetailOfActivity
    }
    public async getOneDetailActivityByUuid(uuid:string):Promise<DetailOfActivityAttributes | null>{
        const oneDetailOfActivity = await DetailOfActivity.findOne({where:{uuid}})
        return oneDetailOfActivity ? oneDetailOfActivity : null
    }
}

export default new DetailOfActivityLogic;