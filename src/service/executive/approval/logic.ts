import { ActivityBreakDown } from "../../apakah/activity/dto";
import { defaultMessage, LogicBase, messageAttribute } from "../../logicBase";
import ActivityHelper from "../../../helper/activity";
import Realization from "../../apakah/realization/model";
import DetailOfActivity from "../../apakah/detailOfActivities/model";
import Activity from "../../apakah/activity/model";
import Component from "../../apakah/component/model";
import Program from "../../apakah/program/model";
import Institution from "../../institution/model";
import GroupAccountAttributes from "../../cakepout/groupAccount/dto";
import GroupAccount from "../../cakepout/groupAccount/model";
import YearActiveInSystem from "../../yearActiveInSystem/model";

class ExecutiveLogic extends LogicBase{
    public async  getActivity(status:number, institutionNo:number):Promise<messageAttribute<ActivityBreakDown[]>>{
        const activity = await ActivityHelper.getAllActivityByStatus(status, institutionNo)
        return this.message(200, activity)
    }

    private async detailOfActivity(activityId:string):Promise<any>{
        const detailOfActivity = await DetailOfActivity.findAll({
            where:{activity_id:activityId},
            include:[
                {
                    model:Realization,
                },
                {
                    model:Activity,
                    include:[
                        {
                            model:Component,
                            include:[
                                {
                                    model:Program,
                                    include:[
                                        {
                                            model:Institution
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        })
        return detailOfActivity.map((e:any)=>e.get({plain:true}))
    }

    private async findGroupAccount(name: string, groupAccountLabel:number):Promise<GroupAccountAttributes|null>{
        const groupAccount = await GroupAccount.findOne({where:{name, group_account_label:groupAccountLabel}})
        return groupAccount ? groupAccount.get({plain:true}) : null
    }

    private async processGroupAccount(name:string, groupAccountLabel:number):Promise<void>{
        const groupAccount = await this.findGroupAccount(name, groupAccountLabel);
        if (!groupAccount){
            await GroupAccount.create({group_account_label:groupAccountLabel, name, group_account:5})
        }
    }

    private async generateRealization(activityId: string,  newStatus:number):Promise<boolean>{
        const academicYear:any = await YearActiveInSystem.findOne({ where: { name: "apakah" } });
        try{
            const detailActivity = await this.detailOfActivity(activityId)
            for(const d of detailActivity){
                await this.processGroupAccount(d.activity.component.program.institution.name, d.activity.component.program.institution_no)
                if(!d.realization && newStatus===1){
                   await Realization.create({
                    academic_year:academicYear!.academic_year,
                    total_budget:d.total,
                    total_realization:0,
                    detail_of_activity_id:d.id
                   })
                }else if(d.realization && (newStatus===0 || newStatus===2)){
                    await Realization.destroy({where:{id:d.realization.id}})
                }
            }
            return true
        }catch(e){
            console.error(e)
            return false
        }
    }

    public async approveActivity(status:number, allActivity:any):Promise<messageAttribute<defaultMessage>>{
        for(const activity in allActivity){
            const statusProcess = await this.generateRealization(allActivity[activity], status)
            if(statusProcess){
                await Activity.update({status:status}, {where:{id:allActivity[activity]}})
            }
            
        }
        return this.message(200, {message:'success'})
    }

}

export default new ExecutiveLogic