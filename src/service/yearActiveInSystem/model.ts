import { DataTypes, Model, Optional } from "sequelize";
import YearActiveInSystemAttributes from "./dto";
import db from "../../config/database";


interface YearActiveInSystemCreationsAttributes extends Optional<YearActiveInSystemAttributes,'id'>{};
interface YearActiveInSystemInstance extends Model<YearActiveInSystemAttributes,YearActiveInSystemCreationsAttributes>,YearActiveInSystemAttributes{
    createdAt: Date;
    updatedAt: Date;
};

const YearActiveInSystem = db.define<YearActiveInSystemInstance>("year_active_in_systems", {
    id:{
        type:DataTypes.STRING,
        primaryKey:true,
        defaultValue:DataTypes.UUIDV4
    },
    name:{
        type:DataTypes.STRING,
    },
    academic_year:{
        type:DataTypes.STRING
    }
})

export default YearActiveInSystem