import ActivityAttributes from "../service/apakah/activity/dto"
import Activity from "../service/apakah/activity/model"
import { DetailOfActivityAttributes } from "../service/apakah/detailOfActivities/dto"
import DetailOfActivity from "../service/apakah/detailOfActivities/model"
import DisbursementOfFundAttributes from "../service/cakepout/disbursementOfFund/dto"
import DisbursementOfFunds from "../service/cakepout/disbursementOfFund/model"

class DisbursementOfFundHelper {
    private include = [{ model: DetailOfActivity }]
    public async getDisbursementOfFundByGroupId(uuid: string,status:boolean): Promise<Array<DisbursementOfFundAttributes>> {
        const allDisbursementOfFund = await DisbursementOfFunds.findAll({ where: { sharing_program_id: uuid,status:status, withdraw: false }, include: this.include })
        return allDisbursementOfFund
    }
    public async getDisbursementOfFundByUuid(uuid: string): Promise<DisbursementOfFundAttributes> {
        const oneDisbursementOfFund = await DisbursementOfFunds.findOne({ where: { uuid: uuid }, include: this.include })
        return oneDisbursementOfFund!
    }

    private async getActivity(institutionNo:number, status:number):Promise<ActivityAttributes[]>{
        const activity = await Activity.findAll({
            where:{
                institution_no:institutionNo,
            },
            include:[
                {
                    model:DetailOfActivity,
                    
                }
            ]
        })
        return activity.map((e:any)=> e.get({plain:true}))
    }

    public async activityDisbrusmentOfFund(institution_no:number, status:number):Promise<ActivityAttributes[]>{
        const data:any = await this.getActivity(institution_no, status)
        let finalData:ActivityAttributes[] = []
        const monthNow =  new Date().getMonth()+1
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
        return finalData

    }
    

}

export default new DisbursementOfFundHelper