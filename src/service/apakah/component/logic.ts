import { defaultMessage, LogicBase, messageAttribute } from "../../logicBase";
import { col, fn } from 'sequelize';
import Component from "./model";
import Program from "../program/model";
import ComponentAttributes from "./dto";
import Activity from "../activity/model";
import DetailOfActivity from "../detailOfActivities/model";
import { ComponentBreakDown } from "./dto";

class ComponentLogic extends LogicBase {
    private async getMaxComponent(instituton_no: number, academic_year: string): Promise<number> {
        const max = await Component.findOne({ where: { institution_no: instituton_no, academic_year }, attributes: [[fn('max', col("component_no")), 'max']], raw: true })
        const component: any = max;
        if (component!.max != null) {
            return component?.max
        }
        return 0
    }
    private async getByProgramId(program_id: string): Promise<ComponentAttributes[]> {
        const component = await Component.findAll({
            where:{program_id:program_id},
            include:[
                {
                    model:Activity,
                    include:[
                        {
                            model:DetailOfActivity
                        }
                    ]
                }
            ],
            order:[["component_no", "ASC"]]
        })
        return component
    }

    private async calculate(data:any):Promise<ComponentBreakDown[]>{
       let componentNow:ComponentBreakDown[] = [];
       const component = data.map((element:any)=>element.get({plain:true}))
       for(let c in component){
        let total:number=0;
        let activity = component[c].activities
        if(activity.length>0){
            for(let a in activity){
                let detailOfActivity = activity[a].detail_of_activities
                if(detailOfActivity.length>0){
                    for(let d in detailOfActivity){
                        total += detailOfActivity[d].total
                    }
                }
            }
        }
        componentNow.push({no:component[c].component_no,id:component[c].id, total:total, item:component[c].item})
       }
       return componentNow;
    }

    public async getAllComponentByProgramId(programId:string):Promise<messageAttribute<ComponentBreakDown[]>>{
        const program = await this.getByProgramId(programId);
        return this.message(200, await this.calculate(program))
    }
    public async create(program_id: string, item: string): Promise<messageAttribute<defaultMessage>> {
        const program = await Program.findOne({ where: { id: program_id } })
        const max = await this.getMaxComponent(program!.institution_no, program!.academic_year)
        await Component.create({
            component_no: max + 1,
            item,
            modifable: true,
            program_id: program_id,
            academic_year: program!.academic_year,
            institution_no: program!.institution_no
        })
        return this.message(200, { message: "saved" })

    }
}

export default new ComponentLogic