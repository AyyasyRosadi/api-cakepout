import { DataTypes, Model, Optional } from "sequelize";
import db from "../../config/database";
import DetailOfActivityAttributes from "./dto";
import DisbursementOfFundAttributes from "../disbursementOfFunds/dto";

interface DetailOfActivityCreationAttributes extends Optional<DetailOfActivityAttributes,'uuid'|'no_sub_kegiatan'>{}
interface DetailOfActivityInstance extends Model<DetailOfActivityAttributes,DetailOfActivityCreationAttributes>,DetailOfActivityAttributes{
    created_at:Date;
    updated_at:Date;
    DisbursementOfFunds:Array<DisbursementOfFundAttributes>
};

const DetailOfActivity = db.define<DetailOfActivityInstance>('rincian_kegiatan',{
    uuid:{
        type:DataTypes.STRING,
        primaryKey:true,
        defaultValue:DataTypes.UUIDV4
    },
    uraian:{
        type:DataTypes.STRING
    },
    id_satuan:{
        type:DataTypes.INTEGER
    },
    vol:{
        type:DataTypes.INTEGER
    },
    harga_satuan:{
        type:DataTypes.INTEGER
    },
    metode_pencairan:{
        type:DataTypes.STRING
    },
    dari:{
        type:DataTypes.INTEGER
    },
    sampai:{
        type:DataTypes.INTEGER
    },
    total:{
        type:DataTypes.BIGINT
    },
    total_realisasi:{
        type:DataTypes.BIGINT
    },
    no_sub_kegiatan:{
        type:DataTypes.STRING
    },
    no_kegiatan:{
        type:DataTypes.STRING
    },
    tahun_ajar:{
        type:DataTypes.STRING
    },
    no_pendapatan:{
        type:DataTypes.STRING
    },
    sharing_program:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    }, 
})


export default DetailOfActivity