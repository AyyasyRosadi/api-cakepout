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

    public async getProgramByInstitution(institutionId:number, academic_year:string):Promise<messageAttribute<ProgramAttributes[]|defaultMessage>>{
        try{
            if (academic_year!==""){
                let newAcademicYear:string = academic_year.replace("-", "/")
                console.log(this.excludeAttributes().attributes)
                const program = await Program.findAll({where:{institution_no:institutionId, academic_year:newAcademicYear}, attributes:this.excludeAttributes().attributes})
                return this.message(200, program)
            }
            return this.message(400, {message:"academic year not found"})
        }catch(r){
            return this.message(400,{message:'error'})
        }
       
        // const program = await Program.findAll({where:{institution_no:institutionId, academic_year}, include:[
        //     {
        //         model:Component,
        //         attributes:{exclude:["createdAt", "updatedAt", "modifable"]}
        //     }
        // ], attributes:{exclude:["createdAt", "updatedAt", "modifable"]}})
        // const max =  await this.getMaxProgram(institutionId)
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

   
}

export default new ProgramLogic