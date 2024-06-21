import { defaultMessage, LogicBase, messageAttribute } from "../../logicBase";
import InstitutionAttributes from "../instance/dto";
import InstitutionIncomeAttributes from "./dto";
import InstitutionIncome from "./model";
import { Op } from "sequelize";

class InstitutionIncomeLogic extends LogicBase{
    public async create(institution_id:number, academic_year:string, total:number, approved_total:number):Promise<messageAttribute<defaultMessage>>{
        try{
            await InstitutionIncome.create({
                institution_id,
                academic_year,
                total,
                approved_total
            });
            return this.message(200, {message:"saved"})
        }catch(e){
            console.error(e)
            return this.message(400, {message:"uups..."});
        }
    }

    public async getByInstitution(institution_number:number, status:number|undefined):Promise<messageAttribute<Array<InstitutionIncomeAttributes>>>{
        const fixStatus:{where: any, attributes?:any} = status===0 ? {where:{approved_total:0,institution_id:institution_number}}:status===1?{where:{approved_total:{[Op.not]:0}, institution_id:institution_number}}:{where:{institution_id:institution_number}}
        fixStatus.attributes = {exclude:['createdAt', 'updatedAt']}
        const institution = await InstitutionIncome.findAll(fixStatus)
        return this.message(200, institution)
    }

    public async approval(approvedTotal:number, institutionIncomeId:string):Promise<messageAttribute<defaultMessage>>{
        await InstitutionIncome.update({approved_total:approvedTotal},{where:{id:institutionIncomeId}})
        return this.message(200, {message:"saved"})
    }

    private async getById(institutionIncomeId: string):Promise<InstitutionIncomeAttributes|null>{
        const institutionIncome = await InstitutionIncome.findOne({where:{id:institutionIncomeId}})
        return institutionIncome
    }

    public async update(academic_year:string, total:number, intitutionIncomeId:string):Promise<messageAttribute<defaultMessage>>{
        const intitutionIncome = await this.getById(intitutionIncomeId)
        if(intitutionIncome){
            if(intitutionIncome.approved_total===0){
                await InstitutionIncome.update({academic_year, total}, {where:{id:intitutionIncomeId}})
                return this.message(200, {message:"updated"})
            }
        }
        return this.message(404, {message:"not found"})
    }
}

export default new InstitutionIncomeLogic;