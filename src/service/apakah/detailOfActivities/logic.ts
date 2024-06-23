import { defaultMessage, LogicBase, messageAttribute } from "../../logicBase";
import { DetailOfActivityAttributes, detailOfActivityList } from "./dto";
import DetailOfActivity from "./model";


class DetailOfActivityLogic extends LogicBase{
    public async getByActivityId(activityId:string):Promise<messageAttribute<DetailOfActivityAttributes[]>>{
        console.log(activityId)
        return this.message(200,await DetailOfActivity.findAll({where:{activity_id:activityId}}))
    }

    public async getBySubActivityId(subActivityId:string):Promise<messageAttribute<DetailOfActivityAttributes[]>>{
        return this.message(200, await DetailOfActivity.findAll({where:{sub_activity_id:subActivityId}}))
    }
    public async create(activity_id:string, sub_activity_id:string|null, detailOfActivityList:Array<detailOfActivityList>):Promise<messageAttribute<defaultMessage>>{
        for(let d in detailOfActivityList){
            await DetailOfActivity.create({
                description:detailOfActivityList[d].description,
                unit_id:detailOfActivityList[d].unit_id,
                vol:detailOfActivityList[d].vol,
                unit_price:detailOfActivityList[d].unit_price,
                thawing_method:detailOfActivityList[d].thawing_method,
                from:detailOfActivityList[d].from,
                until:detailOfActivityList[d].until,
                total:detailOfActivityList[d].total,
                academic_year:detailOfActivityList[d].academic_year,
                sharing_program:detailOfActivityList[d].sharing_program,
                post:detailOfActivityList[d].post,
                sub_activity_id:sub_activity_id,
                activity_id:activity_id,
                income_id:detailOfActivityList[d].income_id

            })
        }
        return this.message(200, {message:"saved"});
    }

    // public async getDetailOfActivity():Promise<>{

    // }
}

export default  new DetailOfActivityLogic;