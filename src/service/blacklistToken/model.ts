import { DataTypes, Model, Optional } from "sequelize";
import db from "../../config/database";
import BlacklistTokenAttributes from "./dto";


interface BlacklistTokenInstance extends Model<BlacklistTokenAttributes>, BlacklistTokenAttributes { }

const BlacklistToken = db.define<BlacklistTokenInstance>('blacklist_token', {
    jti: {
        type: DataTypes.UUID
    }
}, {
    timestamps: false
})

export default BlacklistToken