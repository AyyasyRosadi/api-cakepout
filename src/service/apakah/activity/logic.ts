import { defaultMessage, LogicBase, messageAttribute } from "../../logicBase";
import Component from "../component/model";
import DetailOfActivity from "../detailOfActivities/model";
import InstitutionIncome from "../institutionIncome/model";
import Program from "../program/model";
import SubActivity from "../subActivity/model";
import ActivityAttributes, { ActivityBreakDown, SubActivityBreakDown } from "./dto";
import Activity from "./model";
import {fn, col} from 'sequelize'

class ActivityLogic extends LogicBase{
    private async getMaxActivity(instituton_no:number, academic_year:string):Promise<number>{
        const max = await Activity.findOne({where:{institution_no:instituton_no, academic_year},attributes:[[fn('max', col("activity_no")),'max']], raw:true})
        const activity:any = max;
        if(activity!.max!=null){
            return activity?.max
        }
        return 0
    }
    private async getByComponentId(component_id: string): Promise<ActivityAttributes[]> {
        const activity = await Activity.findAll({
            where:{component_id:component_id},
            include:[
                {
                    model:DetailOfActivity
                },
                {
                    model:SubActivity,
                    include:[
                        {
                            model:DetailOfActivity
                        }
                    ]
                }
            ],
        })
        return activity
    }

    private async calculate(data:any):Promise<ActivityBreakDown[]>{
        let activityNow:ActivityBreakDown[] = [];
        const activity = data.map((element:any)=>element.get({plain:true}))
        // console.log(activity)
       
        for(let a in activity){
            let total = 0;
            let subActivity = activity[a].sub_activities
            let subActivityNow:SubActivityBreakDown[]=[]
            // let totalWeight = 0;
            if(subActivity.length>0){
                for(let s in subActivity){
                    let totalSub =0;
                    let detailOfActivityOnSubActivity = subActivity[s].detail_of_activities
                    for(let d in detailOfActivityOnSubActivity){
                        totalSub= totalSub + detailOfActivityOnSubActivity[d].total                     
                    }
                    // totalWeight = totalWeight + subActivity[s].weight;
                    console.log("------")
                    console.log(subActivity[s].weight)
                    subActivityNow.push({no:subActivity[s].sub_activity_no, id:subActivity[s].id,name:subActivity[s].name, continue:subActivity[s].continue, total:totalSub, weight:subActivity[s].weight})
                }
            }
            let detailOfActivity = activity[a].detail_of_activities
            // console.log(detailOfActivity)
            for(let d in detailOfActivity){
                if(detailOfActivity[d].sub_activity_id===null){
                    total += detailOfActivity[d].total
                }
            }
            
            activityNow.push({no:activity[a].activity_no, id:activity[a].id, name:activity[a].name, continue:activity[a].continue, total:total, sub_activity:subActivityNow.length>0?subActivityNow:null, weight:activity[a].weight})
        }
        return activityNow
    }


    public async getAllActivityBreakDown(compoent_id:string):Promise<messageAttribute<ActivityBreakDown[]>>{
        const activity = await this.getByComponentId(compoent_id)
        return this.message(200, await this.calculate(activity))
    }

    public async create(component_id:string, name: string,  continue_activity:boolean):Promise<messageAttribute<defaultMessage>>{
        const component = await Component.findOne({where:{id:component_id}})
        
        const program = await Program.findOne({where:{id:component!.program_id}})
        const max = await this.getMaxActivity(program!.institution_no, program!.academic_year)
        const activity = await Activity.create({
            activity_no:max+1,
            name:name,
            status:0,
            component_id,
            institution_no:program!.institution_no,
            academic_year:program!.academic_year,
            continue:continue_activity,
            weight:0
        })
        return this.message(200, {message:`${activity.id}`})
    }

    private async getActivityId(id:string):Promise<ActivityAttributes|null>{
        const activity = await Activity.findOne({
            where:{id:id},
            include:[
                {
                    model:DetailOfActivity
                }
            ]
        })
        return activity
    }

    public async delete(id: string):Promise<messageAttribute<defaultMessage>>{
        const activity:any = await this.getActivityId(id)
        const planActivity = activity.get({plain:true})
        if(planActivity!.detail_of_activities.length>0){
            let detail = planActivity!.detail_of_activities
            for(let p in detail){
                const institutionIncome = await InstitutionIncome.findOne({where:{id:detail[p].institution_income_id}})
                await InstitutionIncome.update({budgeted:institutionIncome!.budgeted-detail[p].total}, {where:{id:detail[p].institution_income_id}})
                await DetailOfActivity.destroy({where:{id:detail[p].id}})
            }
        }
        await Activity.destroy({where:{id:id}})
        return this.message(200, {message:"deleted"})
    }
    
}

export default new ActivityLogic;