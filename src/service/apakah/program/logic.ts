import { col, fn } from "sequelize";
import { defaultMessage, LogicBase, messageAttribute } from "../../logicBase";
import Component from "../component/model";
import Program from "./model";
import ProgramAttributes from "./dto";

class ProgramLogic extends LogicBase{

    private async getMaxProgram(institution_no: number):Promise<number>{
        const max = await Program.findOne({where:{institution_no}, attributes:[[fn('max', col("program_no")),'max']], raw:true})
        const programId:any = max;
        return programId?.max
    }

    public async getProgramByInstitution(institutionId:number):Promise<messageAttribute<ProgramAttributes[]>>{
        const program = await Program.findAll({where:{institution_no:institutionId}, include:[
            {
                model:Component,
                attributes:{exclude:["createdAt", "updatedAt", "modifable"]}
            }
        ], attributes:{exclude:["createdAt", "updatedAt", "modifable"]}})
        const max =  await this.getMaxProgram(institutionId)
        console.log(max)
        return this.message(200, program)
    }

    public async create(institution_no:number, item:string):Promise<messageAttribute<defaultMessage>>{
        const max = await this.getMaxProgram(institution_no)
        await Program.create({institution_no, program_no:max+1, item:item, modifable:true})
        return this.message(200, {message:"saved"})
    }
}

export default new ProgramLogic