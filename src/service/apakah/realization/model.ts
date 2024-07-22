import db from "../../../config/database";
import { RealizationAttributes } from "./dto";
import { DataTypes, Model, Optional } from "sequelize";
import DetailOfActivity from "../detailOfActivities/model";

interface RealizitaionCreationAttributes extends Optional<RealizationAttributes, 'id'> { }
interface RealizationInstance extends Model<RealizationAttributes, RealizitaionCreationAttributes>, RealizationAttributes { };

const Realization = db.define<RealizationInstance>('realizations', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    academic_year: {
        type: DataTypes.STRING,
    },
    total_budget: {
        type: DataTypes.BIGINT,
    },
    total_realization: {
        type: DataTypes.BIGINT
    },
    detail_of_activity_id: {
        type: DataTypes.STRING
    }
})

DetailOfActivity.hasOne(Realization, { foreignKey: 'detail_of_activity_id' })
Realization.belongsTo(DetailOfActivity, { foreignKey: 'detail_of_activity_id' })

export default Realization