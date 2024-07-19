import { ActivityBreakDown } from "../../apakah/activity/dto";
import { LogicBase, messageAttribute } from "../../logicBase";
import ActivityHelper from "../../../helper/activity";

class ExecutiveLogic extends LogicBase{
    public async  getActivity(status:number, institutionNo:number):Promise<messageAttribute<ActivityBreakDown[]>>{
        const activity = await ActivityHelper.getAllActivityByStatus(status, institutionNo)
        return this.message(200, activity)
    }
}

export default new ExecutiveLogic