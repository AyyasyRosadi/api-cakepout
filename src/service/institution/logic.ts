import { defaultMessage, LogicBase, messageAttribute } from "../logicBase";
import InstitutionAttributes from "./dto";
import Institution from "./model";
import { PROGRAM } from "../apakah/staticData";
import Program from "../apakah/program/model";
import Component from "../apakah/component/model";


class InstitutionLogic extends LogicBase {
    public async getAllInstitution(): Promise<messageAttribute<Array<InstitutionAttributes>>> {
        const allInstitution = await Institution.findAll()
        return this.message(200,allInstitution)
    }
    public async create(name:string):Promise<messageAttribute<defaultMessage>>{
        const institution = await Institution.create({name})
        if(institution){
            for(let p in PROGRAM){
                const program = await Program.create({
                    institution_no:institution.id,
                    program_no:PROGRAM[p].no,
                    item:PROGRAM[p].item,
                    modifable:false,
                })
                for(let c in PROGRAM[p].component){
                    await Component.create({
                        component_no:PROGRAM[p].component[c].no,
                        item:PROGRAM[p].component[c].item,
                        modifable:false,
                        program_id:program.id
                    })
                }
                
            } 
        }
        return this.message(200, {message:"created"})
    }
}

export default new InstitutionLogic;