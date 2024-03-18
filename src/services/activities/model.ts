import db from "../../config/database";
import { DataTypes, Model } from "sequelize";
import ActivityAttributes from "./dto";
import DetailOfActivityAttributes from "../detailOfActivities/dto";
import DetailOfActivity from "../detailOfActivities/model";

interface ActivityInstance extends Model<ActivityAttributes>, ActivityAttributes {
    created_at: Date;
    updated_ad: Date;
    rincian_kegiatan: Array<DetailOfActivityAttributes>
}

const Activity = db.define<ActivityInstance>('list_kegiatan', {
    no_kegiatan: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    item_kegiatan: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'Ditunda'
    },
    no_komponen: {
        type: DataTypes.STRING
    },
    continue: {
        type: DataTypes.BOOLEAN
    }
})

Activity.hasMany(DetailOfActivity, { foreignKey: 'no_kegiatan' })
DetailOfActivity.belongsTo(Activity, { foreignKey: 'no_kegiatan' })

export default Activity;