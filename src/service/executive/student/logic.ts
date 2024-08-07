import { filter } from "compression";
import { LogicBase, messageAttribute } from "../../logicBase";
import SantriAttributes from "../../santri/santri/dto";
import Santri from "../../santri/santri/model";
import StatusSantri from "../../santri/statusSantri/model";
import Permission from "../../bordingSchool/permission/model";

class Student extends LogicBase{
    private async getAllStudend(gender: string):Promise<Array<SantriAttributes>>{
        const filterBy = gender === "all" ? {} : gender==="p" ? {gender:"l"} : {gender:"p"}
        const santri = await Santri.findAll({
            where:filterBy,
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

    private async getStudentMondok(filter:string):Promise<SantriAttributes[]>{
        const filterBy = filter === "all" ? {} : filter==="p" ? {gender:"l"} : {gender:"p"}
        const santri = await Santri.findAll({
            where:filterBy,
            include:[
                {
                    model:StatusSantri,
                    where:{
                        status:1,
                        mondok:true
                    }
                }
            ]
        })
        return santri.map((e:any)=> e.get({plain:true}))
    }

    private async getSantriIzin():Promise<SantriAttributes[]>{
        const santri = await Santri.findAll({
            include:[
                {
                    model:StatusSantri,
                    where:{
                        status:1,
                        mondok:true
                    }
                },
                {
                    model:Permission,
                    where:{
                        status:true
                    }
                }
            ]
        })
        return santri.map((e:any)=>e.get({plain:true}))
    }

    private async calculateStudenPremission():Promise<any>{
        let female = 0
        let male = 0
        const santri = await this.getSantriIzin()
        for (let i of santri){
            if(i.gender.toLowerCase() === 'l'){
                male +=1
            }else if(i.gender.toLowerCase()==='p'){
                female+=1;
            }
        }
        return {female:female, male:male, total:female+male}
    }


   
    
  
    public async getStudent():Promise<messageAttribute<any>>{
        const female = await this.getAllStudend("P")
        const male = await this.getAllStudend("L")
        const all = await this.getAllStudend("all")
        const mondok = await this.getStudentMondok("all")
        const mondok_female = await this.getStudentMondok("p")
        const mondok_male = await this.getStudentMondok("l")
        const izin = await this.calculateStudenPremission()
        this.calculateStudenPremission()
        return this.message(200, {
            santri:{
                wanita: female.length,
                pria: male.length,
                total:all.length
            },
            mondok:{
                wanita:mondok_female.length,
                pria:mondok_male.length,
                total:mondok.length,
                izin:{
                    wanita: izin.wanita,
                    pria:izin.pria,
                    total:izin.total
                },
                total_on_pondok: mondok.length - izin.total
                
            },

        })
    }
}

export default new Student;