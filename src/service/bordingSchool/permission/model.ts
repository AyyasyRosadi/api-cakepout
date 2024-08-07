import { DataTypes, Model, Optional } from "sequelize";
import PermissionAttributes from "./dto";
import db from '../../../config/database'

interface PermissionCreationAttributes extends Optional<PermissionAttributes, 'uuid'>{}
interface PermissionInstance extends Model<PermissionAttributes, PermissionCreationAttributes>, PermissionAttributes{
    createdAt: Date;
    updatedAt: Date;
}

const Permission = db.define<PermissionInstance>('perizinan', {
    uuid:{
        type:DataTypes.STRING,
        defaultValue:DataTypes.UUIDV4,
        primaryKey:true
    }, 
    dari:{
        type:DataTypes.DATE,
    },
    sampai:{
        type:DataTypes.DATE,
    },
    keterangan:{
        type:DataTypes.STRING,
    },
    status:{
        type:DataTypes.INTEGER
    },
    uuid_santri:{
        type:DataTypes.STRING
    },
    id_izin:{
        type:DataTypes.INTEGER
    },
    uuid_penjemput:{
        type:DataTypes.STRING
    },
    waktu_balik:{
        type:DataTypes.DATE
    }
})

export default Permission;