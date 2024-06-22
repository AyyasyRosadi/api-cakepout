import { defaultMessage, LogicBase, messageAttribute } from "../../logicBase";
import Component from "../component/model";
import Program from "../program/model";
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