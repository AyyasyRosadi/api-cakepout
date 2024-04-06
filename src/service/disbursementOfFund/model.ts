import { DataTypes, Model, Optional } from "sequelize";
import db from "../../config/database";
import DisbursementOfFundAttributes from "./dto";
import DetailOfActivity from "../detailOfActivity/model";
import Ptk from "../ptk/model";
import PtkAttributes from "../ptk/dto";
import DetailOfActivityAttributes from "../detailOfActivity/dto";

interface DisbursementOfFundCreationAttributes extends Optional<DisbursementOfFundAttributes,'uuid'|'reference_of_jurnal'|'recipient'|'ptk_id'>{}
interface DisbursementOfFundInstance extends Model<DisbursementOfFundAttributes,DisbursementOfFundCreationAttributes>, DisbursementOfFundAttributes{
    created_at:Date;
    updated_at:Date;
    ptk:PtkAttributes;
    detailOfActivity:DetailOfActivityAttributes;
};

const DisbursementOfFunds = db.define<DisbursementOfFundInstance>('disbursement_of_funds',{
    uuid:{
        type:DataTypes.STRING,
        primaryKey:true,
        defaultValue:DataTypes.UUIDV4
    },
    amount:{
        type:DataTypes.BIGINT
    },
    status:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    },
    withdraw:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    },
    accounting_year:{
        type:DataTypes.STRING
    },
    month_index:{
        type:DataTypes.INTEGER,
    },
    sharing_program:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    },
    recipient:{
        type:DataTypes.STRING
    },
    ptk_id:{
        type:DataTypes.STRING
    },
    activity_id:{
        type:DataTypes.STRING
    },
    reference_of_jurnal:{
        type:DataTypes.STRING,
    }
})

DetailOfActivity.hasMany(DisbursementOfFunds,{foreignKey:'activity_id'})
DisbursementOfFunds.belongsTo(DetailOfActivity,{foreignKey:'activity_id'})

Ptk.hasMany(DisbursementOfFunds,{foreignKey:'ptk_id'})
DisbursementOfFunds.belongsTo(Ptk,{foreignKey:'ptk_id'})



export default DisbursementOfFunds