import { DataTypes, Model, Optional } from "sequelize";
import db from "../../../config/database";
import ComponentAttributes from "./dto";
import Activity from "../activity/model";
import ActivityAttributes from "../activity/dto";

interface ComponentCreationAttributes extends Optional<ComponentAttributes, 'id'|'modifable'>{}
interface ComponentInstance extends Model<ComponentAttributes, ComponentCreationAttributes>, ComponentAttributes{
    created_at:Date;
    updated_at:Date;
    activity?:Array<ActivityAttributes>
}

const Component = db.define<ComponentInstance>('component', {
    id:{
        type:DataTypes.STRING,
        allowNull:false,
        primaryKey:true,
        defaultValue:DataTypes.UUIDV4
    },
    component_no:{
        type:DataTypes.INTEGER
    },
    item:{
        type:DataTypes.STRING
    },
    modifable:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    },
    program_id:{
        type:DataTypes.STRING
    },
    academic_year:{
        type:DataTypes.STRING
    },
    institution_no:{
        type:DataTypes.INTEGER
    }
})

Component.hasMany(Activity, {foreignKey:"component_id"})
Activity.belongsTo(Component, {foreignKey:"component_id"})

export default Component
