import { Optional, Model, DataTypes } from "sequelize";
import db from "../../../config/database";
import SantriAttributes from "./dto";
import StatusSantri from "../statusSantri/model";
import Permission from "../../bordingSchool/permission/model";

interface SantriCreationAttributes extends Optional<SantriAttributes, "uuid">{}
interface SantriInstance extends Model<SantriAttributes, SantriCreationAttributes>, SantriAttributes{
    createdAt:Date,
    updatedAt:Date
}

const Santri = db.define<SantriInstance>("santri",{
    uuid:{
        type:DataTypes.STRING,
        primaryKey:true,
        defaultValue:DataTypes.UUIDV4
    },
    nuwb:{
        type:DataTypes.STRING,
        allowNull:false
    },
    nisn:{
        type:DataTypes.STRING,
    },
    nama:{
        type:DataTypes.STRING
    },
    kode_lembaga:{
        type:DataTypes.INTEGER
    },
    gender:{
        type:DataTypes.CHAR(1)
    },
    t_lahir:{
        type:DataTypes.STRING
    },
    tgl_lahir:{
        type:DataTypes.DATEONLY
    },
    nik:{
        type:DataTypes.STRING
    },
    no_kk:{
        type:DataTypes.STRING
    },
    anak_ke:{
        type:DataTypes.INTEGER
    },
    alamat:{
        type:DataTypes.STRING
    },
    rt:{
        type:DataTypes.STRING
    },
    rw:{
        type:DataTypes.STRING
    },
    dusun:{
        type:DataTypes.STRING
    },
    desa:{
        type:DataTypes.STRING
    },
    kec:{
        type:DataTypes.STRING
    },
    kab:{
        type:DataTypes.STRING
    },
    prov:{
        type:DataTypes.STRING
    },
    domisili:{
        type:DataTypes.STRING
    },
    tinggal_bersama_wali:{
        type:DataTypes.BOOLEAN
    },
    kelas:{
        type:DataTypes.INTEGER
    },
    ruang:{
        type:DataTypes.STRING
    }
})

Santri.hasOne(StatusSantri, {foreignKey:"uuid_santri"})
StatusSantri.belongsTo(Santri, {foreignKey:"uuid_santri"})
Santri.hasMany(Permission, {foreignKey:"uuid_santri"})
Permission.belongsTo(Santri, {foreignKey:"uuid_santri"})

export default Santri;