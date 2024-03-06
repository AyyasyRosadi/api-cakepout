import { DataTypes, Model, Optional } from "sequelize";
import db from "../../config/database";
import PtkAttributes from "./dto";

interface PtkCreationsAttributes extends Optional<PtkAttributes,'uuid'>{};
interface PtkInstance extends Model<PtkAttributes,PtkCreationsAttributes>,PtkAttributes{};

const Ptk = db.define<PtkInstance>('ptk',{
    uuid:{
        type:DataTypes.STRING,
        primaryKey:true,
        defaultValue:DataTypes.UUIDV4
    },
    nupy:{
        type:DataTypes.STRING(14)
    },
    nama:{
        type:DataTypes.STRING(100)
    },
    tempat_lahir:{
        type:DataTypes.STRING,
    },
    tanggal_lahir:{
        type:DataTypes.DATEONLY
    },alamat:{
        type:DataTypes.STRING
    },
    kecamatan:{
        type:DataTypes.STRING
    },
    kabupaten:{
        type:DataTypes.STRING
    },
    provinsi:{
        type:DataTypes.STRING
    },
    gender:{
        type:DataTypes.STRING(1)
    },
    no_hp:{
        type:DataTypes.STRING
    },
    status_pernikahan:{
        type:DataTypes.STRING
    },
    pendidikan_terakhir:{
        type:DataTypes.STRING,
    },
    gelar:{
        type:DataTypes.STRING
    },
    gol_darah:{
        type:DataTypes.STRING(4)
    },
})

export default Ptk