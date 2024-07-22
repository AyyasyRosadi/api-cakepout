import { LogicBase, messageAttribute } from "../../logicBase";
import ActivityAttributes from "../activity/dto";
import Activity from "../activity/model";
import { DetailOfActivityAttributes } from "../detailOfActivities/dto";
import DetailOfActivity from "../detailOfActivities/model";
import Realization from "../realization/model";
import YearActiveInSystemHelper from "../../../helper/yearActiveInSystem"

class DisbrusmentOfFundLogicApakah extends LogicBase{
    private async getDetailOfActivity(institutionNo: number):Promise<ActivityAttributes[]>{
        const activity = await Activity.findAll({
            where:{
                institution_no:institutionNo,
            },
            include:[
                {
                    model:DetailOfActivity
                }
            ]
        })
        return activity.map((e:any)=> e.get({plain:true}))
    }

    public async activity(institution_no:number):Promise<messageAttribute<ActivityAttributes[]>>{
        const data:any = await this.getDetailOfActivity(institution_no)
        let finalData:ActivityAttributes[] = []
        const monthNow =  new Date().getMonth()+1
        console.log(monthNow)
        for(const a of data){
            let detailOfActivity:DetailOfActivityAttributes[] = []
            // console.log(a.detail_of_activities)
            if(a.detail_of_activities!.length!==0){
                for(const d of a.detail_of_activities){
                    if(d.from<= monthNow && d.until>= monthNow){
                        detailOfActivity.push(d)
                    }
                }
                let newActivity = a;
                newActivity.detail_of_activities = detailOfActivity;
                finalData.push(newActivity);
            }
            
        }
        return this.message(200, finalData)
        
    }

    private async generateRealization(year:string, totalBudget:number, totalRealization:number, detailOfActivityId:string):Promise<void>{
        await Realization.create({
            academic_year:year,
            total_budget:totalBudget,
            total_realization:totalRealization,
            detail_of_activity_id:detailOfActivityId
        })
    }

    // public async approvalRealization():{
    //     const year = await YearActiveInSystemHelper.getYear("apakah");
    // }


}

export default new DisbrusmentOfFundLogicApakah;