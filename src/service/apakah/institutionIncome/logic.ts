import { defaultMessage, LogicBase, messageAttribute } from "../../logicBase";
import DetailOfActivity from "../detailOfActivities/model";
import InstitutionIncomeAttributes from "./dto";
import InstitutionIncome from "./model";

class InstitutionIncomeLogic extends LogicBase{
    public async create(institution_id:number, academic_year:string,name:string, total:number, income_group_id:string):Promise<messageAttribute<defaultMessage>>{
        try{
            await InstitutionIncome.create({
                institution_id,
                name,
                academic_year,
                total,
                budgeted:0,
                income_group_id
            });
            return this.message(200, {message:"saved"})
        }catch(e){
            console.error(e)
            return this.message(400, {message:"uups..."});
        }
    }

    public async getByInstitutionIdcademic(institution_id:number, academic_year:string):Promise<messageAttribute<InstitutionIncomeAttributes[]>>{
        const newAcademicYear = academic_year.replace("-", "/")
        const intitutionIncome = await InstitutionIncome.findAll({where:{institution_id, academic_year:newAcademicYear}})
        return this.message(200, intitutionIncome)
    }

    // private async getById(id: string):Promise<messageAttribute<InstitutionIncomeAttributes>>{
    //     const institutionIncome = await 
    // }

    public async delete(id: string):Promise<messageAttribute<defaultMessage>>{
        const detailOfActivity = await DetailOfActivity.findAll({where:{institution_income_id:id}})
        if(detailOfActivity.length===0){
            await InstitutionIncome.destroy({where:{id:id}})
            return this.message(200, {message:"deleted"})
        }
        return this.message(400, {message:"pendapatan ini sudah dialokasikan, silahkan hapus kegiatan terlebih dahulu!"})
        
    }

    public async update(id:string, name:string, total:number):Promise<messageAttribute<defaultMessage>>{
        const institutionIncome = await InstitutionIncome.findOne({where:{id}})
        if(total > institutionIncome!.budgeted){
            await InstitutionIncome.update({name, total}, {where:{id:id}})
            return this.message(200, {message:"updated"})
        }
        return this.message(400, {message:"nilai tidak boleh lebih kecil dari pada budget yang sudah ditentukan!"})
    }

    // }

    // public async getByInstitution(institution_number:number,academic_year:string, status:number|undefined):Promise<messageAttribute<Array<InstitutionIncomeAttributes>>>{
    //     const fixStatus:{where: any, attributes?:any} = status===0 ? {where:{approved_total:0,institution_id:institution_number,academic_year}}:status===1?{where:{approved_total:{[Op.not]:0}, institution_id:institution_number,academic_year}}:{where:{institution_id:institution_number,academic_year}}
    //     fixStatus.attributes = {exclude:['createdAt', 'updatedAt']}
    //     const institution = await InstitutionIncome.findAll(fixStatus)
    //     return this.message(200, institution)
    // }

    // public async approval(approvedTotal:number, institutionIncomeId:string):Promise<messageAttribute<defaultMessage>>{
    //     await InstitutionIncome.update({approved_total:approvedTotal},{where:{id:institutionIncomeId}})
    //     return this.message(200, {message:"saved"})
    // }

    // private async getById(institutionIncomeId: string):Promise<InstitutionIncomeAttributes|null>{
    //     const institutionIncome = await InstitutionIncome.findOne({where:{id:institutionIncomeId}})
    //     return institutionIncome
    // }

    // public async update(academic_year:string, total:number, intitutionIncomeId:string):Promise<messageAttribute<defaultMessage>>{
    //     const intitutionIncome = await this.getById(intitutionIncomeId)
    //     if(intitutionIncome){
    //         if(intitutionIncome.approved_total===0){
    //             await InstitutionIncome.update({academic_year, total}, {where:{id:intitutionIncomeId}})
    //             return this.message(200, {message:"updated"})
    //         }
    //     }
    //     return this.message(404, {message:"not found"})
    // }
}

export default new InstitutionIncomeLogic;