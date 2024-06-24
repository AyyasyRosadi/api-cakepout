import { col, fn } from "sequelize";
import { defaultMessage, LogicBase, messageAttribute } from "../../logicBase";
import Program from "./model";
import ProgramAttributes from "./dto";
import Component from "../component/model";
import Activity from "../activity/model";
import DetailOfActivity from "../detailOfActivities/model";
import { programResponseBreakDown } from "./dto";
import InstitutionIncome from "../institutionIncome/model";

class ProgramLogic extends LogicBase{

    private async getMaxProgram(institution_no: number):Promise<number>{
        const max = await Program.findOne({where:{institution_no}, attributes:[[fn('max', col("program_no")),'max']], raw:true})
        const programId:any = max;
        return programId?.max
    }

    private async getProgramByInstitution(institutionId:number, academic_year:string):Promise<ProgramAttributes[]>{
        let newAcademicYear:string = academic_year.replace("-", "/")
        console.log(this.excludeAttributes().attributes)
        const program = await Program.findAll({where:{institution_no:institutionId, academic_year:newAcademicYear},
        include:[
                    {
                        model:Component,
                        include:[
                            {
                                model:Activity,
                                include:[
                                    {
                                        model:DetailOfActivity
                                    }
                                ]
                            }
                        ]
                    }
                ]
            ,attributes:this.excludeAttributes().attributes, order:[['program_no', 'asc']]})
        return program
    }

    private async calculateProgram(data: any):Promise<programResponseBreakDown[]>{
        let programNow:programResponseBreakDown[] = [];
        const program = data.map((element:any)=> element.get({plain:true}))
        for(let p in program){
            let no:string = "";
            let total:number = 0;
            let component = program[p].components
            if(component.length>0){
                for(let c in component){
                    let activity = component[c].activities
                    if(activity.length> 0){
                        for(let a in activity){
                            let detailOfActivity = activity[a].detail_of_activities
                            if(detailOfActivity.length>0){
                                for(let d in detailOfActivity){
                                    total += detailOfActivity[d].total
                                }
                            }
                        }
                    }
                }
                
            }
            no = `${program[p].institution_no}.${program[p].program_no}`
            programNow.push({no:no, id: program[p].id, item:program[p].item, total:total})
        }
        return programNow
    }
           
    

    public async getAllProgramByInstitution(institutionId:number, academic_year:string):Promise<any>{
        const program = await this.getProgramByInstitution(institutionId, academic_year);
        // console.log(await this.calculateProgram(program))
        return this.message(200, await this.calculateProgram(program))
        
    }

    public async create(institution_no:number, item:string, academic_year:string):Promise<messageAttribute<defaultMessage>>{
        try{
            const max = await this.getMaxProgram(institution_no)
            await Program.create({institution_no, program_no:max+1, item:item, modifable:true, academic_year})
            return this.message(200, {message:"saved"})
        }catch(r){
            console.log(r)
            return this.message(500, {message:"error"})

        }
    }

    private async getById(id:string):Promise<ProgramAttributes|null>{
        return await Program.findOne({
            where:{
                id:id
            },
            include:[
                {
                    model:Component,
                    include:[
                        {
                            model:Activity,
                            include:[
                                {
                                    model:DetailOfActivity
                                }
                            ]
                        }
                    ]
                }
            ]
        })
    }
    public async delete(id:string):Promise<messageAttribute<defaultMessage>>{
        const program:any = await this.getById(id)
        const programPlan = program.get({plain:true})
        if(program.modifable){
            if(program.components.length>0){
                const components = program!.components
                for(let c in components){
                    const activitys = components[c].activities
                    for(let a in activitys){
                        const detail = activitys[a].detail_of_activities
                        for(let d in detail){
                            const institutionIncome = await InstitutionIncome.findOne({where:{id:detail[d].institution_income_id}})
                            await InstitutionIncome.update({budgeted:institutionIncome!.budgeted-detail[d].total}, {where:{id:detail[d].institution_income_id}})
                            await DetailOfActivity.destroy({where:{id:detail[d].id}})
                        }
                        await Activity.destroy({where:{id:activitys[a].id}})
                    }
                    await Component.destroy({where:{id:components[c].id}})
                }
                await Program.destroy({where:{id:id}})
            }
            return this.message(400, {message:"deleted"})
        }
        return this.message(400, {message:"uuups"})
        
    }
}

export default new ProgramLogic