import YearActiveInSystemAttributes from "../service/yearActiveInSystem/dto";
import YearActiveInSystem from "../service/yearActiveInSystem/model";

class YearActiveInSystemHelper{
    public async getYear(nameSystem:string):Promise<string>{
        const yearActiveInSystem = await YearActiveInSystem.findOne({where:{name:nameSystem}})
        return yearActiveInSystem!.academic_year
    }
}

export default new YearActiveInSystemHelper;