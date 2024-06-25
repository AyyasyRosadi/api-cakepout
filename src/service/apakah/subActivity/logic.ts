import { defaultMessage, LogicBase, messageAttribute } from "../../logicBase";
import Activity from "../activity/model";
import Component from "../component/model";
import Program from "../program/model";
import {fn, col, where} from 'sequelize';
import SubActivity from "./model";
import SubActivityAttributes from "./dto";
import DetailOfActivity from "../detailOfActivities/model";
import InstitutionIncome from "../institutionIncome/model";


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
        const program = await Program.findOne({where:{id:component!.program_id}})
        const max = await this.getMaxSubActivity(program!.institution_no, program!.academic_year)
        await SubActivity.create({
            sub_activity_no: max+1,
            name,
            institution_no:program!.institution_no,
            academic_year:activity!.academic_year,
            activity_id:activity!.id,
            weight:0,
        })
        return this.message(200, {message:"saved"})
        
    }

    private async getSubActivityById(id:string):Promise<any>{
        const subActivity = await SubActivity.findOne({where:{id:id}, include:[
            {
                model:DetailOfActivity
            }
        ]})
        return subActivity;
    }

    public async delete(id:string):Promise<messageAttribute<defaultMessage>>{
        const subActivity = await this.getSubActivityById(id)
        const planSubActivity = subActivity.get({plain:true})
        if(planSubActivity!.detail_of_activities.length>0){
            let detail = planSubActivity!.detail_of_activities
            for(let p in detail){
                const institutionIncome = await InstitutionIncome.findOne({where:{id:detail[p].institution_income_id}})
                await InstitutionIncome.update({budgeted:institutionIncome!.budgeted-detail[p].total}, {where:{id:detail[p].institution_income_id}})
                await DetailOfActivity.destroy({where:{id:detail[p].id}})
            }
        }
        await SubActivity.destroy({where:{id:id}})
        return this.message(200, {message:"deleted"})
    }
}

export default new SubActivityLogic;

