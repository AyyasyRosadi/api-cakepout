import { LogicBase, messageAttribute } from "../../logicBase";
import InstitutionIncomeAttributes from "../institutionIncome/dto";
import InstitutionIncome from "../institutionIncome/model";
import DashboardReport from "./dto";

class ActivityLogic extends LogicBase{

    private async barChatConstruct(data:Array<InstitutionIncomeAttributes>):Promise<DashboardReport>{
        let report:DashboardReport={labels:[], total:[], budgeted:[]};
        for(let d in data){
            report.labels.push(data[d].name)
            report.total.push(data[d].total)
            report.budgeted.push(data[d].budgeted)
        }
        return report
    }

    public async getAll():Promise<messageAttribute<DashboardReport>>{
        const institutinoIncome = await InstitutionIncome.findAll({attributes:["name", "total", "budgeted"]});
        return this.message(200, await this.barChatConstruct(institutinoIncome))
    }

    public async getByInstitutionId(institutionId:number):Promise<messageAttribute<DashboardReport>>{
        const institutionIncome = await InstitutionIncome.findAll({where:{institution_id:institutionId},attributes:["name", "total", "budgeted"]});
        return this.message(200, await this.barChatConstruct(institutionIncome))
    }
}

export default new ActivityLogic;