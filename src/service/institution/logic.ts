import { defaultMessage, LogicBase, messageAttribute } from "../logicBase";
import InstitutionAttributes from "./dto";
import Institution from "./model";
import { program } from "../apakah/staticData";
import Program from "../apakah/program/model";


class InstitutionLogic extends LogicBase {
    public async getAllInstitution(): Promise<messageAttribute<Array<InstitutionAttributes>>> {
        const allInstitution = await Institution.findAll()
        return this.message(200,allInstitution)
    }
    public async create(name:string):Promise<messageAttribute<defaultMessage>>{
        const institution = await Institution.create({name})
        if(institution){
            for(let p in program){
                await Program.create({
                    institution_no:institution.id,
                    program_no:program[p].no,
                    item:program[p].item,
                    modifable:false
                })
                
            } 
        }
        return this.message(200, {message:"created"})
    }
}

export default new InstitutionLogic;