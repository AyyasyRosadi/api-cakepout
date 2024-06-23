import { defaultMessage, LogicBase, messageAttribute } from "../../logicBase";
import Activity from "../activity/model";
import Component from "../component/model";
import Program from "../program/model";
import {fn, col} from 'sequelize';
import SubActivity from "./model";
import SubActivityAttributes from "./dto";


class SubActivityLogic extends LogicBase{

    private async getMaxSubActivity(institution_no:number, academic_year:string):Promise<number>{
        const max = await SubActivity.findOne({where:{institution_no:institution_no, academic_year},attributes:[[fn('max', col("sub_activity_no")),'max']], raw:true})
        const subActivity:any = max;
        if(subActivity!.max!=null){
            return subActivity?.max
        }
        return 0

    }
    public async getByActivityId(activity_id:string,academic_year:string):Promise<messageAttribute<SubActivityAttributes[]>>{
        return this.message(200,await SubActivity.findAll({where:{activity_id,academic_year}}))
    }


    public async create(activity_id: string, name:string):Promise<messageAttribute<defaultMessage>>{
        const activity = await Activity.findOne({where:{id:activity_id}})
        const component = await Component.findOne({where:{id:activity!.component_id}})
        console.log(component)
        const program = await Program.findOne({where:{id:component!.program_id}})
        const max = await this.getMaxSubActivity(program!.institution_no, program!.academic_year)
        await SubActivity.create({
            sub_activity_no: max+1,
            name,
            institution_no:program!.institution_no,
            academic_year:activity!.academic_year,
            activity_id:activity!.id
        })
        return this.message(200, {message:"saved"})
        
    }
}

export default new SubActivityLogic;

