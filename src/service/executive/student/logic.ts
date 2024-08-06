import { LogicBase, messageAttribute } from "../../logicBase";
import SantriAttributes from "../../santri/santri/dto";
import Santri from "../../santri/santri/model";
import StatusSantri from "../../santri/statusSantri/model";

class Student extends LogicBase{
    private async getAllStudent():Promise<Array<SantriAttributes>>{
        const santri = await Santri.findAll({
            include:[
                {
                    model:StatusSantri,
                    where:{
                        status:1
                    }
                }
            ]
        })
        return santri
    }
    private async getStudentByGender(gender: string):Promise<Array<SantriAttributes>>{
        const santri = await Santri.findAll({
            where:{
                gender,
            },
            include:[
                {
                    model:StatusSantri,
                    where:{
                        status:1
                    }
                }
            ]
        })
        return santri.map((e:any)=> e.get({plain:true}));
    }
    public async getStudent():Promise<messageAttribute<any>>{
        const getFemale = await this.getStudentByGender("P")
        const getMale = await this.getStudentByGender("L")
        const all = await this.getAllStudent()
        return this.message(200, {male:getMale.length, female:getFemale.length, total:all.length})
    }
}

export default new Student;