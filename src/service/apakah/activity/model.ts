import { DataTypes, Model, Optional } from "sequelize";
import db from "../../../config/database";
import ActivityAttributes from "./dto";

interface ActivityCreationAttributes extends Optional<ActivityAttributes, 'id'>{}
interface ActivityInstance extends Model<ActivityAttributes, ActivityCreationAttributes>, ActivityAttributes{
    created_at:Date;
    updated_at:Date;
}

const Activity = db.define<ActivityInstance>("activity",{
    id:{
        type:DataTypes.STRING,
        primaryKey:true,
        defaultValue:DataTypes.UUIDV4
    },
    activity_no:{
        type:DataTypes.INTEGER
    },
    name:{
        type:DataTypes.STRING
    },
    status:{
        type:DataTypes.INTEGER
    },
    component_id:{
        type:DataTypes.STRING
    },
    continue:{
        type:DataTypes.BOOLEAN
    },
    institution_no:{
        type:DataTypes.INTEGER
    },
    academic_year:{
        type:DataTypes.STRING
    }
})

export default Activity;