import { Optional, Model, DataTypes } from 'sequelize';
import db from '../../../config/database';
import StatusSantriAttributes from './dto';

interface StatusSantriCreationAttributes extends Optional<StatusSantriAttributes,"id">{}
interface StatusSantriInstance extends Model<StatusSantriAttributes, StatusSantriCreationAttributes>, StatusSantriAttributes{
    createdAt: Date,
    updatedAt: Date
}

const StatusSantri = db.define<StatusSantriInstance>("status_santri",{
    id:{
        type:DataTypes.STRING,
        primaryKey:true,
        autoIncrement:true
    },
    status:{
        type:DataTypes.INTEGER,
        
    },
    uuid_golongan:{
        type:DataTypes.STRING
    },
    uuid_santri:{
        type:DataTypes.STRING
    },
    uuid_donatur:{
        type:DataTypes.STRING
    },
    tahun_masuk:{
        type:DataTypes.STRING
    },
    potongan_donatur:{
        type:DataTypes.INTEGER
    },
    mondok:{
        type:DataTypes.BOOLEAN
    },
    tahun_lulus:{
        type:DataTypes.INTEGER
    },
})

export default StatusSantri;