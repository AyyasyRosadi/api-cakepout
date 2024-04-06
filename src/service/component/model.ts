import { DataTypes, Model } from "sequelize";
import db from "../../config/database";
import ComponentAttributes from "./dto";
import ActivityAttributes from "../activity/dto";
import Activity from "../activity/model";
import ProgramAttributes from "../program/dto";


interface ComponentInstance extends Model<ComponentAttributes>, ComponentAttributes {
    created_at: Date;
    updated_at: Date;
    list_kegiatan: Array<ActivityAttributes>
    program: ProgramAttributes;
}

const Component = db.define<ComponentInstance>('list_komponen', {
    no_komponen: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    item_komponen: {
        type: DataTypes.STRING
    },
    modifiable: {
        type: DataTypes.BOOLEAN
    },
    no_program: {
        type: DataTypes.STRING
    }
})

Component.hasMany(Activity, { foreignKey: 'no_komponen' })
Activity.belongsTo(Component, { foreignKey: 'no_komponen' })

export default Component