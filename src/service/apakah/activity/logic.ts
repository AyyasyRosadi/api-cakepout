import { defaultMessage, LogicBase, messageAttribute } from "../../logicBase";
import Component from "../component/model";
import DetailOfActivity from "../detailOfActivities/model";
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
            if(subActivity.length>0){
                for(let s in subActivity){
                    let totalSub =0;
                    let detailOfActivityOnSubActivity = subActivity[s].detail_of_activities
                    for(let d in detailOfActivityOnSubActivity){
                        totalSub+=detailOfActivityOnSubActivity[d].total
                        total +=totalSub
                        subActivityNow.push({no:subActivity[s].sub_activity_no, name:subActivity[s].name, total:totalSub})
                    }
                }
            }
            let detailOfActivity = activity[a].detail_of_activities
            console.log(detailOfActivity)
            for(let d in detailOfActivity){
                if(detailOfActivity[d].sub_activity_id===null){
                    total += detailOfActivity[d].total
                }
            }
            activityNow.push({no:activity[a].activity_no, name:activity[a].name, total:total, sub_activity:subActivityNow.length>0?subActivityNow:null})
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
        await Activity.create({
            activity_no:max+1,
            name:name,
            status:0,
            component_id,
            institution_no:program!.institution_no,
            academic_year:program!.academic_year,
            continue:continue_activity
        })
        return this.message(200, {message:"saved"})
    }
    
}

export default new ActivityLogic;